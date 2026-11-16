// Form endpoint for the consultation form, parcel inquiries and the
// newsletter signup: validates the submission and emails it to the site
// owner through the SMTP2GO HTTP API. Nothing is stored.
//
// Required environment variables (set in Vercel, never in the repo):
//   SMTP2GO_API_KEY      SMTP2GO API key
//   CONTACT_FROM_EMAIL   sender address verified in SMTP2GO
//   CONTACT_TO_EMAIL     inbox that receives submissions
// Optional:
//   CONTACT_FROM_NAME    display name for the sender (default below)

const SMTP2GO_URL = "https://api.smtp2go.com/v3/email/send";

const ROLES = ["Landowner", "Future builder", "Investor", "Other"];
const SERVICES = [
  "Buying a property",
  "Land Use & Feasibility Analysis",
  "Navigating Terrain & Infrastructure",
  "Strategic Planning & Due Diligence",
  "Not sure yet",
];

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Single-line text: collapse whitespace so values can't inject headers.
const oneLine = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "";

const multiLine = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/\r\n/g, "\n").trim().slice(0, max) : "";

const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

// Best-effort throttle per server instance: 6 submissions per 10 minutes per IP.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json({ ok: false, error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success, send nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  const kind = body.kind === "newsletter" || body.kind === "parcel" ? body.kind : "consultation";
  const email = oneLine(body.email, 200);
  if (!EMAIL_RE.test(email)) {
    return Response.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  let subject: string;
  let rows: [string, string][];
  let message = "";
  let replyName = "";

  if (kind === "newsletter") {
    subject = "New deal-alert signup";
    rows = [["Email", email]];
  } else {
    const name = oneLine(body.name, 120);
    message = multiLine(body.message, 5000);
    if (!name || !message) {
      return Response.json(
        { ok: false, error: "Please fill in your name, a valid email, and a message." },
        { status: 400 },
      );
    }
    replyName = name;
    const phone = oneLine(body.phone, 40);
    rows = [
      ["Name", name],
      ["Email", email],
      ["Phone", phone || "-"],
    ];
    if (kind === "parcel") {
      const code = oneLine(body.parcelCode, 60);
      const pname = oneLine(body.parcelName, 200);
      subject = `Property inquiry: ${pname || code || "listing"} (${name})`;
      rows.push(["Property", `${pname || "-"} (${code || "-"})`]);
    } else {
      const role = ROLES.includes(body.role as string) ? (body.role as string) : "Other";
      const service = SERVICES.includes(body.service as string) ? (body.service as string) : "Not sure yet";
      subject = `New consultation request from ${name}`;
      rows.push(["I am a", role], ["Interested in", service], ["Property location", oneLine(body.location, 200) || "-"]);
    }
  }

  const apiKey = process.env.SMTP2GO_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !from || !to) {
    console.error("Forms are not configured: missing SMTP2GO_API_KEY, CONTACT_FROM_EMAIL or CONTACT_TO_EMAIL");
    return Response.json({ ok: false, error: "Mail is not configured." }, { status: 500 });
  }
  const fromName = process.env.CONTACT_FROM_NAME || "RA Lands Website";

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n") + (message ? `\n\nMessage:\n${message}\n` : "\n");
  const html =
    `<table cellpadding="6" style="font-family:sans-serif;font-size:14px">` +
    rows.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`).join("") +
    `</table>` +
    (message
      ? `<p style="font-family:sans-serif;font-size:14px"><strong>Message</strong></p>` +
        `<p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(message)}</p>`
      : "");

  try {
    const res = await fetch(SMTP2GO_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Smtp2go-Api-Key": apiKey },
      body: JSON.stringify({
        sender: `${fromName} <${from}>`,
        to: [to],
        subject,
        text_body: text,
        html_body: html,
        custom_headers: [
          { header: "Reply-To", value: `${(replyName || "Subscriber").replace(/[<>",]/g, "")} <${email}>` },
        ],
      }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.data || data.data.succeeded !== 1) {
      console.error("SMTP2GO send failed", res.status, JSON.stringify(data));
      return Response.json({ ok: false, error: "Could not send message." }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("SMTP2GO request error", err);
    return Response.json({ ok: false, error: "Could not send message." }, { status: 502 });
  }
}

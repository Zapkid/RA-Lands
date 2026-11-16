import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Navy "RA" mark on sand, in the logo's colors. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#e6d4a8",
          color: "#0f2d57",
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: -2,
          borderRadius: 12,
        }}
      >
        RA
      </div>
    ),
    size,
  );
}

/**
 * Illustrated placeholder landscape in the brand palette. Used wherever a
 * parcel has no photo yet and in the hero collage, so the site never shows
 * stock photos it has no rights to.
 */
const PALETTES = [
  { sky: "#f3ead8", far: "#c9d2e0", mid: "#e8dcc2", near: "#3d5a85", sun: "#d9a273" },
  { sky: "#f6efe0", far: "#e8dcc2", mid: "#c98b5a", near: "#a0602f", sun: "#12294d" },
  { sky: "#dde5f0", far: "#a8b8d0", mid: "#3d5a85", near: "#12294d", sun: "#f6efe0" },
  { sky: "#f3e6d6", far: "#e0c3a0", mid: "#c98b5a", near: "#12294d", sun: "#fff4d6" },
] as const;

export function LandscapeArt({
  variant = 0,
  className = "",
}: {
  variant?: number;
  className?: string;
}) {
  const p = PALETTES[Math.abs(variant) % PALETTES.length];
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label="Illustration of open land"
    >
      <rect width="400" height="300" fill={p.sky} />
      <circle cx="300" cy="70" r="26" fill={p.sun} />
      <path d="M0 170 C60 130 120 140 190 165 S320 150 400 135 L400 300 L0 300Z" fill={p.far} />
      <path d="M0 205 C80 175 160 185 240 205 S350 210 400 190 L400 300 L0 300Z" fill={p.mid} />
      <path d="M0 250 C90 225 170 232 250 248 S350 255 400 240 L400 300 L0 300Z" fill={p.near} />
    </svg>
  );
}

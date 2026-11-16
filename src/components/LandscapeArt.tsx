/**
 * Illustrated placeholder landscape in the brand palette. Used wherever a
 * parcel has no photo yet and in the hero collage, so the site never shows
 * stock photos it has no rights to.
 */
const PALETTES = [
  { sky: "#eef1ec", far: "#d9dfcf", mid: "#e6d4a8", near: "#b7c3a5", sun: "#f1d58c" },
  { sky: "#f6efdc", far: "#e6d4a8", mid: "#c9b27a", near: "#7f8f73", sun: "#c39a45" },
  { sky: "#e4ebf2", far: "#b9c8d8", mid: "#a9b79a", near: "#55654a", sun: "#f6efdc" },
  { sky: "#f3e6d6", far: "#e0c3a0", mid: "#c98f5e", near: "#a8622f", sun: "#fff4d6" },
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

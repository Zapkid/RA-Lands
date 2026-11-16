/** Shared class strings so every button and container looks the same. */
export const container = "mx-auto w-full max-w-[1170px] px-4 sm:px-6";

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60";

/** Gold call to action (olive text keeps contrast above 4.5:1). */
export const btnGold = `${btnBase} bg-gold text-olive hover:bg-sand`;
/** Sage button for secondary actions. */
export const btnSage = `${btnBase} bg-sage-deep text-white hover:bg-olive`;
/** Outline button on light backgrounds. */
export const btnOutline = `${btnBase} border-2 border-olive text-olive hover:bg-olive hover:text-white`;
/** Outline button on dark backgrounds. */
export const btnOutlineLight = `${btnBase} border-2 border-white text-white hover:bg-white hover:text-olive`;

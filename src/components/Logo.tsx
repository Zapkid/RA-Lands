import Image from "next/image";
import { SITE } from "@/lib/site";

/**
 * The supplied logo has wide white margins. This crops to the artwork
 * (x 240-935, y 110-650 of the 1168x784 image) so it reads at header size.
 */
const CROP = { x: 240, y: 110, w: 695, h: 540 };
const SRC = { w: 1168, h: 784 };

export function Logo({ className = "w-[150px] sm:w-[170px]" }: { className?: string }) {
  return (
    <span
      className={`relative block overflow-hidden ${className}`}
      style={{ aspectRatio: `${CROP.w} / ${CROP.h}` }}
    >
      <Image
        src="/logo.jpg"
        alt={`${SITE.name} logo`}
        width={SRC.w}
        height={SRC.h}
        priority
        className="absolute max-w-none"
        style={{
          width: `${(SRC.w / CROP.w) * 100}%`,
          height: `${(SRC.h / CROP.h) * 100}%`,
          left: `${(-CROP.x / CROP.w) * 100}%`,
          top: `${(-CROP.y / CROP.h) * 100}%`,
        }}
      />
    </span>
  );
}

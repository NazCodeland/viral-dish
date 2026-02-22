"use client";
// components/RestaurantPill.tsx
//
// opacity stays at 0.01 when hidden (not 0) to keep the backdrop-blur
// compositor layer alive — killing the layer causes a visible snap when
// it re-composites on reveal.

import { useOverlay } from "@/state/useOverlay";

interface Props {
  name: string;
  distanceKm: number;
}

export default function RestaurantPill({ name, distanceKm }: Props) {
  // effectivelyVisible already accounts for both the reveal timer and any
  // active force-hide (hold gesture) — no extra logic needed here.
  const { effectivelyVisible } = useOverlay();

  return (
    <div
      className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 w-fit transition-opacity duration-300"
      style={{
        opacity: effectivelyVisible ? 1 : 0.01,
        pointerEvents: effectivelyVisible ? "auto" : "none",
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#34C759"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
      <span className="text-[13px] font-semibold text-white tracking-[0.1px]">
        Fulfilled by {name} ({distanceKm}km)
      </span>
    </div>
  );
}

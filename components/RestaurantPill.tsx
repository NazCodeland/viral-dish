"use client";
// components/RestaurantPill.tsx

interface Props {
  name: string;
}

export default function RestaurantPill({ name }: Props) {
  return (
    <div className="flex items-start gap-1.5 text-white/70">
      <svg
        className="shrink-0 mt-1"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
      <span className="text-sm font-medium leading-snug line-clamp-2">
        Made by {name}
      </span>
    </div>
  );
}

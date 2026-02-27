"use client";
// components/Logo.tsx

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons";

interface Props {
  visible?: boolean;
}

export default function Logo({ visible = true }: Props) {
  return (
    <div
      className="fixed top-[max(16px,env(safe-area-inset-top))] left-3 z-50"
      style={{
        opacity: visible ? 1 : 0,
        transition: visible ? "opacity 300ms 120ms" : "none",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <h1
        className="flex items-center gap-1 font-extrabold text-xl tracking-tight drop-shadow-md text-white"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <FontAwesomeIcon icon={faFire} style={{ color: "#FF4500" }} />
        TrendBites
      </h1>
    </div>
  );
}

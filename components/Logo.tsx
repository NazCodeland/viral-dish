"use client";
// components/Logo.tsx

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons";

interface LogoProps {
  /** When true the logo fades out — stays in DOM to avoid layout reflow */
  hidden?: boolean;
}

export default function Logo({ hidden = false }: LogoProps) {
  return (
    <div
      className="fixed top-[max(16px,env(safe-area-inset-top))] left-3 z-50 transition-opacity duration-150"
      style={{
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
      }}
    >
      {/* Invisible SVG — defines the flame gradient used by the icon */}
      <svg width="0" height="0" className="absolute">
        <defs>
          {/* Fire burns bottom-to-top: blue base → yellow → orange → red tip */}
          <linearGradient id="fire-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" /> {/* Blue   */}
            <stop offset="33%" stopColor="#eab308" /> {/* Yellow */}
            <stop offset="66%" stopColor="#f97316" /> {/* Orange */}
            <stop offset="100%" stopColor="#ef4444" /> {/* Red    */}
          </linearGradient>
        </defs>
      </svg>

      <h1
        className="flex items-center gap-1 font-extrabold text-xl tracking-tight"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <FontAwesomeIcon
          icon={faFire}
          className="[&_path]:fill-[url(#fire-gradient)]"
        />
        <span
          style={{
            color: "white",
            textShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
        >
          TrendBites
        </span>
      </h1>
    </div>
  );
}

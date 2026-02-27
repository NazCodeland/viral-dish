"use client";
// components/Badge.tsx

import type { ReactNode } from "react";

type Variant = "blue" | "glass" | "outline";

interface Props {
  label: string;
  prefix?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  variant?: Variant;
  px?: string; // e.g. "px-2" | "px-1.5" — defaults per variant
  textColor?: string; // e.g. "rgba(10, 30, 120, 1)" — overrides variant default
  onClick?: () => void;
  className?: string;
}

export default function Badge({
  label,
  prefix,
  icon,
  iconPosition = "left",
  variant = "glass",
  px,
  textColor,
  onClick,
  className = "",
}: Props) {
  // Base classes copied exactly from the working pill spans/buttons
  // glass: "flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/10 rounded-full px-2.25 py-1 text-white text-xs font-bold"
  // outline: same but dashed border + dimmer colors
  // blue: the trending tag div styles

  const defaultPx: Record<Variant, string> = {
    glass: "px-2",
    outline: "px-2",
    blue: "px-2.5",
  };

  const resolvedPx = px ?? defaultPx[variant];

  let variantClasses = "";
  let variantStyle: React.CSSProperties = {};

  if (variant === "glass") {
    variantClasses = `flex items-center gap-1 bg-white/10 backdrop-blur border border-white/10 rounded-full ${resolvedPx} py-1 text-white text-xs font-bold`;
  } else if (variant === "outline") {
    variantClasses = `flex items-center gap-1 rounded-full ${resolvedPx} py-1 text-xs font-bold`;
    variantStyle = {
      background: "rgba(255,255,255,0.05)",
      border: "1px dashed rgba(255,255,255,0.3)",
      color: "rgba(255,255,255,0.5)",
    };
  } else if (variant === "blue") {
    variantClasses = `text-[10px] font-extrabold uppercase tracking-wider ${resolvedPx} py-1 rounded-md w-max`;
    variantStyle = {
      background: "rgba(30, 80, 255, 0.35)",
      border: "1px solid rgba(80, 160, 255, 0.28)",
      color: "rgba(120, 195, 255, 0.95)",
      textShadow: "0 0 10px rgba(80, 160, 255, 0.55)",
    };
  }

  if (textColor)
    variantStyle = { ...variantStyle, color: textColor, textShadow: "none" };

  const interactiveClasses = onClick
    ? "cursor-pointer transition-colors active:bg-white/20"
    : "";

  const fullClass = [variantClasses, interactiveClasses, className]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {icon && iconPosition === "left" && <span>{icon}</span>}
      {prefix && <span style={{ opacity: 0.75 }}>{prefix}&nbsp;</span>}
      {label}
      {icon && iconPosition === "right" && <span>{icon}</span>}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={fullClass}
        style={variantStyle}
      >
        {content}
      </button>
    );
  }

  return (
    <span className={fullClass} style={variantStyle}>
      {content}
    </span>
  );
}

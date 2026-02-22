"use client";
// components/MenuButton.tsx

import { Menu } from "lucide-react";

interface Props {
  onClick?: () => void;
  visible?: boolean;
}

export default function MenuButton({ onClick, visible = true }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label="Open menu"
      style={{
        opacity: visible ? 1 : 0,
        transition: visible ? "opacity 300ms 120ms" : "none",
        pointerEvents: visible ? "auto" : "none",
      }}
      className="fixed top-[max(12px,env(safe-area-inset-top))] right-3 z-50 w-10 h-10 flex items-center justify-center active:scale-90 cursor-pointer"
    >
      <Menu size={20} stroke="white" strokeWidth={2.8} />
    </button>
  );
}

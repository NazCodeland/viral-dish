'use client';
// components/MenuButton.tsx

interface Props {
  onClick?: () => void;
}

export default function MenuButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label="Open menu"
      className="absolute top-[max(50px,env(safe-area-inset-top))] right-2 z-20 w-10 h-10 flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="white" strokeWidth="2.2" strokeLinecap="round">
        <line x1="3" y1="6"  x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
}

'use client';
// components/CreatorHeader.tsx

interface Props {
  handle: string;
  avatarUrl: string;
  onClick?: () => void;
}

export default function CreatorHeader({ handle, avatarUrl, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={`View ${handle} profile`}
      className="absolute top-[max(50px,env(safe-area-inset-top))] left-4 z-20 flex items-center gap-2.5 bg-transparent border-none cursor-pointer transition-transform active:scale-95"
    >
      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-full border-2 border-white/80 bg-cover bg-center flex-shrink-0"
        style={{ backgroundImage: `url('${avatarUrl}')` }}
      />
      {/* Text */}
      <div className="flex flex-col text-left [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
        <span className="text-white/80 text-[11px] font-medium uppercase tracking-[0.5px]">
          Recipe By
        </span>
        <span className="text-white font-bold text-[15px]">{handle}</span>
      </div>
    </button>
  );
}

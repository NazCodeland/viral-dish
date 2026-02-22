"use client";
// components/SocialRail.tsx

import { useState } from "react";

interface Props {
  likes: number;
  saves: number;
  comments: number;
}

function formatCount(n: number): string {
  if (n >= 1_000_000)
    return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

export default function SocialRail({ likes, saves }: Props) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeDelta, setLikeDelta] = useState(0);
  const [saveDelta, setSaveDelta] = useState(0);

  function toggleLike() {
    const next = !isLiked;
    setIsLiked(next);
    setLikeDelta((d) => d + (next ? 1 : -1));
  }

  function toggleBookmark() {
    const next = !isBookmarked;
    setIsBookmarked(next);
    setSaveDelta((d) => d + (next ? 1 : -1));
  }

  return (
    <div className="absolute right-2 bottom-44 -translate-y-1/2 z-20 flex flex-col gap-4">
      {/* Like */}
      <button
        onClick={toggleLike}
        aria-label="Like"
        aria-pressed={isLiked}
        className="flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer transition-transform active:scale-[0.85]"
      >
        {isLiked ? (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="#FF2E63"
            stroke="#FF2E63"
            strokeWidth="1.5"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        )}
        <span className="text-[11px] font-semibold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
          {formatCount(likes + likeDelta)}
        </span>
      </button>

      {/* Bookmark */}
      <button
        onClick={toggleBookmark}
        aria-label="Save"
        aria-pressed={isBookmarked}
        className="flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer transition-transform active:scale-[0.85]"
      >
        {isBookmarked ? (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="#FFD700"
            stroke="#FFD700"
            strokeWidth="1.5"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        )}
        <span className="text-[11px] font-semibold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
          {formatCount(saves + saveDelta)}
        </span>
      </button>

      {/* Share */}
      <button
        onClick={() => {}}
        aria-label="Share"
        className="flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer transition-transform active:scale-[0.85]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
          width="22"
          height="22"
        >
          <path d="M10.938 3.175a.674.674 0 0 1 1.138-.488l6.526 6.215c.574.547.554 1.47-.043 1.991l-6.505 5.676a.674.674 0 0 1-1.116-.508V13.49s-6.985-1.258-9.225 2.854c-.209.384-1.023.518-.857-1.395.692-3.52 2.106-9.017 10.082-9.017z" />
        </svg>
        <span className="text-[11px] font-semibold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
          Share
        </span>
      </button>
    </div>
  );
}

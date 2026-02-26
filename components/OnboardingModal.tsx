"use client";
// components/OnboardingModal.tsx
//
// Full-page modal shown on first visit. Sits on top of the feed so the URL
// never changes and the feed is already loaded underneath.
// Dismiss via the CTA — localStorage tracking to be added later.

import { useEffect, useState } from "react";
import Image from "next/image";

interface Props {
  onDismiss: () => void;
}

const LINES = [
  { text: "Viral dishes.", delay: "0ms" },
  { text: "Made by local restaurants.", delay: "180ms" },
  { text: "Delivered to you.", delay: "360ms" },
];

const DISH_PHOTOS = [
  {
    url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop",
    label: "Pizza",
  },
  {
    url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop",
    label: "Burger",
  },
  {
    url: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=300&h=300&fit=crop",
    label: "Sushi",
  },
  {
    url: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=300&h=300&fit=crop",
    label: "Ramen",
  },
  {
    url: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300&h=300&fit=crop",
    label: "Pasta",
  },
  {
    url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop",
    label: "Salad",
  },
  {
    url: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=300&h=300&fit=crop",
    label: "Tacos",
  },
  {
    url: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=300&h=300&fit=crop",
    label: "Steak",
  },
];

export default function OnboardingModal({ onDismiss }: Props) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  function handleDismiss() {
    setLeaving(true);
    setTimeout(onDismiss, 400);
  }

  return (
    <div
      className="fixed inset-0 z-100 flex flex-col justify-between overflow-hidden"
      style={{
        background: "var(--background)",
        opacity: leaving ? 0 : 1,
        transition: "opacity 400ms ease",
      }}
    >
      {/* Top — wordmark */}
      <div
        className="px-6 pt-14"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-12px)",
          transition: "opacity 600ms ease, transform 600ms ease",
        }}
      >
        <span
          className="text-[13px] font-semibold tracking-[0.2em] uppercase"
          style={{ color: "#34C759" }}
        >
          ViralDish
        </span>
      </div>

      {/* Middle — slogan + dish strip */}
      <div className="flex flex-col gap-1">
        <div className="px-6 flex flex-col gap-1">
          {LINES.map((line, i) => (
            <h1
              key={i}
              style={{
                fontSize: "clamp(26px, 7vw, 42px)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: i === 0 ? "#34C759" : "var(--foreground)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 700ms ease, transform 700ms ease",
                transitionDelay: leaving ? "0ms" : line.delay,
              }}
            >
              {line.text}
            </h1>
          ))}
        </div>

        {/* Scrolling dish photo strip */}
        <div
          style={{
            overflow: "hidden",
            marginTop: "28px",
            opacity: visible ? 1 : 0,
            transition: "opacity 700ms ease",
            transitionDelay: leaving ? "0ms" : "560ms",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              animation: "dishScroll 40s linear infinite",
              width: "max-content",
              paddingLeft: "24px",
            }}
          >
            {[...DISH_PHOTOS, ...DISH_PHOTOS].map((dish, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  flexShrink: 0,
                  width: "220px",
                  height: "220px",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={dish.url}
                  alt={dish.label}
                  fill
                  sizes="220px"
                  style={{ objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "10px 12px",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.03em",
                    zIndex: 1,
                  }}
                >
                  {dish.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom — CTA */}
      <div
        className="px-6 pb-12"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 700ms ease, transform 700ms ease",
          transitionDelay: leaving ? "0ms" : "700ms",
        }}
      >
        <button
          onClick={handleDismiss}
          className="w-full h-14 rounded-full font-bold text-lg tracking-[0.1px] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          style={{
            background: "#34C759",
            color: "#003a10",
            boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          {"Show me what's viral"}
        </button>

        <p
          className="text-center text-xs mt-4"
          style={{ color: "var(--muted-foreground)" }}
        >
          By continuing you agree to our Terms &amp; Privacy Policy
        </p>
      </div>

      <style>{`
        @keyframes dishScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

"use client";
// components/LocationModal.tsx
//
// Shown when the user taps "Order Now" without having shared location.
// Explains why location is needed, then fires the browser prompt on confirm.
// Dismiss via X — no "Not now" dead-end option.
//
// Uses CSS variable tokens from globals.css so it automatically adapts
// to the user's OS light/dark theme preference.

import { MapPin, X } from "lucide-react";

interface Props {
  open: boolean;
  onRequestLocation: () => void;
  onDismiss: () => void;
}

export default function LocationModal({
  open,
  onRequestLocation,
  onDismiss,
}: Props) {
  if (!open) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-end justify-center pb-6 px-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onDismiss}
    >
      {/* Sheet — stop propagation so clicks inside don't dismiss */}
      <div
        className="w-full max-w-sm rounded-3xl p-6 flex flex-col gap-5"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "0 24px 48px rgba(0,0,0,0.3)",
          color: "var(--card-foreground)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "var(--muted)" }}
          >
            <MapPin
              className="w-5 h-5"
              style={{ color: "var(--foreground)" }}
            />
          </div>
          <button
            onClick={onDismiss}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            style={{ background: "var(--muted)" }}
            aria-label="Dismiss"
          >
            <X
              className="w-4 h-4"
              style={{ color: "var(--muted-foreground)" }}
            />
          </button>
        </div>

        {/* Copy */}
        <div className="flex flex-col gap-1.5">
          <h2
            className="font-bold text-lg leading-snug"
            style={{ color: "var(--foreground)" }}
          >
            Find restaurants near you
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            We need your location to show nearby restaurants making this dish
            and give you an accurate delivery time.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onRequestLocation}
          className="w-full rounded-full font-bold text-base tracking-[0.1px] transition-all duration-200 active:scale-[0.98] cursor-pointer"
          style={{
            height: "52px",
            background: "#34C759",
            color: "#003a10",
            boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          Allow Location
        </button>
      </div>
    </div>
  );
}

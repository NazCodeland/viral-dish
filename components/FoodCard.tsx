"use client";
// components/FoodCard.tsx

import { useEffect, useRef } from "react";
import type { Dish } from "@/app/types";
import { OverlayProvider, useOverlay } from "@/state/useOverlay";
import CreatorHeader from "./CreatorHeader";
import OrderPanel from "./OrderPanel";
import SocialRail from "./SocialRail";

interface Props {
  dish: Dish;
  onComment?: () => void;
  onCreator?: () => void;
  onCustomize?: () => void;
  onOverlayChange?: (visible: boolean) => void;
}

// How long the user must hold before we treat it as a "hold" vs a "tap".
// 250 ms matches Instagram Reels and TikTok clear-mode behaviour.
const HOLD_THRESHOLD_MS = 250;

function FoodCardInner({
  dish,
  onComment,
  onCreator,
  onCustomize,
  onOverlayChange,
}: Props) {
  const {
    effectivelyVisible,
    triggerReveal,
    hide,
    forceHide,
    cancelForceHide,
  } = useOverlay();

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Refs for tap-vs-hold detection — refs, not state, because we never
  // want a re-render mid-gesture.
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didHoldRef = useRef(false);

  // Sync effectivelyVisible up to the page so MenuButton can react.
  useEffect(() => {
    onOverlayChange?.(effectivelyVisible);
  }, [effectivelyVisible, onOverlayChange]);

  // Play / pause / reset on scroll intersection.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.9) {
          triggerReveal();
          videoRef.current?.play().catch(() => {});
        } else {
          hide();
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
        }
      },
      { root: null, threshold: [0, 0.9] },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [triggerReveal, hide]);

  // ── Tap-vs-hold handlers ─────────────────────────────────────────────────

  function handlePointerDown() {
    didHoldRef.current = false;

    holdTimerRef.current = setTimeout(() => {
      // Threshold passed → treat as hold → clear UI
      didHoldRef.current = true;
      forceHide();
    }, HOLD_THRESHOLD_MS);
  }

  function handlePointerUp() {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    if (didHoldRef.current) {
      // Released after a hold → restore UI
      cancelForceHide();
    } else {
      // Released before threshold → it was a tap → toggle play / pause
      const video = videoRef.current;
      if (video) {
        if (video.paused) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    }

    didHoldRef.current = false;
  }

  function handlePointerLeave() {
    // Finger / cursor left the element mid-hold — treat as a release.
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (didHoldRef.current) {
      cancelForceHide();
      didHoldRef.current = false;
    }
  }

  // ── Shared transition style for UI layers ────────────────────────────────

  const overlayStyle: React.CSSProperties = {
    opacity: effectivelyVisible ? 1 : 0,
    transitionDelay: effectivelyVisible ? "120ms" : "0ms",
    pointerEvents: effectivelyVisible ? "auto" : "none",
  };

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen w-full shrink-0 flex-col justify-end overflow-hidden bg-black font-['Inter',sans-serif]"
    >
      {/* ── Video layer (z-0) ─────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {dish.videoSrc ? (
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            poster={dish.posterUrl}
            className="h-full w-full object-cover"
          >
            <source src={dish.videoSrc} type="video/mp4" />
          </video>
        ) : (
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url('${dish.posterUrl}')` }}
          />
        )}
      </div>

      {/*
        ── Tap / hold capture layer (z-10) ──────────────────────────────
        Sits above the video but below all UI (z-20).
        • touch-action: none  → prevents the browser stealing the gesture
          for scrolling before our timer fires.
        • user-select / -webkit-touch-callout: none  → suppresses the iOS
          "Save Image" and Android long-press context menus.
        • pointer-events always "auto" so it catches every gesture even
          when the UI is hidden.
      */}
      <div
        className="absolute inset-0 z-10"
        style={{
          touchAction: "pan-y",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* ── UI layers (z-20) — always above the capture div ──────────── */}

      {/* CreatorHeader has z-20 baked in via its own className */}
      <CreatorHeader
        handle={dish.creator.handle}
        avatarUrl={dish.creator.avatarUrl}
        onClick={onCreator}
      />

      {/* SocialRail has z-20 baked in via its own className */}
      <div className="transition-opacity duration-300" style={overlayStyle}>
        <SocialRail
          likes={dish.stats.likes}
          saves={dish.stats.saves}
          comments={dish.stats.comments}
          onComment={onComment}
        />
      </div>

      {/* OrderPanel reads effectivelyVisible from context directly */}
      <div className="relative z-20">
        <OrderPanel
          title={dish.title}
          restaurantName={dish.restaurant.name}
          distanceKm={dish.restaurant.distanceKm}
          arrivalTime={dish.restaurant.arrivalTime}
          arrivalMinutes={dish.restaurant.arrivalMinutes}
          price={dish.price}
          onCustomize={onCustomize}
        />
      </div>
    </div>
  );
}

export default function FoodCard(props: Props) {
  return (
    <OverlayProvider>
      <FoodCardInner {...props} />
    </OverlayProvider>
  );
}

"use client";
// components/FoodCard.tsx

import { useEffect, useRef } from "react";
import type { Dish } from "@/app/types";
import { OverlayProvider, useOverlay, useHoldToHide } from "@/state/useOverlay";
import CreatorAndSocialRail from "./CreatorAndSocialRail";
import OrderPanel from "./OrderPanel";

interface Props {
  dish: Dish;
  isLocationShared: boolean;
  onLocationGranted: () => void;
  onComment?: () => void;
  onCreator?: () => void;
  onCustomize?: () => void;
  onOverlayChange?: (visible: boolean) => void;
  onHoldChange?: (holding: boolean) => void;
}

function FoodCardInner({
  dish,
  isLocationShared,
  onLocationGranted,
  onCreator,
  onCustomize,
  onOverlayChange,
}: Props) {
  const { effectivelyVisible, triggerReveal, hide } = useOverlay();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    onOverlayChange?.(effectivelyVisible);
  }, [effectivelyVisible, onOverlayChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollRoot = container.closest(
      "[data-scroll-root]",
    ) as HTMLElement | null;

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
      { root: scrollRoot, threshold: [0, 0.9] },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [triggerReveal, hide]);

  function togglePlayPause() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  const holdProps = useHoldToHide({ onTap: togglePlayPause });

  const overlayStyle: React.CSSProperties = {
    opacity: effectivelyVisible ? 1 : 0,
    transitionDelay: effectivelyVisible ? "120ms" : "0ms",
    pointerEvents: effectivelyVisible ? "auto" : "none",
  };

  return (
    <div
      ref={containerRef}
      className="relative flex h-dvh w-full shrink-0 flex-col justify-end overflow-hidden bg-black font-['Inter',sans-serif]"
      style={{
        touchAction: "pan-y",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
      }}
      {...holdProps}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* ── Video layer ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {dish.videoSrc ? (
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            poster={dish.posterUrl}
            className="h-full w-full object-cover"
            onContextMenu={(e) => e.preventDefault()}
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

      {/* ── UI layers ─────────────────────────────────────────────────── */}
      <div className="transition-opacity duration-300" style={overlayStyle}>
        <CreatorAndSocialRail
          handle={dish.creator.handle}
          avatarUrl={dish.creator.avatarUrl}
          likes={dish.stats.likes}
          saves={dish.stats.saves}
          comments={dish.stats.comments}
          onCreator={onCreator}
        />
      </div>

      <div className="relative z-20">
        <OrderPanel
          title={dish.title}
          price={dish.price}
          views={dish.views}
          rating={dish.rating}
          arrivalMinutes={dish.restaurant.arrivalMinutes}
          isLocationShared={isLocationShared}
          onLocationGranted={onLocationGranted}
          onCustomize={onCustomize}
          description={dish.dishDescription}
        />
      </div>
    </div>
  );
}

export default function FoodCard(props: Props) {
  return (
    <OverlayProvider onHoldChange={props.onHoldChange}>
      <FoodCardInner {...props} />
    </OverlayProvider>
  );
}

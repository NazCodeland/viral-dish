"use client";
// components/FoodCard.tsx

import { useEffect, useRef } from "react";
import type { Dish } from "@/app/types";
import { OverlayProvider, useOverlay } from "@/state/useOverlay";
import CreatorHeader from "./CreatorHeader";
import MenuButton from "./MenuButton";
import OrderPanel from "./OrderPanel";
import SocialRail from "./SocialRail";

interface Props {
  dish: Dish;
  onComment?: () => void;
  onMenu?: () => void;
  onCreator?: () => void;
  onCustomize?: () => void;
}

function FoodCardInner({
  dish,
  onComment,
  onMenu,
  onCreator,
  onCustomize,
}: Props) {
  const { visible, triggerReveal, hide } = useOverlay();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.6) {
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
      { root: null, threshold: [0, 0.6] },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [triggerReveal, hide]);

  const overlayTransition = {
    opacity: visible ? 1 : 0,
    transitionDelay: visible ? "120ms" : "0ms",
    pointerEvents: (visible
      ? "auto"
      : "none") as React.CSSProperties["pointerEvents"],
  };

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen w-full shrink-0 flex-col justify-end overflow-hidden bg-black font-['Inter',sans-serif]"
    >
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

      <CreatorHeader
        handle={dish.creator.handle}
        avatarUrl={dish.creator.avatarUrl}
        onClick={onCreator}
      />

      <div
        className="transition-opacity duration-300"
        style={overlayTransition}
      >
        <MenuButton onClick={onMenu} />
      </div>

      <div
        className="transition-opacity duration-300"
        style={overlayTransition}
      >
        <SocialRail
          likes={dish.stats.likes}
          saves={dish.stats.saves}
          comments={dish.stats.comments}
          onComment={onComment}
        />
      </div>

      <div style={{ pointerEvents: visible ? "auto" : "none" }}>
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

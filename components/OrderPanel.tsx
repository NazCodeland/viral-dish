"use client";
// components/OrderPanel.tsx

import { useState } from "react";
import { useOverlay } from "@/state/useOverlay";
import RestaurantPill from "./RestaurantPill";
import CustomizeDish from "./CustomizeDish";

interface Props {
  title: string;
  restaurantName: string;
  distanceKm: number;
  arrivalTime: string;
  arrivalMinutes: number;
  price: number;
  onCustomize?: () => void;
}

type OrderState = "idle" | "loading" | "placed";

export default function OrderPanel({
  title,
  restaurantName,
  distanceKm,
  arrivalTime,
  arrivalMinutes,
  price,
  onCustomize,
}: Props) {
  const { visible } = useOverlay();
  const [orderState, setOrderState] = useState<OrderState>("idle");

  function placeOrder() {
    if (orderState !== "idle") return;
    setOrderState("loading");
    setTimeout(() => setOrderState("placed"), 1500);
  }

  const formattedPrice = price.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 2,
  });

  const buttonClass = [
    "w-full h-14 rounded-full flex items-center justify-center gap-2",
    "text-lg font-bold tracking-[0.1px] transition-all duration-200",
    "active:scale-[0.98] disabled:cursor-default",
    orderState === "placed"
      ? "bg-white text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.15)]"
      : orderState === "loading"
        ? "bg-[#2aa84a] text-[rgba(0,40,14,0.8)]"
        : "bg-[#34C759] text-[#003a10] shadow-[0_1px_2px_rgba(0,0,0,0.3)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.3),0_6px_12px_rgba(52,199,89,0.35)]",
  ].join(" ");

  return (
    <div className="relative z-10 p-4 flex flex-col gap-4">
      {/*
        RestaurantPill is deliberately OUTSIDE the fading wrapper.
        It uses backdrop-blur — if we fade a parent from opacity 0→1,
        browsers disable blur until opacity hits 1, causing a visible snap.
        The Pill handles its own fade internally (0.01 min opacity) to keep
        the GPU blur layer alive. Same architecture as the Svelte version.
      */}
      <RestaurantPill name={restaurantName} distanceKm={distanceKm} />

      {/* Standard content fade — no backdrop-filter here so 0→1 is fine */}
      <div
        className="flex flex-col gap-4 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {/* Dish title */}
        <h1
          className="text-white font-extrabold leading-[0.95] tracking-tight [text-shadow:0_4px_12px_rgba(0,0,0,0.3)]"
          style={{ fontSize: "clamp(36px, 10vw, 48px)" }}
          dangerouslySetInnerHTML={{ __html: title }}
        />

        {/* Meta row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] uppercase text-white/60 font-semibold tracking-[0.5px]">
              Arrives By
            </span>
            <span className="text-base font-semibold text-white flex items-center gap-1">
              {arrivalTime}
              <span className="text-sm opacity-70 font-normal">
                ({arrivalMinutes}m)
              </span>
            </span>
          </div>
          <span className="text-[32px] font-bold text-white tracking-tight">
            {formattedPrice}
          </span>
        </div>

        {/* Place Order button */}
        <button
          onClick={placeOrder}
          disabled={orderState !== "idle"}
          aria-live="polite"
          className={buttonClass}
        >
          {orderState === "idle" && (
            <>
              Place Order
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12,5 19,12 12,19" />
              </svg>
            </>
          )}
          {orderState === "loading" && (
            <>
              <span className="w-18px h-18px rounded-full border-2 border-[rgba(0,40,14,0.3)] border-t-[#003a10] animate-spin inline-block" />
              Sending to Kitchen...
            </>
          )}
          {orderState === "placed" && (
            <>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
              Placed!
            </>
          )}
        </button>

        <CustomizeDish onClick={onCustomize} />
      </div>
    </div>
  );
}

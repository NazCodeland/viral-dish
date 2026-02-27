"use client";
// components/OrderPanel.tsx

import { useState } from "react";
import { useOverlay } from "@/state/useOverlay";
import LocationModal from "./LocationModal";
import CustomizeDish from "./CustomizeDish";
import { requestGeolocation } from "@/utils/geolocation";
import { Clock } from "lucide-react";

interface Props {
  title: string;
  price: number;
  views: number;
  rating: number;
  arrivalMinutes: number;
  isLocationShared: boolean;
  onLocationGranted: () => void;
  onCustomize?: () => void;
  description?: string;
  isTrending?: boolean;
}

type OrderState = "idle" | "loading" | "placed";

export default function OrderPanel({
  title,
  price,
  views,
  rating,
  arrivalMinutes,
  isLocationShared,
  onLocationGranted,
  onCustomize,
  description = "The viral sensation. Seasoned smash beef, crispy tortilla, melted cheddar, and our secret homemade mac sauce.",
  isTrending = true,
}: Props) {
  const { effectivelyVisible } = useOverlay();
  const [orderState, setOrderState] = useState<OrderState>("idle");
  const [showLocationModal, setShowLocationModal] = useState(false);

  async function handleRequestLocation() {
    try {
      await requestGeolocation();
      onLocationGranted();
      setShowLocationModal(false);
    } catch (error) {
      console.error("Location error:", error);
    }
  }

  function handleSaveAddress(address: string) {
    console.log("Address saved:", address);
    onLocationGranted();
    setShowLocationModal(false);
  }

  function handleMainAction() {
    if (orderState !== "idle") return;
    setOrderState("loading");
    setTimeout(() => setOrderState("placed"), 1500);
  }

  const formattedPrice = price.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  function formatViews(n: number): string {
    if (n >= 1_000_000)
      return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return String(n);
  }

  const buttonClass = [
    "w-full h-14 rounded-2xl flex items-center justify-between px-5",
    "text-lg font-bold tracking-[0.1px] transition-all duration-200",
    "active:scale-[0.98] disabled:cursor-default",
    orderState === "placed"
      ? "bg-white text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.15)]"
      : orderState === "loading"
        ? "bg-[#FF2D55] text-white"
        : "text-white shadow-[0_6px_28px_rgba(255,45,85,0.4)]",
  ].join(" ");

  return (
    <>
      <LocationModal
        open={showLocationModal}
        onRequestLocation={handleRequestLocation}
        onSaveAddress={handleSaveAddress}
        onDismiss={() => setShowLocationModal(false)}
      />

      {/* Added `font-jakarta` here to cascade to the entire text block below */}
      <div className="relative z-20 p-4 flex flex-col gap-3 w-full bg-linear-to-t from-black/80 via-black/40 to-transparent pt-12 font-jakarta">
        <div
          className="flex flex-col gap-3 transition-opacity duration-300"
          style={{
            opacity: effectivelyVisible ? 1 : 0,
            pointerEvents: effectivelyVisible ? "auto" : "none",
          }}
        >
          {/* Row 0: Trending Tag */}
          {isTrending && (
            <div className="bg-[#FF4500] text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded w-max shadow-sm">
              #1 Trending Today
            </div>
          )}

          {/* Row 1: Dish title */}
          <h1
            className="text-white text-3xl font-extrabold leading-tight[text-shadow:0_4px_16px_rgba(0,0,0,0.6)]"
            dangerouslySetInnerHTML={{ __html: title }}
          />

          {/* Row 2: Dish Description */}
          {description && (
            <button
              onClick={onCustomize}
              className="text-left w-full cursor-pointer active:opacity-70 transition-opacity"
              aria-label="Read full description"
            >
              <p className="text-[13px] md:text-sm text-gray-300 font-medium line-clamp-1 leading-snug[text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
                {description}
              </p>
            </button>
          )}

          {/* Row 3: Pills */}
          <div className="flex items-center gap-2.25 flex-wrap">
            <span className="flex items-center gap-1.5 bg-[#FF2D55] rounded-full px-2.25 py-1 text-white text-xs font-bold">
              {formatViews(views)} Orders
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/10 rounded-full px-2.25 py-1 text-white text-xs font-bold">
              ⭐ {rating.toFixed(1)}
            </span>

            {/* Delivery time pill */}
            {isLocationShared ? (
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/10 rounded-full px-2.25 py-1 text-white text-xs font-bold">
                <Clock className="w-3 h-3" />
                {arrivalMinutes} min
              </span>
            ) : (
              <button
                onClick={() => setShowLocationModal(true)}
                className="flex items-center gap-1.5 rounded-full px-2.25 py-1 text-xs font-bold cursor-pointer transition-colors active:bg-white/10"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px dashed rgba(255,255,255,0.3)",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                <Clock className="w-3 h-3" />
                Delivery
              </button>
            )}

            {/* Edit pill */}
            <CustomizeDish onClick={onCustomize} />
          </div>

          {/* Row 4: Order button */}
          <button
            onClick={handleMainAction}
            disabled={orderState !== "idle"}
            aria-live="polite"
            className={buttonClass}
            style={
              orderState === "idle"
                ? { background: "linear-gradient(135deg, #FF2D55, #FF6B35)" }
                : undefined
            }
          >
            {orderState === "idle" && (
              <>
                <span>Order This Dish</span>
                <span className="flex items-center gap-2 opacity-90 font-black">
                  {formattedPrice} <span>→</span>
                </span>
              </>
            )}
            {orderState === "loading" && (
              <span className="flex items-center justify-center gap-2 w-full">
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
                Sending to Kitchen...
              </span>
            )}
            {orderState === "placed" && (
              <span className="flex items-center justify-center gap-2 w-full">
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
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

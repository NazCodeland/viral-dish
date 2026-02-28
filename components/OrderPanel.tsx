"use client";
// components/OrderPanel.tsx

import { useState } from "react";
import { useOverlay } from "@/state/useOverlay";
import LocationModal from "./LocationModal";
import CustomizeDish from "./CustomizeDish";
import Badge from "./Badge";
import { requestGeolocation } from "@/utils/geolocation";
import { Clock, MoveRight } from "lucide-react";

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

  // UPDATED: Changed to font-extrabold and tracking-normal for a cleaner, punchier button
  const buttonClass = [
    "w-full h-14 rounded-2xl flex items-center justify-between px-5",
    "text-lg font-extrabold tracking-normal transition-all duration-200",
    "active:scale-[0.98] disabled:cursor-default",
    orderState === "placed"
      ? "bg-white text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.15)]"
      : orderState === "loading"
        ? "bg-[#E52D27] text-white"
        : "text-white shadow-[0_6px_28px_rgba(229,45,39,0.45)]",
  ].join(" ");

  return (
    <>
      <LocationModal
        open={showLocationModal}
        onRequestLocation={handleRequestLocation}
        onSaveAddress={handleSaveAddress}
        onDismiss={() => setShowLocationModal(false)}
      />

      <div className="relative z-20 p-4 flex flex-col gap-3 w-full bg-linear-to-t from-black/80 via-black/40 to-transparent font-jakarta">
        <div
          className="flex flex-col gap-3 transition-opacity duration-300"
          style={{
            opacity: effectivelyVisible ? 1 : 0,
            pointerEvents: effectivelyVisible ? "auto" : "none",
          }}
        >
          {/* Row 0: Trending Tag — blue flame */}
          {isTrending && (
            <Badge
              variant="blue"
              prefix="#1"
              label="Trending Today"
              textColor="rgba(10, 30, 120, 1)"
            />
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

          {/* Row 3: Pills (Make sure your Badge component uses font-bold, not extrabold/black!) */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge
              variant="glass"
              px="px-2.25"
              label={`${formatViews(views)} Orders`}
            />
            <Badge
              variant="glass"
              px="px-2.25"
              icon="⭐"
              label={rating.toFixed(1)}
            />

            {isLocationShared ? (
              <Badge
                variant="glass"
                px="px-2.25"
                icon={<Clock className="w-3 h-3" />}
                label={`${arrivalMinutes} min`}
              />
            ) : (
              <Badge
                variant="outline"
                px="px-2.25"
                icon={<Clock className="w-3 h-3" />}
                label="Delivery"
                onClick={() => setShowLocationModal(true)}
              />
            )}

            <CustomizeDish onClick={onCustomize} />
          </div>

          {/* Row 4: CTA — flame gradient exclusively owned here */}
          <button
            onClick={handleMainAction}
            disabled={orderState !== "idle"}
            aria-live="polite"
            className={buttonClass}
            style={
              orderState === "idle"
                ? { background: "linear-gradient(90deg, #FF8C00, #E52D27)" }
                : undefined
            }
          >
            {orderState === "idle" && (
              <>
                <span>Order This Dish</span>
                <span className="flex items-center gap-2 opacity-90 font-black">
                  {formattedPrice}
                  <MoveRight className="w-5 h-5" />
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

"use client";
// components/OrderPanel.tsx

import { useState, useEffect } from "react";
import { useOverlay } from "@/state/useOverlay";
import RestaurantPill from "./RestaurantPill";
import CustomizeDish from "./CustomizeDish";
import LocationModal from "./LocationModal";
import { requestGeolocation } from "@/utils/geolocation";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

interface Props {
  title: string;
  restaurantName: string;
  arrivalMinutes: number;
  price: number;
  isLocationShared: boolean;
  onLocationGranted: () => void;
  onCustomize?: () => void;
}

type OrderState = "idle" | "loading" | "placed";

const DOTS = [".", "..", "...", "."];

function AnimatedEllipsis() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % DOTS.length);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <span>
      Finding restaurants
      <span className="inline-block w-6 text-left">{DOTS[index]}</span>
    </span>
  );
}

export default function OrderPanel({
  title,
  restaurantName,
  arrivalMinutes,
  price,
  isLocationShared,
  onLocationGranted,
  onCustomize,
}: Props) {
  const { effectivelyVisible } = useOverlay();
  const [orderState, setOrderState] = useState<OrderState>("idle");
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Used by the inline "Find restaurants near you" link and by the modal's
  // "Allow Location" button — fires the browser prompt directly.
  // isRequestingLocation here only gates double-taps; it never affects the Order button UI.
  async function handleLocationRequest() {
    if (isRequestingLocation) return;
    setShowLocationModal(false);
    setIsRequestingLocation(true);
    try {
      await requestGeolocation();
      onLocationGranted();
    } catch (error) {
      console.error("Location error:", error);
      toast.error("Location blocked", {
        description:
          "Enable location access in your browser settings to order.",
      });
    } finally {
      setIsRequestingLocation(false);
    }
  }

  // Used by the Order Now button — shows the modal if location isn't shared yet,
  // otherwise places the order.
  function handleMainAction() {
    if (!isLocationShared) {
      setShowLocationModal(true);
      return;
    }

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

  const buttonClass = [
    "w-full h-14 rounded-full flex items-center justify-center gap-2",
    "text-lg font-bold tracking-[0.1px] transition-all duration-200",
    "active:scale-[0.98] disabled:cursor-default mt-1",
    orderState === "placed"
      ? "bg-white text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.15)]"
      : orderState === "loading"
        ? "bg-[#2aa84a] text-[rgba(0,40,14,0.8)]"
        : "bg-[#34C759] text-[#003a10] shadow-[0_1px_2px_rgba(0,0,0,0.3)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.3),0_6px_12px_rgba(52,199,89,0.35)]",
  ].join(" ");

  return (
    <>
      <LocationModal
        open={showLocationModal}
        onRequestLocation={handleLocationRequest}
        onDismiss={() => setShowLocationModal(false)}
      />

      <div className="relative z-20 p-4 flex flex-col gap-3 w-full bg-linear-to-t from-black/80 via-black/40 to-transparent pt-12">
        <div
          className="flex flex-col gap-3 transition-opacity duration-300"
          style={{
            opacity: effectivelyVisible ? 1 : 0,
            pointerEvents: effectivelyVisible ? "auto" : "none",
          }}
        >
          {/* Row 1: Dish title */}
          <h1
            className="text-white font-extrabold leading-[0.95] tracking-tight[text-shadow:0_4px_16px_rgba(0,0,0,0.6)]"
            style={{ fontSize: "clamp(36px, 10vw, 48px)" }}
            dangerouslySetInnerHTML={{ __html: title }}
          />

          {/* Row 2: Location/Restaurant Pill + Customize */}
          <div className="flex items-end justify-between gap-3 w-full">
            <div className="flex-1 min-w-0">
              {isLocationShared ? (
                <RestaurantPill name={restaurantName} />
              ) : (
                <button
                  onClick={handleLocationRequest}
                  disabled={isRequestingLocation}
                  className="cursor-pointer flex items-start gap-1.5 text-white/90 hover:text-white transition-colors text-left group disabled:opacity-60"
                >
                  <MapPin className="shrink-0 w-4.5 h-4.5 mt-px animate-bounce" />
                  <span className="text-sm font-medium leading-snug line-clamp-2 group-hover:underline underline-offset-2 transition-colors">
                    {isRequestingLocation ? (
                      <AnimatedEllipsis />
                    ) : (
                      "Find restaurants making this dish near you"
                    )}
                  </span>
                </button>
              )}
            </div>
            <div className="shrink-0">
              <CustomizeDish onClick={onCustomize} />
            </div>
          </div>

          {/* Row 3: Arrives in + Price */}
          <div className="flex items-end justify-between min-h-8">
            <span className="text-sm font-medium text-white/90 pb-1">
              {isLocationShared ? `Arrives in ${arrivalMinutes}m` : ""}
            </span>
            <span className="text-[28px] font-bold text-white tracking-tight[text-shadow:0_2px_8px_rgba(0,0,0,0.4)] leading-none">
              {formattedPrice}
            </span>
          </div>

          {/* Row 4: Order button — never reflects isRequestingLocation,
              only reflects the actual order state */}
          <button
            onClick={handleMainAction}
            disabled={orderState !== "idle"}
            aria-live="polite"
            className={buttonClass}
          >
            {orderState === "idle" && <>Order Now</>}
            {orderState === "loading" && (
              <>
                <span className="w-4.5 h-4.5 rounded-full border-2 border-[rgba(0,40,14,0.3)] border-t-[#003a10] animate-spin inline-block" />
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
        </div>
      </div>
    </>
  );
}

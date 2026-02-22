"use client";
// state/useOverlay.tsx
//
// Each FoodCard creates its own OverlayProvider so cards are fully independent.
//
// forceHidden: set true on pointer-hold to clear all UI so the user can
// watch the video unobstructed. Cleared on pointer-up / pointer-leave.
//
// effectivelyVisible: the single source of truth all consumers should read.
// It is false whenever either the overlay hasn't revealed yet OR the user
// is holding to force-hide. Consumers never need to combine flags themselves.

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";

interface OverlayState {
  /** True once the reveal animation has fired and no force-hide is active. */
  effectivelyVisible: boolean;
  /** Start the 1200ms reveal timer (called on intersection). */
  triggerReveal: () => void;
  /** Cancel the timer and hide immediately (called on intersection-out). */
  hide: () => void;
  /** Suppress all UI while the user holds a finger/mouse on the video. */
  forceHide: () => void;
  /** Restore UI when the user releases after a hold. */
  cancelForceHide: () => void;
}

const OverlayContext = createContext<OverlayState | null>(null);

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [forceHidden, setForceHidden] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerReveal = useCallback(() => {
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(true);
      timerRef.current = null;
    }, 1200);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const forceHide = useCallback(() => setForceHidden(true), []);
  const cancelForceHide = useCallback(() => setForceHidden(false), []);

  const effectivelyVisible = visible && !forceHidden;

  return (
    <OverlayContext
      value={{
        effectivelyVisible,
        triggerReveal,
        hide,
        forceHide,
        cancelForceHide,
      }}
    >
      {children}
    </OverlayContext>
  );
}

export function useOverlay(): OverlayState {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("useOverlay must be used inside OverlayProvider");
  return ctx;
}

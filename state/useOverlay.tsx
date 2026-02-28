"use client";
// state/useOverlay.tsx

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";

const INTERACTIVE_SELECTOR =
  'button, a, input, select, textarea, [role="button"], [data-interactive]';

const HOLD_THRESHOLD_MS = 250;
const SWIPE_THRESHOLD_PX = 10;

interface OverlayState {
  effectivelyVisible: boolean;
  triggerReveal: () => void;
  hide: () => void;
  forceHide: () => void;
  cancelForceHide: () => void;
}

const OverlayContext = createContext<OverlayState | null>(null);

interface OverlayProviderProps {
  children: React.ReactNode;
  /** Called with true when hold starts, false when it ends */
  onHoldChange?: (holding: boolean) => void;
}

export function OverlayProvider({
  children,
  onHoldChange,
}: OverlayProviderProps) {
  const [visible, setVisible] = useState(false);
  const [forceHidden, setForceHidden] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerReveal = useCallback(() => {
    setForceHidden(false);
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(true);
      timerRef.current = null;
    }, 1200);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
    setForceHidden(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const forceHide = useCallback(() => {
    setForceHidden(true);
    onHoldChange?.(true);
  }, [onHoldChange]);

  const cancelForceHide = useCallback(() => {
    setForceHidden(false);
    onHoldChange?.(false);
  }, [onHoldChange]);

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

interface UseHoldToHideOptions {
  onTap?: () => void;
}

export function useHoldToHide({ onTap }: UseHoldToHideOptions = {}) {
  const { forceHide, cancelForceHide } = useOverlay();

  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didHoldRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  const clearTimer = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as Element).closest(INTERACTIVE_SELECTOR)) return;

      didHoldRef.current = false;
      startPosRef.current = { x: e.clientX, y: e.clientY };

      holdTimerRef.current = setTimeout(() => {
        holdTimerRef.current = null;
        didHoldRef.current = true;
        forceHide();
      }, HOLD_THRESHOLD_MS);
    },
    [forceHide],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!holdTimerRef.current) return;

      const dx = Math.abs(e.clientX - startPosRef.current.x);
      const dy = Math.abs(e.clientY - startPosRef.current.y);

      if (dx > SWIPE_THRESHOLD_PX || dy > SWIPE_THRESHOLD_PX) {
        clearTimer();
        didHoldRef.current = false;
      }
    },
    [clearTimer],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as Element).closest(INTERACTIVE_SELECTOR)) return;

      clearTimer();

      if (didHoldRef.current) {
        cancelForceHide();
      } else {
        onTap?.();
      }

      didHoldRef.current = false;
    },
    [clearTimer, cancelForceHide, onTap],
  );

  const onPointerCancel = useCallback(() => {
    clearTimer();
    if (didHoldRef.current) {
      cancelForceHide();
      didHoldRef.current = false;
    }
  }, [clearTimer, cancelForceHide]);

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel };
}

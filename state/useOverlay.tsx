"use client";
// state\useOverlay.tsx
// Equivalent of overlay.svelte.ts
//
// Svelte used getContext/setContext with a class holding $state.
// React equivalent: a Context + custom hook, scoped per FoodCard (not global).
// Each FoodCard creates its own OverlayProvider so cards are fully independent.

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";

interface OverlayState {
  visible: boolean;
  triggerReveal: () => void;
  hide: () => void;
}

const OverlayContext = createContext<OverlayState | null>(null);

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
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

  return (
    <OverlayContext value={{ visible, triggerReveal, hide }}>
      {children}
    </OverlayContext>
  );
}

export function useOverlay(): OverlayState {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("useOverlay must be used inside OverlayProvider");
  return ctx;
}

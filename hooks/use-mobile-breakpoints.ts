"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Tailwind default breakpoints (px) – keep in sync with Tailwind config.
 * sm: 640, md: 768, lg: 1024
 */
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
} as const;

function getBreakpointState() {
  if (typeof window === "undefined") {
    return {
      belowSm: false,
      belowMd: false,
      belowLg: false,
      width: 0,
    };
  }
  const width = window.innerWidth;
  return {
    belowSm: width < BREAKPOINTS.sm,
    belowMd: width < BREAKPOINTS.md,
    belowLg: width < BREAKPOINTS.lg,
    width,
  };
}

export type MobileBreakpointState = ReturnType<typeof getBreakpointState>;

/**
 * Returns viewport state relative to Tailwind breakpoints (sm, md, lg)
 * and updates on window resize. Names align with Tailwind-style classes:
 * below-sm, below-md, below-lg.
 */
export function useMobileBreakpoints(): MobileBreakpointState {
  const [state, setState] = useState<MobileBreakpointState>(getBreakpointState);

  const handleResize = useCallback(() => {
    setState(getBreakpointState());
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return state;
}

/**
 * Builds a class string of current "below-*" Tailwind-style classes,
 * e.g. "below-lg below-md below-sm" when viewport is below sm.
 * Use with your Tailwind config / CSS that defines these classes.
 */
export function getBelowBreakpointClasses(state: MobileBreakpointState): string {
  const classes: string[] = [];
  if (state.belowLg) classes.push("below-lg");
  if (state.belowMd) classes.push("below-md");
  if (state.belowSm) classes.push("below-sm");
  return classes.join(" ");
}

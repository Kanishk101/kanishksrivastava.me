"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

let lenisInstance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;

export function initLenis(): Lenis {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
  });

  // Sync Lenis scroll with GSAP ScrollTrigger
  lenisInstance.on("scroll", ScrollTrigger.update);

  tickerCallback = (time) => {
    lenisInstance?.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);

  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function destroyLenis(): void {
  if (lenisInstance) {
    if (tickerCallback) {
      gsap.ticker.remove(tickerCallback);
      tickerCallback = null;
    }
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

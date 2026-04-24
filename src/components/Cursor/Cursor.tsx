"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useCursor } from "@/contexts/CursorContext";

const POINTER_SVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 34" fill="none">
  <path
    d="M2 2v28.5l7.8-7.1 4.9 8.6 4.6-2.8-4.8-8.4h11.5L2 2Z"
    fill="currentColor"
    stroke="currentColor"
    stroke-width="1.35"
    stroke-linejoin="miter"
  />
</svg>
`);

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const posRef = useRef({ x: -100, y: -100 });
  const { cursorState, setCursorState } = useCursor();
  const [mounted] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches
  );

  useEffect(() => {
    if (!mounted) return;

    const updateCursorColor = (x: number, y: number) => {
      const el = document.elementFromPoint(x, y);
      if (!el || !cursorRef.current) return;

      const isDark =
        el.closest(".section-dark") !== null ||
        el.closest("[data-modal-dark]") !== null;

      cursorRef.current.style.color = isDark
        ? "var(--text-light)"
        : "var(--text-primary)";
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      updateCursorColor(e.clientX, e.clientY);
    };

    const tickPointer = () => {
      const lerp = 0.22;
      posRef.current.x += (mouseRef.current.x - posRef.current.x) * lerp;
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * lerp;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${posRef.current.x}px`;
        cursorRef.current.style.top = `${posRef.current.y}px`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    gsap.ticker.add(tickPointer);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(tickPointer);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !cursorRef.current) return;

    const pointer = cursorRef.current;

    switch (cursorState) {
      case "DEFAULT":
        gsap.to(pointer, {
          scale: 1,
          opacity: 1,
          rotate: 0,
          x: 0,
          y: 0,
          duration: 0.22,
          ease: "power2.out",
        });
        break;

      case "HOVER_LINK":
        gsap.to(pointer, {
          scale: 1.08,
          rotate: -6,
          x: 2,
          y: -2,
          duration: 0.24,
          ease: "power2.out",
        });
        break;

      case "HOVER_PROJECT":
        gsap.to(pointer, {
          scale: 1.16,
          rotate: -8,
          x: 3,
          y: -3,
          duration: 0.28,
          ease: "back.out(1.7)",
        });
        break;

      case "HOVER_MAGNETIC":
        gsap.to(pointer, {
          scale: 0.94,
          rotate: -10,
          duration: 0.22,
          ease: "power2.out",
        });
        break;

      case "JITTER": {
        const jitterTl = gsap.timeline();
        for (let j = 0; j < 6; j++) {
          jitterTl.to(pointer, {
            x: `+=${(Math.random() - 0.5) * 5}`,
            y: `+=${(Math.random() - 0.5) * 5}`,
            duration: 0.03,
          });
        }
        jitterTl.to(pointer, { x: 0, y: 0, duration: 0.08 });
        jitterTl.call(() => setCursorState("DEFAULT"));
        break;
      }
    }
  }, [cursorState, mounted, setCursorState]);

  useEffect(() => {
    if (!mounted) return;

    const handleClick = (e: MouseEvent) => {
      const elUnder = document.elementFromPoint(e.clientX, e.clientY);
      const isDark =
        elUnder?.closest(".section-dark") !== null ||
        elUnder?.closest("[data-modal-dark]") !== null;

      const color = isDark
        ? "rgba(249, 247, 244, 0.94)"
        : "rgba(12, 12, 11, 0.9)";

      const wave = document.createElement("div");
      wave.style.cssText = `
        position: fixed;
        left: ${e.clientX - 22}px;
        top: ${e.clientY - 22}px;
        width: 38px;
        height: 38px;
        pointer-events: none;
        z-index: 9997;
        transform-origin: 12px 12px;
      `;

      wave.innerHTML = `
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 14C12.8 11.2 16.4 9.6 20.4 9.4" stroke="${color}" stroke-width="3.2" stroke-linecap="square"/>
          <path d="M8.6 10.2C12.7 6.3 18.1 4 24 3.9" stroke="${color}" stroke-width="2.6" stroke-linecap="square" opacity="0.86"/>
          <path d="M7 6.2C12.7 1.4 20 -1.1 27.8 1" stroke="${color}" stroke-width="2.2" stroke-linecap="square" opacity="0.72"/>
        </svg>
      `;

      document.body.appendChild(wave);

      gsap.fromTo(
        wave,
        { scale: 0.72, opacity: 0.96, x: 0, y: 0 },
        {
          scale: 1.24,
          opacity: 0,
          x: -10,
          y: -8,
          duration: 0.54,
          ease: "power2.out",
          onComplete: () => wave.remove(),
        }
      );

      if (cursorRef.current) {
        gsap.fromTo(
          cursorRef.current,
          { scale: 0.92, rotate: -14 },
          {
            scale: cursorState === "DEFAULT" ? 1 : 1.08,
            rotate: cursorState === "DEFAULT" ? 0 : -8,
            duration: 0.34,
            ease: "power3.out",
          }
        );
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [mounted, cursorState]);

  useEffect(() => {
    if (!mounted) return;

    const magneticEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-magnetic]")
    );

    const handlers = magneticEls.map((el) => {
      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < 100) {
          const s = (1 - dist / 100) * 0.38;
          gsap.to(el, {
            x: dx * s,
            y: dy * s,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      };
      const onLeave = () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.55,
          ease: "elastic.out(1, 0.3)",
        });
      };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      return { el, onMove, onLeave };
    });

    return () => {
      handlers.forEach(({ el, onMove, onLeave }) => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const handlePointerOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;

      if (
        el.closest("[data-cursor='pointer']") ||
        el.closest("[data-magnetic]")
      ) {
        setCursorState("HOVER_PROJECT");
      } else if (
        el.closest("a") ||
        el.closest("button") ||
        el.closest("[role='button']")
      ) {
        setCursorState("HOVER_LINK");
      }
    };

    const handlePointerOut = (e: MouseEvent) => {
      const nextTarget = e.relatedTarget as HTMLElement | null;
      if (
        nextTarget?.closest("[data-cursor='pointer']") ||
        nextTarget?.closest("[data-magnetic]")
      ) {
        return;
      }
      if (
        nextTarget?.closest("a") ||
        nextTarget?.closest("button") ||
        nextTarget?.closest("[role='button']")
      ) {
        return;
      }

      setCursorState("DEFAULT");
    };

    document.addEventListener("mouseover", handlePointerOver);
    document.addEventListener("mouseout", handlePointerOut);

    return () => {
      document.removeEventListener("mouseover", handlePointerOver);
      document.removeEventListener("mouseout", handlePointerOut);
    };
  }, [mounted, setCursorState]);

  if (!mounted) return null;

  return (
    <>
      <div
        ref={cursorRef}
        id="cursor"
        aria-hidden="true"
        style={{
          position: "fixed",
          left: "-100px",
          top: "-100px",
          width: "28px",
          height: "34px",
          color: "var(--text-primary)",
          backgroundImage: `url("data:image/svg+xml,${POINTER_SVG}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-2px, -2px)",
          transformOrigin: "4px 4px",
          willChange: "left, top, transform, color",
          filter: "drop-shadow(0 0 10px rgba(0, 0, 0, 0.14))",
          transition: "color 0.24s ease",
        }}
      />

      <style jsx global>{`
        @media (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}

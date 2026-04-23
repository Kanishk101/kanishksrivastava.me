"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useCursor } from "@/contexts/CursorContext";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const posRef = useRef({ x: -100, y: -100 });
  const { cursorState, setCursorState } = useCursor();
  const [mounted, setMounted] = useState(false);
  const isTouchRef = useRef(false);

  // Hydration-safe mount check (Bug 4 fix)
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    isTouchRef.current = isTouch;
    if (!isTouch) {
      setMounted(true);
    }
  }, []);

  // Mouse tracking + lerped follower
  useEffect(() => {
    if (!mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const tickFollower = () => {
      const lerp = 0.12;
      posRef.current.x += (mouseRef.current.x - posRef.current.x) * lerp;
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * lerp;

      if (followerRef.current) {
        followerRef.current.style.left = `${posRef.current.x}px`;
        followerRef.current.style.top = `${posRef.current.y}px`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    gsap.ticker.add(tickFollower);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(tickFollower);
    };
  }, [mounted]);

  // ═══════════════════════════════════════════════
  // CLICK RIPPLE EFFECT
  // Creates an expanding ring at click position + squash-spring on cursor dot
  // ═══════════════════════════════════════════════
  useEffect(() => {
    if (!mounted) return;

    const handleClick = (e: MouseEvent) => {
      // Clean concentric ripples — animate width/height, NOT scale
      // Scale causes border pixelation; direct size keeps 1px borders crisp
      const waves = [
        { size: 140, dur: 0.65, delay: 0, opacity: 0.5 },
        { size: 260, dur: 0.8, delay: 0.06, opacity: 0.35 },
        { size: 400, dur: 0.95, delay: 0.12, opacity: 0.2 },
      ];

      waves.forEach(({ size, dur, delay, opacity }) => {
        const wave = document.createElement("div");
        wave.style.cssText = `
          position: fixed;
          left: ${e.clientX}px;
          top: ${e.clientY}px;
          width: 0px;
          height: 0px;
          border-radius: 50%;
          border: 1px solid var(--accent);
          pointer-events: none;
          z-index: 9997;
          transform: translate(-50%, -50%);
          opacity: ${opacity};
        `;
        document.body.appendChild(wave);

        gsap.to(wave, {
          width: size,
          height: size,
          opacity: 0,
          duration: dur,
          delay,
          ease: "power3.out",
          onComplete: () => wave.remove(),
        });
      });

      // Subtle dot squeeze
      if (cursorRef.current) {
        gsap.fromTo(
          cursorRef.current,
          { scaleX: 1.4, scaleY: 0.7 },
          {
            scaleX: 1,
            scaleY: 1,
            duration: 0.45,
            ease: "elastic.out(1, 0.4)",
          }
        );
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [mounted]);

  // ═══════════════════════════════════════════════
  // GLOBAL MAGNETIC EFFECT
  // Applies to all [data-magnetic] elements site-wide
  // ═══════════════════════════════════════════════
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

  // Auto-detect interactive elements globally
  useEffect(() => {
    if (!mounted) return;

    const handleEnter = (e: Event) => {
      const el = e.target as HTMLElement;
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

    const handleLeave = () => {
      setCursorState("DEFAULT");
    };

    document.addEventListener("mouseover", handleEnter);
    document.addEventListener("mouseout", handleLeave);

    return () => {
      document.removeEventListener("mouseover", handleEnter);
      document.removeEventListener("mouseout", handleLeave);
    };
  }, [mounted, setCursorState]);

  // ═══════════════════════════════════════════════
  // DARK SECTION + MODAL DETECTION
  // Cursor inverts to white on dark backgrounds
  // Checks both .section-dark and the project modal
  // ═══════════════════════════════════════════════
  useEffect(() => {
    if (!mounted) return;

    const checkDarkSection = () => {
      const { x, y } = mouseRef.current;
      const el = document.elementFromPoint(x, y);
      if (!el) return;

      // Check if cursor is over a dark section OR the project modal (bg-dark)
      const isDark =
        el.closest(".section-dark") !== null ||
        el.closest("[data-modal-dark]") !== null;

      const lightColor = "var(--text-light)";
      const darkColor = "var(--text-primary)";

      if (cursorRef.current) {
        cursorRef.current.style.backgroundColor = isDark
          ? lightColor
          : darkColor;
      }
      if (followerRef.current) {
        followerRef.current.style.borderColor = isDark
          ? lightColor
          : darkColor;
      }
      if (labelRef.current) {
        labelRef.current.style.color = isDark ? lightColor : darkColor;
      }
    };

    const intervalId = setInterval(checkDarkSection, 100);
    return () => clearInterval(intervalId);
  }, [mounted]);

  // State-driven cursor sizing
  useEffect(() => {
    if (!mounted || !followerRef.current || !cursorRef.current) return;

    const dot = cursorRef.current;
    const follower = followerRef.current;
    const label = labelRef.current;

    switch (cursorState) {
      case "DEFAULT":
        gsap.to(dot, { opacity: 1, scale: 1, duration: 0.2 });
        gsap.to(follower, {
          width: 40,
          height: 40,
          opacity: 0.3,
          duration: 0.3,
          ease: "power2.out",
        });
        if (label) label.style.opacity = "0";
        break;

      case "HOVER_LINK":
        gsap.to(dot, { opacity: 0.5, scale: 0.5, duration: 0.2 });
        gsap.to(follower, {
          width: 48,
          height: 48,
          opacity: 0.5,
          duration: 0.3,
          ease: "back.out(1.7)",
        });
        if (label) label.style.opacity = "0";
        break;

      case "HOVER_PROJECT":
        gsap.to(dot, { opacity: 0, scale: 0, duration: 0.15 });
        gsap.to(follower, {
          width: 64,
          height: 64,
          opacity: 1,
          duration: 0.35,
          ease: "back.out(1.7)",
        });
        if (label) label.style.opacity = "1";
        break;

      case "HOVER_MAGNETIC":
        gsap.to(dot, { opacity: 0, duration: 0.15 });
        gsap.to(follower, { opacity: 0, duration: 0.15 });
        break;

      case "JITTER": {
        const jitterTl = gsap.timeline();
        for (let j = 0; j < 6; j++) {
          jitterTl.to(dot, {
            x: `+=${(Math.random() - 0.5) * 8}`,
            y: `+=${(Math.random() - 0.5) * 8}`,
            duration: 0.033,
          });
        }
        jitterTl.to(dot, { x: 0, y: 0, duration: 0.1 });
        jitterTl.call(() => setCursorState("DEFAULT"));
        break;
      }
    }
  }, [cursorState, mounted, setCursorState]);

  // Don't render until mounted (prevents SSR hydration mismatch)
  if (!mounted) return null;

  return (
    <>
      {/* Dot — instant tracking */}
      <div
        ref={cursorRef}
        id="cursor"
        style={{
          position: "fixed",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "var(--text-primary)",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          willChange: "left, top",
          transition: "background-color 0.3s ease",
        }}
      />

      {/* Follower ring — lerped tracking */}
      <div
        ref={followerRef}
        id="cursor-follower"
        className="flex items-center justify-center"
        style={{
          position: "fixed",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "1.5px solid var(--text-primary)",
          backgroundColor: "transparent",
          pointerEvents: "none",
          zIndex: 9998,
          transform: "translate(-50%, -50%)",
          willChange: "left, top, width, height",
          opacity: 0.3,
          transition: "border-color 0.3s ease",
        }}
      >
        <span
          ref={labelRef}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            letterSpacing: "0.1em",
            color: "var(--text-primary)",
            opacity: 0,
            transition: "opacity 0.2s ease, color 0.3s ease",
            whiteSpace: "nowrap",
          }}
        >
          View →
        </span>
      </div>

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

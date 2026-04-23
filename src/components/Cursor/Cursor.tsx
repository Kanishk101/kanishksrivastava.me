"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { useCursor } from "@/contexts/CursorContext";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const posRef = useRef({ x: -100, y: -100 });
  const { cursorState, setCursorState } = useCursor();
  const isTouch = useRef(false);
  const isDarkRef = useRef(false);

  // Detect touch
  useEffect(() => {
    isTouch.current = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      // Instant update for dot
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    // Lerped follower via GSAP ticker
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
  }, []);

  // Auto-detect interactive elements globally
  useEffect(() => {
    if (isTouch.current) return;

    const handleEnter = (e: Event) => {
      const el = e.target as HTMLElement;
      if (el.closest("[data-cursor='pointer']") || el.closest("[data-magnetic]")) {
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
  }, [setCursorState]);

  // Dark section detection for cursor color inversion
  useEffect(() => {
    if (isTouch.current) return;

    const checkDarkSection = () => {
      const { x, y } = mouseRef.current;
      const el = document.elementFromPoint(x, y);
      const dark = el?.closest(".section-dark") !== null;
      isDarkRef.current = dark;

      if (cursorRef.current) {
        cursorRef.current.style.backgroundColor = dark
          ? "var(--text-light)"
          : "var(--text-primary)";
      }
      if (followerRef.current) {
        followerRef.current.style.borderColor = dark
          ? "var(--text-light)"
          : "var(--text-primary)";
      }
      if (labelRef.current) {
        labelRef.current.style.color = dark
          ? "var(--text-light)"
          : "var(--text-primary)";
      }
    };

    const intervalId = setInterval(checkDarkSection, 150);
    return () => clearInterval(intervalId);
  }, []);

  // State-driven cursor sizing
  useEffect(() => {
    if (isTouch.current || !followerRef.current || !cursorRef.current) return;

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

      case "JITTER":
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
  }, [cursorState, setCursorState]);

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

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
          mixBlendMode: "exclusion",
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
        {/* "View →" label for project hover */}
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

      {/* Hide default cursor globally */}
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

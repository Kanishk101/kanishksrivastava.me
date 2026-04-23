"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "@/lib/gsap";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const followerPosRef = useRef({ x: 0, y: 0 });
  const visibleRef = useRef(false);

  const onMouseMove = useCallback((e: MouseEvent) => {
    posRef.current = { x: e.clientX, y: e.clientY };

    if (!visibleRef.current) {
      visibleRef.current = true;
      if (cursorRef.current) {
        cursorRef.current.style.opacity = "1";
      }
    }

    // Cursor dot follows instantly
    if (cursorRef.current) {
      cursorRef.current.style.left = `${e.clientX}px`;
      cursorRef.current.style.top = `${e.clientY}px`;
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    visibleRef.current = false;
    if (cursorRef.current) {
      cursorRef.current.style.opacity = "0";
    }
    if (followerRef.current) {
      followerRef.current.style.opacity = "0";
    }
  }, []);

  const onMouseEnter = useCallback(() => {
    visibleRef.current = true;
    if (cursorRef.current) {
      cursorRef.current.style.opacity = "1";
    }
  }, []);

  useEffect(() => {
    // Check for touch device
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Follower lerp animation via GSAP ticker
    const followerLerp = 0.12;
    followerPosRef.current = { ...posRef.current };

    const tickHandler = () => {
      if (!followerRef.current) return;

      followerPosRef.current.x +=
        (posRef.current.x - followerPosRef.current.x) * followerLerp;
      followerPosRef.current.y +=
        (posRef.current.y - followerPosRef.current.y) * followerLerp;

      followerRef.current.style.left = `${followerPosRef.current.x}px`;
      followerRef.current.style.top = `${followerPosRef.current.y}px`;
    };

    gsap.ticker.add(tickHandler);

    // Hover state management for interactive elements
    const handleLinkEnter = () => {
      cursorRef.current?.classList.add("hover-link");
      if (followerRef.current) {
        followerRef.current.style.opacity = "1";
        followerRef.current.style.width = "40px";
        followerRef.current.style.height = "40px";
      }
    };

    const handleLinkLeave = () => {
      cursorRef.current?.classList.remove("hover-link");
      if (followerRef.current) {
        followerRef.current.style.opacity = "0";
        followerRef.current.style.width = "40px";
        followerRef.current.style.height = "40px";
      }
    };

    // Observe interactive elements
    const observeLinks = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [role="button"], [data-cursor="pointer"]'
      );
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", handleLinkEnter);
        el.addEventListener("mouseleave", handleLinkLeave);
      });
    };

    // Initial observation + MutationObserver for dynamic elements
    observeLinks();
    const observer = new MutationObserver(observeLinks);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      gsap.ticker.remove(tickHandler);
      observer.disconnect();
    };
  }, [onMouseMove, onMouseLeave, onMouseEnter]);

  return (
    <>
      <div id="cursor" ref={cursorRef} style={{ opacity: 0 }} />
      <div id="cursor-follower" ref={followerRef} />
    </>
  );
}

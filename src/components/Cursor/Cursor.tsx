"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useCursor } from "@/contexts/CursorContext";

const TEXT_ROOT_SELECTORS = [
  "nav a",
  "main h1",
  "main h2",
  "main h3",
  "main h4",
  "main p",
  "main blockquote",
  "[data-ripple-text]",
].join(", ");

const SURFACE_SELECTORS = [
  ".stack-card",
  ".skill-pill",
  ".project-row",
  "[data-ripple-reactive]",
].join(", ");

const SCOPE_SELECTOR = "[data-section], [data-modal-dark], nav";
const SOURCE_X = 24;
const SOURCE_Y = 54;
const WAVE_VIEWBOX = { width: 116, height: 74 };

const createWaveVariant = (index: number) => {
  const spread = 8 + Math.random() * 12;
  const lift = 4 + Math.random() * 7;
  const skew = Math.random() * 4 - 2;
  const start = SOURCE_X - (10 + Math.random() * 4);

  const variants = [
    () => [
      `M${start} ${SOURCE_Y} Q${SOURCE_X + 7} ${48 - lift} ${SOURCE_X + 24 + spread} ${41 - lift * 0.45 + skew}`,
      `M${start - 1} ${SOURCE_Y - 8} Q${SOURCE_X + 8} ${35 - lift * 0.95} ${SOURCE_X + 36 + spread} ${27 - lift + skew}`,
      `M${start - 2} ${SOURCE_Y - 16} Q${SOURCE_X + 9} ${21 - lift * 1.15} ${SOURCE_X + 48 + spread} ${12 - lift + skew}`,
    ],
    () => [
      `M${start} ${SOURCE_Y} C${SOURCE_X + 2} ${49}, ${SOURCE_X + 10 + spread * 0.3} ${45 - lift * 0.55}, ${SOURCE_X + 26 + spread} ${37 - lift * 0.5}`,
      `M${start - 1} ${SOURCE_Y - 8} C${SOURCE_X + 3} ${38}, ${SOURCE_X + 14 + spread * 0.35} ${31 - lift}, ${SOURCE_X + 40 + spread} ${22 - lift}`,
      `M${start - 2} ${SOURCE_Y - 16} C${SOURCE_X + 4} ${24}, ${SOURCE_X + 18 + spread * 0.4} ${17 - lift * 1.08}, ${SOURCE_X + 52 + spread} ${10 - lift}`,
    ],
    () => [
      `M${start} ${SOURCE_Y} L${SOURCE_X + 2} ${50 - skew} L${SOURCE_X + 24 + spread} ${38 - lift * 0.42}`,
      `M${start - 1} ${SOURCE_Y - 8} L${SOURCE_X + 4} ${39 - skew} L${SOURCE_X + 38 + spread} ${24 - lift}`,
      `M${start - 2} ${SOURCE_Y - 16} L${SOURCE_X + 6} ${27 - skew} L${SOURCE_X + 50 + spread} ${12 - lift}`,
    ],
    () => [
      `M${start} ${SOURCE_Y} Q${SOURCE_X + 4} ${47 - lift * 0.35} ${SOURCE_X + 16 + spread * 0.42} ${44 - skew} T${SOURCE_X + 30 + spread} ${35 - lift * 0.5}`,
      `M${start - 1} ${SOURCE_Y - 8} Q${SOURCE_X + 6} ${35 - lift * 0.78} ${SOURCE_X + 20 + spread * 0.48} ${30 - skew} T${SOURCE_X + 44 + spread} ${20 - lift}`,
      `M${start - 2} ${SOURCE_Y - 16} Q${SOURCE_X + 8} ${21 - lift} ${SOURCE_X + 24 + spread * 0.56} ${17 - skew} T${SOURCE_X + 56 + spread} ${9 - lift}`,
    ],
    () => [
      `M${start} ${SOURCE_Y} L${SOURCE_X + 1} ${50 - skew} Q${SOURCE_X + 12 + spread * 0.22} ${46 - lift * 0.45} ${SOURCE_X + 29 + spread} ${39 - lift * 0.45}`,
      `M${start - 1} ${SOURCE_Y - 8} L${SOURCE_X + 3} ${39 - skew} Q${SOURCE_X + 16 + spread * 0.24} ${33 - lift * 0.88} ${SOURCE_X + 42 + spread} ${23 - lift}`,
      `M${start - 2} ${SOURCE_Y - 16} L${SOURCE_X + 5} ${27 - skew} Q${SOURCE_X + 20 + spread * 0.26} ${19 - lift} ${SOURCE_X + 54 + spread} ${11 - lift}`,
    ],
    () => [
      `M${start} ${SOURCE_Y} C${SOURCE_X + 1} ${47 - skew}, ${SOURCE_X + 14 + spread * 0.25} ${47 - lift * 0.2}, ${SOURCE_X + 29 + spread} ${36 - lift * 0.54}`,
      `M${start - 1} ${SOURCE_Y - 8} C${SOURCE_X + 2} ${35 - skew}, ${SOURCE_X + 18 + spread * 0.3} ${31 - lift * 0.7}, ${SOURCE_X + 43 + spread} ${21 - lift}`,
      `M${start - 2} ${SOURCE_Y - 16} C${SOURCE_X + 3} ${22 - skew}, ${SOURCE_X + 22 + spread * 0.34} ${16 - lift}, ${SOURCE_X + 55 + spread} ${10 - lift}`,
    ],
  ];

  return variants[index % variants.length]();
};

type Offset = { x: number; y: number };

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const posRef = useRef({ x: -100, y: -100 });
  const waveVariantRef = useRef(0);
  const rippleLockUntilRef = useRef(0);
  const textTargetsRef = useRef<HTMLElement[]>([]);
  const surfaceTargetsRef = useRef<HTMLElement[]>([]);
  const scopedTextTargetsRef = useRef(new Map<HTMLElement, HTMLElement[]>());
  const scopedSurfaceTargetsRef = useRef(new Map<HTMLElement, HTMLElement[]>());
  const activeScopeRef = useRef<HTMLElement | null>(null);
  const activeTextRef = useRef<HTMLElement[]>([]);
  const activeSurfacesRef = useRef<HTMLElement[]>([]);
  const hoverOffsetsRef = useRef(new WeakMap<HTMLElement, Offset>());
  const clickOffsetsRef = useRef(new WeakMap<HTMLElement, Offset>());
  const { cursorState, setCursorState } = useCursor();
  const [mounted] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches
  );

  const applyOffset = useCallback((el: HTMLElement) => {
    const hover = hoverOffsetsRef.current.get(el) || { x: 0, y: 0 };
    const click = clickOffsetsRef.current.get(el) || { x: 0, y: 0 };
    gsap.set(el, {
      x: hover.x + click.x,
      y: hover.y + click.y,
      force3D: true,
    });
  }, []);

  const clearHoverOffsets = useCallback(
    (targets: HTMLElement[]) => {
      targets.forEach((el) => {
        hoverOffsetsRef.current.set(el, { x: 0, y: 0 });
        applyOffset(el);
      });
    },
    [applyOffset]
  );

  const splitTextNode = useCallback((node: Text) => {
    if (!node.textContent || !node.parentElement || !node.textContent.trim()) {
      return;
    }

    const parent = node.parentElement;
    const frag = document.createDocumentFragment();
    const parts = node.textContent.match(/\S+|\s+/g) ?? [];

    parts.forEach((part) => {
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part));
        return;
      }

      const word = document.createElement("span");
      word.setAttribute("aria-hidden", "true");
      word.style.display = "inline-block";
      word.style.whiteSpace = "nowrap";

      part.split("").forEach((char) => {
        const span = document.createElement("span");
        span.className = "cursor-distort-char";
        span.setAttribute("aria-hidden", "true");
        span.style.display = "inline-block";
        span.style.willChange = "transform";
        span.style.transition =
          "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
        span.textContent = char;
        word.appendChild(span);
      });

      frag.appendChild(word);
    });

    parent.insertBefore(frag, node);
    parent.removeChild(node);
  }, []);

  const splitElementText = useCallback(
    (root: HTMLElement) => {
      if (root.dataset.cursorSplit === "true") return;
      if (root.closest("#cursor")) return;
      if (root.classList.contains("hero-char")) return;
      if (!root.matches("[data-ripple-text]") && root.children.length > 0) return;
      if (root.querySelector("svg, input, textarea, select, img")) return;

      const textNodes: Text[] = [];
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
          if (!node.parentElement) return NodeFilter.FILTER_REJECT;
          if (
            node.parentElement.closest(
              "svg, script, style, input, textarea, select, img"
            )
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      while (walker.nextNode()) {
        textNodes.push(walker.currentNode as Text);
      }

      if (textNodes.length === 0) return;

      if (!root.getAttribute("aria-label")) {
        const label = root.textContent?.replace(/\s+/g, " ").trim();
        if (label) root.setAttribute("aria-label", label);
      }

      textNodes.forEach(splitTextNode);
      root.dataset.cursorSplit = "true";
    },
    [splitTextNode]
  );

  useEffect(() => {
    if (!mounted) return;

    const collectTargets = () => {
      Array.from(
        document.querySelectorAll<HTMLElement>(TEXT_ROOT_SELECTORS)
      ).forEach((el) => splitElementText(el));

      const textTargets = Array.from(
        document.querySelectorAll<HTMLElement>(".hero-char, .cursor-distort-char")
      ).filter((el) => !el.closest("#cursor"));

      const surfaceTargets = Array.from(
        document.querySelectorAll<HTMLElement>(SURFACE_SELECTORS)
      ).filter((el) => !el.closest("#cursor"));

      textTargets.forEach((el) => {
        el.style.willChange = "transform";
        el.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
      });

      textTargetsRef.current = textTargets;
      surfaceTargetsRef.current = surfaceTargets;

      const scopedText = new Map<HTMLElement, HTMLElement[]>();
      textTargets.forEach((el) => {
        const scope = el.closest<HTMLElement>(SCOPE_SELECTOR) ?? document.body;
        const existing = scopedText.get(scope) ?? [];
        existing.push(el);
        scopedText.set(scope, existing);
      });

      const scopedSurfaces = new Map<HTMLElement, HTMLElement[]>();
      surfaceTargets.forEach((el) => {
        const scope = el.closest<HTMLElement>(SCOPE_SELECTOR) ?? document.body;
        const existing = scopedSurfaces.get(scope) ?? [];
        existing.push(el);
        scopedSurfaces.set(scope, existing);
      });

      scopedTextTargetsRef.current = scopedText;
      scopedSurfaceTargetsRef.current = scopedSurfaces;
    };

    collectTargets();
    window.addEventListener("resize", collectTargets);

    const observer = new MutationObserver(() => {
      requestAnimationFrame(collectTargets);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("resize", collectTargets);
      observer.disconnect();
    };
  }, [mounted, splitElementText]);

  useEffect(() => {
    if (!mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const tickPointer = () => {
      const lerp = 0.22;
      posRef.current.x += (mouseRef.current.x - posRef.current.x) * lerp;
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * lerp;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${posRef.current.x}px`;
        cursorRef.current.style.top = `${posRef.current.y}px`;
      }

      const hovered = document.elementFromPoint(
        mouseRef.current.x,
        mouseRef.current.y
      ) as HTMLElement | null;
      const nextScope =
        hovered?.closest<HTMLElement>(SCOPE_SELECTOR) ?? document.body;

      if (activeScopeRef.current !== nextScope) {
        clearHoverOffsets(activeTextRef.current);
        activeScopeRef.current = nextScope;
        activeTextRef.current = scopedTextTargetsRef.current.get(nextScope) ?? [];
        activeSurfacesRef.current =
          scopedSurfaceTargetsRef.current.get(nextScope) ?? [];
      }

      if (performance.now() < rippleLockUntilRef.current) {
        clearHoverOffsets(activeTextRef.current);
        return;
      }

      const maxDist = 200;
      activeTextRef.current.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        if (
          rect.bottom < -40 ||
          rect.top > window.innerHeight + 40 ||
          rect.right < -40 ||
          rect.left > window.innerWidth + 40
        ) {
          hoverOffsetsRef.current.set(el, { x: 0, y: 0 });
          applyOffset(el);
          return;
        }

        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mouseRef.current.x - cx;
        const dy = mouseRef.current.y - cy;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDist) {
          const strength = (1 - dist / maxDist) * 0.35;
          hoverOffsetsRef.current.set(el, {
            x: dx * strength * 0.15,
            y: dy * strength * 0.1,
          });
        } else {
          hoverOffsetsRef.current.set(el, { x: 0, y: 0 });
        }

        applyOffset(el);
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    gsap.ticker.add(tickPointer);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(tickPointer);
    };
  }, [applyOffset, clearHoverOffsets, mounted]);

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
          scale: 1.06,
          rotate: -7,
          x: 2,
          y: -2,
          duration: 0.24,
          ease: "power2.out",
        });
        break;
      case "HOVER_PROJECT":
        gsap.to(pointer, {
          scale: 1.14,
          rotate: -10,
          x: 3,
          y: -3,
          duration: 0.28,
          ease: "back.out(1.7)",
        });
        break;
      case "HOVER_MAGNETIC":
        gsap.to(pointer, {
          scale: 0.94,
          rotate: -12,
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
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const isDark =
        target?.closest(".section-dark") !== null ||
        target?.closest("[data-modal-dark]") !== null;
      const rippleDuration = 1060;

      const color = isDark
        ? "rgba(249, 247, 244, 0.98)"
        : "rgba(12, 12, 11, 0.94)";
      rippleLockUntilRef.current = performance.now() + rippleDuration;
      clearHoverOffsets(activeTextRef.current);

      const variant = createWaveVariant(waveVariantRef.current);
      waveVariantRef.current += 1;

      const wave = document.createElement("div");
      wave.style.cssText = `
        position: fixed;
        left: ${e.clientX - SOURCE_X}px;
        top: ${e.clientY - SOURCE_Y}px;
        width: ${WAVE_VIEWBOX.width}px;
        height: ${WAVE_VIEWBOX.height}px;
        pointer-events: none;
        z-index: 9997;
        overflow: visible;
        transform-origin: ${SOURCE_X}px ${SOURCE_Y}px;
      `;

      wave.innerHTML = `
        <svg width="${WAVE_VIEWBOX.width}" height="${WAVE_VIEWBOX.height}" viewBox="0 0 ${WAVE_VIEWBOX.width} ${WAVE_VIEWBOX.height}" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
          <path d="${variant[0]}" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="${variant[1]}" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.84"/>
          <path d="${variant[2]}" stroke="${color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.68"/>
        </svg>
      `;

      document.body.appendChild(wave);

      gsap.fromTo(
        wave,
        {
          scale: 0.76,
          opacity: 0.98,
          rotate: -10 + Math.random() * 20,
          x: -1 + Math.random() * 2,
          y: 0,
        },
        {
          scale: 1.38 + Math.random() * 0.18,
          opacity: 0,
          x: -1 + Math.random() * 3,
          y: -7 - Math.random() * 5,
          duration: rippleDuration / 1000,
          ease: "power2.out",
          onComplete: () => wave.remove(),
        }
      );

      const scope = target?.closest<HTMLElement>(SCOPE_SELECTOR) ?? document.body;
      const textTargets = scopedTextTargetsRef.current.get(scope) ?? [];
      const surfaceTargets = scopedSurfaceTargetsRef.current.get(scope) ?? [];
      clearHoverOffsets(textTargets);

      const animateTarget = (
        el: HTMLElement,
        magnitude: number,
        durationOut: number,
        durationIn: number
      ) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        if (
          rect.bottom < -60 ||
          rect.top > window.innerHeight + 60 ||
          rect.right < -60 ||
          rect.left > window.innerWidth + 60
        ) {
          return;
        }

        const cx = Math.max(rect.left, Math.min(e.clientX, rect.right));
        const cy = Math.max(rect.top, Math.min(e.clientY, rect.bottom));
        const dx = cx - e.clientX;
        const dy = cy - e.clientY;
        const dist = Math.hypot(dx, dy);
        const maxDist = 240;
        if (dist > maxDist) return;

        const strength = (1 - dist / maxDist) * magnitude;
        const angle = Math.atan2(dy, dx);
        const targetOffset = {
          x: Math.cos(angle) * strength,
          y: Math.sin(angle) * strength,
        };
        const current = clickOffsetsRef.current.get(el) || { x: 0, y: 0 };
        const offset = { x: current.x, y: current.y };

        gsap.killTweensOf(offset);
        gsap.timeline({
          onComplete: () => {
            clickOffsetsRef.current.delete(el);
            applyOffset(el);
          },
        })
          .to(offset, {
            x: targetOffset.x,
            y: targetOffset.y,
            duration: durationOut,
            ease: "sine.out",
            onUpdate: () => {
              clickOffsetsRef.current.set(el, { x: offset.x, y: offset.y });
              applyOffset(el);
            },
          })
          .to(offset, {
            x: 0,
            y: 0,
            duration: durationIn,
            ease: "sine.inOut",
            onUpdate: () => {
              clickOffsetsRef.current.set(el, { x: offset.x, y: offset.y });
              applyOffset(el);
            },
          });
      };

      textTargets.forEach((el) => animateTarget(el, 16, 0.36, 1.02));
      surfaceTargets.forEach((el) => animateTarget(el, 16, 0.36, 1.02));

      if (cursorRef.current) {
        gsap.fromTo(
          cursorRef.current,
          { scale: 0.92, rotate: -16 },
          {
            scale: cursorState === "DEFAULT" ? 1 : 1.08,
            rotate: cursorState === "DEFAULT" ? 0 : -10,
            duration: 0.34,
            ease: "power3.out",
          }
        );
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [applyOffset, clearHoverOffsets, cursorState, mounted]);

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
          width: "30px",
          height: "36px",
          color: "var(--text-light)",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-2px, -2px)",
          transformOrigin: "4px 4px",
          willChange: "left, top, transform",
          filter: "drop-shadow(0 0 8px rgba(0, 0, 0, 0.1))",
          mixBlendMode: "difference",
        }}
      >
        <svg
          viewBox="0 0 30 36"
          width="30"
          height="36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", overflow: "visible" }}
        >
          <path
            d="M2 2V31L10.2 21.2L15.3 33.2L20.1 31.1L14.9 19.8H27.8L2 2Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="miter"
          />
        </svg>
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

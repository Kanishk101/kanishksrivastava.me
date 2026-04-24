"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useCursor } from "@/contexts/CursorContext";

const DISTORT_SELECTORS = [
  "nav a",
  "main h1",
  "main h2",
  "main h3",
  "main p",
  "main a",
  "main button",
  "main span[data-link-label]",
].join(", ");

const buildWavePaths = () => {
  const arc = Math.random() * 4 + 2;
  const drift = Math.random() * 4 + 1;
  const spread = Math.random() * 3 + 1;

  const variants = [
    [
      `M5 27 Q16 ${22 - arc} 32 ${22 - drift}`,
      `M4 18 Q17 ${10 - arc} 38 ${10 - drift + spread}`,
      `M3 9 Q18 ${-1 - arc} 44 ${0 - drift + spread}`,
    ],
    [
      `M5 27 C14 ${23 - arc}, 22 ${19 - arc}, 33 ${20 - drift}`,
      `M4 18 C15 ${11 - arc}, 24 ${7 - arc}, 39 ${8 - drift + spread}`,
      `M3 9 C16 ${0 - arc}, 26 ${-3 - arc}, 45 ${-1 - drift + spread}`,
    ],
    [
      `M5 27 Q15 ${23 - arc} 22 ${21 - arc} T34 ${21 - drift}`,
      `M4 18 Q16 ${11 - arc} 24 ${8 - arc} T40 ${8 - drift + spread}`,
      `M3 9 Q17 ${0 - arc} 27 ${-2 - arc} T46 ${0 - drift + spread}`,
    ],
    [
      `M6 27 Q17 ${21 - arc} 30 ${24 - drift}`,
      `M5 18 Q18 ${10 - arc} 37 ${12 - drift + spread}`,
      `M4 9 Q19 ${-2 - arc} 43 ${2 - drift + spread}`,
    ],
  ] as const;

  return variants[Math.floor(Math.random() * variants.length)];
};

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const posRef = useRef({ x: -100, y: -100 });
  const hoverOffsetsRef = useRef(
    new WeakMap<HTMLElement, { x: number; y: number }>()
  );
  const clickOffsetsRef = useRef(
    new WeakMap<HTMLElement, { x: number; y: number }>()
  );
  const distortableRef = useRef<HTMLElement[]>([]);
  const { cursorState, setCursorState } = useCursor();
  const [mounted] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches
  );

  const applyDistortion = useCallback((el: HTMLElement) => {
    const hover = hoverOffsetsRef.current.get(el) || { x: 0, y: 0 };
    const click = clickOffsetsRef.current.get(el) || { x: 0, y: 0 };
    el.style.transform = `translate(${hover.x + click.x}px, ${hover.y + click.y}px)`;
  }, []);

  const splitTextNode = useCallback((node: Text) => {
    if (!node.textContent || !node.parentElement) return;
    if (!node.textContent.trim()) return;

    const parent = node.parentElement;
    const frag = document.createDocumentFragment();

    node.textContent.split("").forEach((char) => {
      const span = document.createElement("span");
      span.className = "cursor-distort-char";
      span.setAttribute("aria-hidden", "true");
      span.style.display = "inline-block";
      span.style.willChange = "transform";
      span.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
      span.textContent = char === " " ? "\u00A0" : char;
      frag.appendChild(span);
    });

    parent.insertBefore(frag, node);
    parent.removeChild(node);
  }, []);

  const splitElementText = useCallback(
    (root: HTMLElement) => {
      if (root.dataset.cursorSplit === "true") return;
      if (root.closest("#cursor")) return;
      if (root.classList.contains("hero-char")) return;
      if (root.querySelector("input, textarea, select, svg")) return;

      const textNodes: Text[] = [];
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
          if (!node.parentElement) return NodeFilter.FILTER_REJECT;
          if (
            node.parentElement.closest(
              "svg, script, style, input, textarea, select"
            )
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          if (node.parentElement.classList.contains("hero-char")) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      while (walker.nextNode()) {
        textNodes.push(walker.currentNode as Text);
      }

      if (textNodes.length === 0) {
        root.dataset.cursorSplit = "true";
        return;
      }

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

    const collectDistortables = () => {
      Array.from(document.querySelectorAll<HTMLElement>(DISTORT_SELECTORS)).forEach(
        (el) => splitElementText(el)
      );

      distortableRef.current = Array.from(
        document.querySelectorAll<HTMLElement>(".hero-char, .cursor-distort-char")
      ).filter((el) => !el.closest("#cursor"));

      distortableRef.current.forEach((el) => {
        el.style.willChange = "transform";
        if (!el.classList.contains("hero-char")) {
          el.style.transition =
            "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
        }
      });
    };

    collectDistortables();
    window.addEventListener("resize", collectDistortables);

    return () => {
      window.removeEventListener("resize", collectDistortables);
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

      const maxDist = 200;
      distortableRef.current.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

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

        applyDistortion(el);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    gsap.ticker.add(tickPointer);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(tickPointer);
    };
  }, [applyDistortion, mounted]);

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
      const elUnder = document.elementFromPoint(e.clientX, e.clientY);
      const isDark =
        elUnder?.closest(".section-dark") !== null ||
        elUnder?.closest("[data-modal-dark]") !== null;

      const color = isDark
        ? "rgba(249, 247, 244, 0.98)"
        : "rgba(12, 12, 11, 0.94)";

      const variant = buildWavePaths();
      const rotation = -16 + Math.random() * 32;
      const driftX = 4 + Math.random() * 10;
      const driftY = -4 - Math.random() * 10;
      const scaleBump = 1.26 + Math.random() * 0.18;

      const wave = document.createElement("div");
      wave.style.cssText = `
        position: fixed;
        left: ${e.clientX + 6}px;
        top: ${e.clientY - 28}px;
        width: 58px;
        height: 44px;
        pointer-events: none;
        z-index: 9997;
        transform-origin: 6px 30px;
      `;

      wave.innerHTML = `
        <svg width="58" height="44" viewBox="0 0 58 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="${variant[0]}" stroke="${color}" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="${variant[1]}" stroke="${color}" stroke-width="3.9" stroke-linecap="round" stroke-linejoin="round" opacity="0.84"/>
          <path d="${variant[2]}" stroke="${color}" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round" opacity="0.68"/>
        </svg>
      `;

      document.body.appendChild(wave);

      gsap.fromTo(
        wave,
        { scale: 0.72, opacity: 0.98, x: 0, y: 0, rotate: rotation },
        {
          scale: scaleBump,
          opacity: 0,
          x: driftX,
          y: driftY,
          duration: 1,
          ease: "sine.out",
          onComplete: () => wave.remove(),
        }
      );

      const maxDist = 240;
      distortableRef.current.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - e.clientX;
        const dy = cy - e.clientY;
        const dist = Math.hypot(dx, dy);
        if (dist > maxDist) return;

        const strength = (1 - dist / maxDist) * 18;
        const angle = Math.atan2(dy, dx);
        const target = {
          x: Math.cos(angle) * strength,
          y: Math.sin(angle) * strength,
        };
        const offset = { x: 0, y: 0 };

        gsap.timeline({
          onComplete: () => {
            clickOffsetsRef.current.delete(el);
            applyDistortion(el);
          },
        })
          .to(offset, {
            x: target.x,
            y: target.y,
            duration: 0.34,
            ease: "sine.out",
            onUpdate: () => {
              clickOffsetsRef.current.set(el, { x: offset.x, y: offset.y });
              applyDistortion(el);
            },
          })
          .to(offset, {
            x: 0,
            y: 0,
            duration: 0.9,
            ease: "sine.inOut",
            onUpdate: () => {
              clickOffsetsRef.current.set(el, { x: offset.x, y: offset.y });
              applyDistortion(el);
            },
          });
      });

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
  }, [applyDistortion, cursorState, mounted]);

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

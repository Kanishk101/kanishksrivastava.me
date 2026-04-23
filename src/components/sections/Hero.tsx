"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLoader } from "@/contexts/LoaderContext";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const { loaderComplete } = useLoader();

  // Split name into individually-addressable characters
  const renderNameChars = useCallback((text: string, lineClass: string) => {
    return text.split("").map((char, i) => (
      <span
        key={`${lineClass}-${i}`}
        ref={(el) => {
          if (el) charsRef.current.push(el);
        }}
        className="hero-char"
        style={{
          display: "inline-block",
          willChange: "transform",
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !nameContainerRef.current || !loaderComplete) return;

    const section = sectionRef.current;
    const nameContainer = nameContainerRef.current;

    const ctx = gsap.context(() => {
      // ═══════════════════════════════════════════════
      // ENTRY: Simple opacity fade — NO transform
      // (transforms are purely owned by ScrollTrigger)
      // ═══════════════════════════════════════════════
      gsap.to(nameContainer, {
        opacity: 0.6, // match ScrollTrigger's initial opacity
        duration: 0.8,
        delay: 0.15,
        ease: "power2.out",
      });

      gsap.to(scrollIndicatorRef.current, {
        opacity: 1,
        duration: 0.6,
        delay: 0.5,
        ease: "power2.out",
      });

      // ═══════════════════════════════════════════════
      // MAIN EFFECT: Perspective Scroll Transform
      // ═══════════════════════════════════════════════
      const perspectiveTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
          pin: pinContainerRef.current,
          pinSpacing: true, // push About section down properly
        },
      });

      // Name: flat/distant → erupts toward viewer
      // Completes by 50% so role/manifesto have breathing room
      perspectiveTl.fromTo(
        nameContainer,
        {
          rotateX: 60,
          scale: 0.4,
          letterSpacing: "0.5em",
          opacity: 0.6,
        },
        {
          rotateX: 0,
          scale: 1,
          letterSpacing: "-0.02em",
          opacity: 1,
          ease: "none",
          duration: 0.45, // completes at 45% of scroll
        },
        0
      );

      // Scroll indicator fades out early
      perspectiveTl.to(
        scrollIndicatorRef.current,
        { opacity: 0, duration: 0.15, ease: "none" },
        0.05
      );
    }, section);

    // ═══════════════════════════════════════════════
    // MAGNETIC CURSOR: Character-level distortion
    // ═══════════════════════════════════════════════
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const animateChars = () => {
      const chars = charsRef.current;
      const { x: mx, y: my } = mouseRef.current;

      chars.forEach((char) => {
        if (!char) return;
        const rect = char.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 200;

        if (dist < maxDist) {
          const strength = (1 - dist / maxDist) * 0.35;
          const moveX = dx * strength * 0.15;
          const moveY = dy * strength * 0.1;
          char.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
          char.style.transform = "translate(0, 0)";
        }
      });

      rafRef.current = requestAnimationFrame(animateChars);
    };

    const isDesktop = window.matchMedia("(pointer: fine)").matches;
    if (isDesktop) {
      window.addEventListener("mousemove", handleMouseMove);
      rafRef.current = requestAnimationFrame(animateChars);
    }

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [loaderComplete]);

  charsRef.current = [];

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-section="hero"
      className="section section-light relative"
      style={{
        height: "800vh",
      }}
    >
      {/* Pinned content container */}
      <div
        ref={pinContainerRef}
        className="w-full flex flex-col items-center justify-center relative"
        style={{
          height: "100vh",
          perspective: "800px",
          overflow: "hidden",
        }}
      >
        {/* Name — The Visual */}
        <div
          ref={nameContainerRef}
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform, opacity, letter-spacing",
            textAlign: "center",
            /* Initial state — matches GSAP fromTo "from" exactly */
            transform: "rotateX(60deg) scale(0.4)",
            letterSpacing: "0.5em",
            opacity: 0,
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "clamp(48px, 15vw, 200px)",
              lineHeight: 0.85,
              color: "var(--text-primary)",
              margin: 0,
              padding: 0,
            }}
          >
            <span className="block">{renderNameChars("Kanishk", "line1")}</span>
            <span className="block" style={{ marginTop: "0.05em" }}>
              {renderNameChars("Srivastava", "line2")}
            </span>
          </h1>
        </div>

        {/* Scroll Indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: 0 }}
        >
          <svg
            width="1"
            height="40"
            className="overflow-visible"
            aria-hidden="true"
          >
            <line
              x1="0.5"
              y1="0"
              x2="0.5"
              y2="40"
              stroke="var(--text-muted)"
              strokeWidth="1"
            />
            <circle r="2" cx="0.5" fill="var(--text-muted)">
              <animate
                attributeName="cy"
                values="0;40;0"
                dur="2s"
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
              />
            </circle>
          </svg>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "9px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}

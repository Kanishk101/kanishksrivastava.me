"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { useLoader } from "@/contexts/LoaderContext";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const { loaderComplete } = useLoader();

  // Split name into individually-addressable characters
  const renderNameChars = useCallback((
    text: string,
    lineClass: string,
    startIndex: number
  ) => {
    return text.split("").map((char, i) => (
      <span
        key={`${lineClass}-${i}`}
        ref={(el) => {
          charsRef.current[startIndex + i] = el;
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

      // Role line settles earlier so it can live on screen longer
      perspectiveTl.fromTo(
        roleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" },
        0.3
      );

      // Scroll indicator fades out early
      perspectiveTl.to(
        scrollIndicatorRef.current,
        { opacity: 0, duration: 0.15, ease: "none" },
        0.05
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, [loaderComplete]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-section="hero"
      className="section section-light relative"
      style={{
        height: "1450vh",
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
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "18% 12% auto",
            height: "42vh",
            background:
              "radial-gradient(circle at 50% 50%, rgba(196, 185, 174, 0.18), rgba(196, 185, 174, 0) 62%)",
            filter: "blur(38px)",
            pointerEvents: "none",
            opacity: 0.85,
          }}
        />

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
            textShadow: "0 18px 42px rgba(12, 12, 11, 0.12)",
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
            <span className="block">
              {renderNameChars("Kanishk", "line1", 0)}
            </span>
            <span className="block" style={{ marginTop: "0.05em" }}>
              {renderNameChars("Srivastava", "line2", 7)}
            </span>
          </h1>
        </div>

        {/* Role line — appears after scroll */}
        <p
          ref={roleRef}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "11px",
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
            marginTop: "36px",
            opacity: 0,
            textAlign: "center",
            textShadow: "0 8px 18px rgba(12, 12, 11, 0.08)",
          }}
        >
          Full-Stack Engineer · iOS Developer · Creative Technologist
        </p>

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

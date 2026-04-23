"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const manifestoRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !nameRef.current) return;

    const ctx = gsap.context(() => {
      // Perspective scroll transform on the name
      gsap.fromTo(
        nameRef.current,
        {
          rotateX: 60,
          scale: 0.4,
          letterSpacing: "0.5em",
          opacity: 0.6,
          transformOrigin: "center center",
        },
        {
          rotateX: 0,
          scale: 1.1,
          letterSpacing: "-0.02em",
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
            pin: false,
          },
        }
      );

      // Role line fades in after scroll settles
      gsap.fromTo(
        roleRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "40% top",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Manifesto
      gsap.fromTo(
        manifestoRef.current,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "45% top",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-section="hero"
      className="section section-light relative flex items-center justify-center"
      style={{
        height: "200vh",
        perspective: "800px",
      }}
    >
      <div
        className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center"
        style={{ zIndex: 1 }}
      >
        {/* Name — The Visual */}
        <h1
          ref={nameRef}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(48px, 15vw, 200px)",
            lineHeight: 0.9,
            color: "var(--text-primary)",
            textAlign: "center",
            willChange: "transform, opacity",
          }}
        >
          Kanishk
          <br />
          Srivastava
        </h1>

        {/* Role line */}
        <p
          ref={roleRef}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "11px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
            marginTop: "32px",
            opacity: 0,
          }}
        >
          Full-Stack Engineer · iOS Developer · Creative Technologist
        </p>

        {/* Manifesto tagline */}
        <p
          ref={manifestoRef}
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "16px",
            color: "var(--text-muted)",
            textAlign: "center",
            maxWidth: "400px",
            marginTop: "16px",
            lineHeight: 1.6,
            opacity: 0,
          }}
        >
          I build things that work beautifully.
          <br />I design things that work precisely.
        </p>

        {/* Scroll Indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-12 flex flex-col items-center gap-2"
        >
          <svg width="1" height="40" className="overflow-visible">
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

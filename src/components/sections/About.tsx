"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLoader } from "@/contexts/LoaderContext";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const textColumnRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const body1Ref = useRef<HTMLParagraphElement>(null);
  const body2Ref = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLParagraphElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  const { loaderComplete } = useLoader();

  useEffect(() => {
    if (!sectionRef.current || !loaderComplete) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(min-width: 1024px)", () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=170%",
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
          },
        });

        timeline
          .fromTo(
            ambientRef.current,
            { opacity: 0.25, scale: 0.92 },
            { opacity: 0.95, scale: 1.06, duration: 0.3 },
            0
          )
          .fromTo(
            labelRef.current,
            { opacity: 0, y: 36 },
            { opacity: 1, y: 0, duration: 0.16 },
            0.04
          )
          .fromTo(
            quoteRef.current,
            { opacity: 0, y: 68 },
            { opacity: 1, y: 0, duration: 0.24 },
            0.1
          )
          .fromTo(
            [body1Ref.current, body2Ref.current, metaRef.current],
            { opacity: 0, y: 54 },
            {
              opacity: 1,
              y: 0,
              duration: 0.26,
              stagger: 0.05,
            },
            0.16
          )
          .fromTo(
            portraitRef.current,
            { opacity: 0, y: 88, scale: 0.9, rotate: -3 },
            { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 0.34 },
            0.12
          )
          .to({}, { duration: 0.34 }, 0.32)
          .to(textColumnRef.current, { y: -84, duration: 0.18 }, 0.72)
          .to(
            portraitRef.current,
            { y: -96, scale: 1.03, duration: 0.2 },
            0.72
          )
          .to(quoteRef.current, { y: -92, opacity: 0.62, duration: 0.16 }, 0.78)
          .to(
            [body1Ref.current, body2Ref.current],
            {
              y: -38,
              opacity: 0.74,
              stagger: 0.03,
              duration: 0.16,
            },
            0.8
          )
          .to(metaRef.current, { y: -24, opacity: 0.54, duration: 0.14 }, 0.82)
          .to(shellRef.current, { y: -10, duration: 0.14 }, 0.84);
      });

      mm.add("(max-width: 1023px)", () => {
        if (quoteRef.current) {
          gsap.fromTo(
            quoteRef.current,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 65%",
              },
            }
          );
        }

        gsap.fromTo(
          labelRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
            },
          }
        );

        [body1Ref.current, body2Ref.current].forEach((el, idx) => {
          if (!el) return;
          gsap.fromTo(
            el,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: idx * 0.12,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 60%",
              },
            }
          );
        });

        gsap.fromTo(
          metaRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 55%",
            },
          }
        );

        gsap.fromTo(
          portraitRef.current,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 65%",
            },
          }
        );
      });
    }, sectionRef);

    return () => {
      mm.revert();
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [loaderComplete]);

  return (
    <section
      ref={sectionRef}
      id="about"
      data-section="about"
      className="section section-light"
      style={{
        minHeight: "100vh",
        padding: "0",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        ref={ambientRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "12% 8%",
          background:
            "radial-gradient(circle at 18% 24%, rgba(196, 185, 174, 0.22), transparent 0 34%), radial-gradient(circle at 82% 70%, rgba(12, 12, 11, 0.1), transparent 0 30%)",
          filter: "blur(28px)",
          opacity: 0.35,
          pointerEvents: "none",
        }}
      />
      <div
        ref={shellRef}
        className="section-content"
        style={{ paddingTop: "160px", paddingBottom: "140px" }}
      >
        <div
          ref={textColumnRef}
          className="flex flex-col lg:flex-row items-center"
          style={{ gap: "clamp(48px, 6vw, 96px)" }}
        >
          {/* ═══ LEFT COLUMN — Text (45%) ═══ */}
          <div className="w-full lg:w-[45%] order-2 lg:order-1">
            {/* Section Label */}
            <span
              ref={labelRef}
              data-ripple-text
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: "10px",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                display: "block",
                marginBottom: "40px",
                opacity: 0,
              }}
            >
              About
            </span>

            <p
              ref={quoteRef}
              data-ripple-text
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "clamp(30px, 2.9vw, 42px)",
                lineHeight: 1.24,
                color: "var(--text-primary)",
                marginBottom: "32px",
                maxWidth: "500px",
                opacity: 0,
              }}
            >
              I write code the way others compose music.
            </p>

            {/* Body Text Block 1 */}
            <p
              ref={body1Ref}
              data-ripple-text
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "16px",
                lineHeight: 1.8,
                color: "var(--text-secondary)",
                marginBottom: "20px",
                opacity: 0,
              }}
            >
              I&apos;m a creative technologist working at the intersection of
              engineering precision and design intelligence. I build full-stack
              web platforms and native iOS applications with obsessive attention
              to craft, performance, and the invisible details that separate good
              software from remarkable software.
            </p>

            {/* Body Text Block 2 */}
            <p
              ref={body2Ref}
              data-ripple-text
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "16px",
                lineHeight: 1.8,
                color: "var(--text-secondary)",
                marginBottom: "40px",
                opacity: 0,
              }}
            >
              My philosophy is simple: every interaction should feel intentional,
              every system should be elegant under the hood, and every product
              should make people genuinely enjoy using it.
            </p>

            {/* Meta Info Row */}
            <p
              ref={metaRef}
              data-ripple-text
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: "11px",
                letterSpacing: "0.2em",
                color: "var(--text-muted)",
                opacity: 0,
              }}
            >
              Based in India &nbsp;·&nbsp; Open to full-time &nbsp;·&nbsp; Class
              of 2025
            </p>
          </div>

          {/* ═══ RIGHT COLUMN — Portrait (55%) ═══ */}
          <div className="w-full lg:w-[55%] order-1 lg:order-2 flex justify-end">
            <div
              ref={portraitRef}
              data-ripple-reactive
              className="relative w-full group"
              style={{
                aspectRatio: "3/4",
                maxHeight: "520px",
                maxWidth: "390px",
                background:
                  "linear-gradient(180deg, rgba(232, 228, 223, 0.9) 0%, rgba(240, 237, 232, 0.96) 100%)",
                border: "1px solid var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                opacity: 0,
                boxShadow:
                  "0 36px 90px rgba(12, 12, 11, 0.12), 0 0 0 1px rgba(196, 185, 174, 0.18) inset",
                transition:
                  "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease",
                marginLeft: "auto",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.borderColor = "var(--text-secondary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.borderColor = "var(--accent)";
              }}
            >
              {/* Wireframe placeholder */}
              <div className="flex flex-col items-center gap-3">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-muted)"
                  strokeWidth="1"
                  opacity="0.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                  }}
                >
                  Photo
                </span>
              </div>

              {/* Corner accents for wireframe feel */}
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  width: "16px",
                  height: "16px",
                  borderTop: "1px solid var(--accent)",
                  borderLeft: "1px solid var(--accent)",
                  opacity: 0.5,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  width: "16px",
                  height: "16px",
                  borderTop: "1px solid var(--accent)",
                  borderRight: "1px solid var(--accent)",
                  opacity: 0.5,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "12px",
                  left: "12px",
                  width: "16px",
                  height: "16px",
                  borderBottom: "1px solid var(--accent)",
                  borderLeft: "1px solid var(--accent)",
                  opacity: 0.5,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "12px",
                  right: "12px",
                  width: "16px",
                  height: "16px",
                  borderBottom: "1px solid var(--accent)",
                  borderRight: "1px solid var(--accent)",
                  opacity: 0.5,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

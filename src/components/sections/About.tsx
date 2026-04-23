"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLoader } from "@/contexts/LoaderContext";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const body1Ref = useRef<HTMLParagraphElement>(null);
  const body2Ref = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLParagraphElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const { loaderComplete } = useLoader();

  useEffect(() => {
    if (!sectionRef.current || !loaderComplete) return;

    const ctx = gsap.context(() => {
      // ═══════════════════════════════════════════════
      // PULL QUOTE: Word-by-word clip reveal
      // ═══════════════════════════════════════════════
      if (quoteRef.current) {
        const quoteEl = quoteRef.current;
        const text = quoteEl.textContent || "";
        const words = text.split(" ");

        // Wrap each word in a clip container
        quoteEl.innerHTML = words
          .map(
            (word) =>
              `<span style="display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:4px;"><span class="quote-word" style="display:inline-block;transform:translateY(105%);">${word}</span></span>&nbsp;`
          )
          .join("");

        const wordEls = quoteEl.querySelectorAll(".quote-word");

        gsap.to(wordEls, {
          y: "0%",
          stagger: 0.05,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // ═══════════════════════════════════════════════
      // SECTION LABEL: fade up
      // ═══════════════════════════════════════════════
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
            toggleActions: "play none none reverse",
          },
        }
      );

      // ═══════════════════════════════════════════════
      // BODY PARAGRAPHS: staggered line-by-line fade up
      // ═══════════════════════════════════════════════
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
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // ═══════════════════════════════════════════════
      // META INFO: fade up after body
      // ═══════════════════════════════════════════════
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
            toggleActions: "play none none reverse",
          },
        }
      );

      // ═══════════════════════════════════════════════
      // PORTRAIT: fade + scale up
      // ═══════════════════════════════════════════════
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
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loaderComplete]);

  return (
    <section
      ref={sectionRef}
      id="about"
      data-section="about"
      className="section section-light"
      style={{ minHeight: "100vh", padding: "160px 0 120px" }}
    >
      <div className="section-content">
        <div
          className="flex flex-col lg:flex-row items-center"
          style={{ gap: "clamp(48px, 6vw, 96px)" }}
        >
          {/* ═══ LEFT COLUMN — Text (45%) ═══ */}
          <div className="w-full lg:w-[45%] order-2 lg:order-1">
            {/* Section Label */}
            <span
              ref={labelRef}
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
              01 — About
            </span>

            {/* Pull Quote — word-by-word clip reveal */}
            <p
              ref={quoteRef}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "28px",
                lineHeight: 1.35,
                color: "var(--text-primary)",
                marginBottom: "36px",
                maxWidth: "440px",
              }}
            >
              I write code the way others compose music.
            </p>

            {/* Body Text Block 1 */}
            <p
              ref={body1Ref}
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
              className="relative w-full group"
              style={{
                aspectRatio: "3/4",
                maxHeight: "520px",
                maxWidth: "390px",
                backgroundColor: "var(--grid-line)",
                border: "1px solid var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                opacity: 0,
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

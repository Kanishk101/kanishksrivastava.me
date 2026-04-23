"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const body1Ref = useRef<HTMLParagraphElement>(null);
  const body2Ref = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLParagraphElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5 }
      )
        .fromTo(
          quoteRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.2"
        )
        .fromTo(
          body1Ref.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.3"
        )
        .fromTo(
          body2Ref.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.3"
        )
        .fromTo(
          metaRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.3"
        )
        .fromTo(
          portraitRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" },
          "-=0.8"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      data-section="about"
      className="section section-light"
      style={{ minHeight: "100vh", padding: "120px 0" }}
    >
      <div className="section-content">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          {/* Left Column — Text */}
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
                marginBottom: "32px",
              }}
            >
              01 — About
            </span>

            {/* Pull Quote */}
            <p
              ref={quoteRef}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "28px",
                lineHeight: 1.3,
                color: "var(--text-primary)",
                marginBottom: "32px",
              }}
            >
              I write code the way others compose music.
            </p>

            {/* Body 1 */}
            <p
              ref={body1Ref}
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "16px",
                lineHeight: 1.8,
                color: "var(--text-secondary)",
                marginBottom: "20px",
              }}
            >
              I&apos;m a creative technologist working at the intersection of
              engineering precision and design intelligence. I build full-stack
              web platforms and native iOS applications with obsessive attention
              to craft, performance, and the invisible details that separate good
              software from remarkable software.
            </p>

            {/* Body 2 */}
            <p
              ref={body2Ref}
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "16px",
                lineHeight: 1.8,
                color: "var(--text-secondary)",
                marginBottom: "32px",
              }}
            >
              My philosophy is simple: every interaction should feel intentional,
              every system should be elegant under the hood, and every product
              should make people genuinely enjoy using it.
            </p>

            {/* Meta Info */}
            <p
              ref={metaRef}
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: "11px",
                letterSpacing: "0.2em",
                color: "var(--text-muted)",
              }}
            >
              Based in India · Open to full-time · Class of 2025
            </p>
          </div>

          {/* Right Column — Portrait */}
          <div className="w-full lg:w-[55%] order-1 lg:order-2">
            <div
              ref={portraitRef}
              className="relative w-full transition-transform duration-300 hover:scale-[1.02]"
              style={{
                aspectRatio: "3/4",
                maxHeight: "520px",
                backgroundColor: "var(--grid-line)",
                border: "1px solid var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "auto",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  letterSpacing: "0.2em",
                }}
              >
                [ Photo ]
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLoader } from "@/contexts/LoaderContext";

export default function Quote() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const attrRef = useRef<HTMLParagraphElement>(null);
  const { loaderComplete } = useLoader();

  useEffect(() => {
    if (!sectionRef.current || !quoteRef.current || !loaderComplete) return;

    const ctx = gsap.context(() => {
      // ═══════════════════════════════════════════════
      // WORD-BY-WORD REVEAL — feels like the quote
      // is being spoken, words arrive with weight
      // ═══════════════════════════════════════════════
      const quoteEl = quoteRef.current!;
      const text = quoteEl.textContent || "";
      const words = text.split(" ");

      quoteEl.innerHTML = words
        .map(
          (word) =>
            `<span class="quote-word" style="display:inline-block;opacity:0;transform:translateY(20px) scale(0.95);">${word}&nbsp;</span>`
        )
        .join("");

      const wordEls = quoteEl.querySelectorAll(".quote-word");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      // Each word reveals individually
      tl.to(wordEls, {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.06,
        duration: 0.5,
        ease: "power3.out",
      });

      // Attribution fades in 300ms after last word
      tl.fromTo(
        attrRef.current,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        `>-0.1` // slight overlap with end of word animation
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loaderComplete]);

  return (
    <section
      ref={sectionRef}
      id="quote"
      data-section="quote"
      className="section section-dark relative flex items-center justify-center"
      style={{
        height: "100vh",
        zIndex: 2,
      }}
    >
      {/*
        Grain suppression: a solid cover div that sits above the
        body::before grain overlay (z-index 9990). This blocks the
        grain from showing through on this dark section.
      */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "var(--bg-dark)",
          zIndex: 9991,
          pointerEvents: "none",
        }}
      />

      <div
        className="text-center"
        style={{
          maxWidth: "65%",
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 9992,
        }}
      >
        {/* The Quote */}
        <blockquote
          ref={quoteRef}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "clamp(32px, 5vw, 72px)",
            lineHeight: 1.4,
            color: "var(--text-light)",
            margin: 0,
            padding: 0,
            border: "none",
          }}
        >
          Design is not just what it looks and feels like. Design is how it
          works.
        </blockquote>

        {/* Attribution */}
        <p
          ref={attrRef}
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "11px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginTop: "32px",
            opacity: 0,
          }}
        >
          {"\u2014 Steve Jobs"}
        </p>
      </div>
    </section>
  );
}

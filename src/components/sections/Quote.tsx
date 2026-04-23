"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useLoader } from "@/contexts/LoaderContext";

const QUOTE_TEXT =
  "Design is not just what it looks and feels like. Design is how it works.";
const QUOTE_WORDS = QUOTE_TEXT.split(" ");

export default function Quote() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const attrRef = useRef<HTMLParagraphElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const { loaderComplete } = useLoader();

  useEffect(() => {
    if (!sectionRef.current || !quoteRef.current || !loaderComplete) return;

    const ctx = gsap.context(() => {
      const wordEls = wordRefs.current.filter(Boolean);

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

      // Attribution fades in while last few words are still animating (not after)
      tl.fromTo(
        attrRef.current,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        `-=${(wordEls.length * 0.06 * 0.4).toFixed(2)}` // starts 40% before last word finishes
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
      <div
        className="text-center"
        style={{
          maxWidth: "65%",
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 2,
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
          {QUOTE_WORDS.map((word, index) => (
            <span
              key={`${word}-${index}`}
              ref={(el) => {
                wordRefs.current[index] = el;
              }}
              className="quote-word"
              style={{
                display: "inline-block",
                opacity: 0,
                transform: "translateY(20px) scale(0.95)",
              }}
            >
              {word}
              {index < QUOTE_WORDS.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
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
          {"— Steve Jobs"}
        </p>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useLoader } from "@/contexts/LoaderContext";

const QUOTE_TEXT =
  "Design is not just what it looks and feels like. Design is how it works.";
const QUOTE_WORDS = QUOTE_TEXT.split(" ");

export default function Quote() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const quoteGroupRef = useRef<HTMLDivElement>(null);
  const attrRef = useRef<HTMLParagraphElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const { loaderComplete } = useLoader();

  useEffect(() => {
    if (!sectionRef.current || !pinRef.current || !quoteGroupRef.current || !loaderComplete) {
      return;
    }

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const words = wordRefs.current.filter(Boolean);

      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=150%",
            scrub: 0.85,
            pin: pinRef.current,
            anticipatePin: 1,
          },
        });

        tl.fromTo(
          quoteGroupRef.current,
          { opacity: 0, y: 60, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.18 },
          0.04
        )
          .to(
            words,
            {
              opacity: 1,
              y: 0,
              stagger: 0.05,
              duration: 0.18,
            },
            0.08
          )
          .fromTo(
            attrRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.12 },
            0.22
          )
          .to({}, { duration: 0.28 }, 0.34)
          .to(
            quoteGroupRef.current,
            { y: -70, opacity: 0.32, duration: 0.18 },
            0.78
          )
          .to(
            attrRef.current,
            { y: -30, opacity: 0.18, duration: 0.12 },
            0.82
          );
      });

      mm.add("(max-width: 1023px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        });

        tl.fromTo(
          quoteGroupRef.current,
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 0.5 },
          0
        )
          .to(
            words,
            {
              opacity: 1,
              y: 0,
              stagger: 0.04,
              duration: 0.32,
            },
            0.04
          )
          .fromTo(
            attrRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.32 },
            0.22
          );
      });
    }, sectionRef);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [loaderComplete]);

  return (
    <section
      ref={sectionRef}
      id="quote"
      data-section="quote"
      className="section section-dark"
      style={{ minHeight: "230vh" }}
    >
      <div
        ref={pinRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 32px",
        }}
      >
        <div
          ref={quoteGroupRef}
          data-ripple-reactive
          style={{
            maxWidth: "1200px",
            width: "100%",
            textAlign: "center",
            opacity: 0,
          }}
        >
          <blockquote
            data-ripple-reactive
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(34px, 5vw, 74px)",
              lineHeight: 1.24,
              color: "var(--text-light)",
              margin: 0,
            }}
          >
            {QUOTE_WORDS.map((word, index) => (
              <span
                key={`${word}-${index}`}
                ref={(el) => {
                  wordRefs.current[index] = el;
                }}
                data-ripple-text
                style={{
                  display: "inline-block",
                  opacity: 0.18,
                  transform: "translateY(16px)",
                }}
              >
                {word}
                {index < QUOTE_WORDS.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
          </blockquote>

          <p
            ref={attrRef}
            data-ripple-text
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "11px",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginTop: "28px",
              opacity: 0,
            }}
          >
            — Steve Jobs
          </p>
        </div>
      </div>
    </section>
  );
}

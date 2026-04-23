"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function Quote() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const attrRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !quoteRef.current) return;

    const ctx = gsap.context(() => {
      // Split quote into words and wrap each in a span
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
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(wordEls, {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.06,
        duration: 0.5,
        ease: "power3.out",
      }).fromTo(
        attrRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4 },
        "-=0.1"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
      {/* No grain/grid on this section — moment of silence */}
      <div className="text-center" style={{ maxWidth: "65%", margin: "0 auto" }}>
        <blockquote
          ref={quoteRef}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "clamp(32px, 5vw, 72px)",
            lineHeight: 1.4,
            color: "var(--text-light)",
          }}
        >
          Design is not just what it looks and feels like. Design is how it
          works.
        </blockquote>

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
          — Steve Jobs
        </p>
      </div>
    </section>
  );
}

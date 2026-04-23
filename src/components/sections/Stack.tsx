"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLoader } from "@/contexts/LoaderContext";

const SKILL_GROUPS = [
  {
    label: "Languages",
    skills: ["Swift", "TypeScript", "Python", "JavaScript", "Dart"],
  },
  {
    label: "Frontend",
    skills: ["React", "Next.js", "Three.js", "GSAP", "Tailwind CSS"],
  },
  {
    label: "Backend",
    skills: ["Node.js", "Express", "PostgreSQL", "REST APIs", "GraphQL"],
  },
  {
    label: "iOS",
    skills: ["SwiftUI", "UIKit", "CoreData", "Xcode", "TestFlight"],
  },
  {
    label: "Tools & Platforms",
    skills: ["Git", "Figma", "Vercel", "Docker", "Firebase"],
  },
];

export default function Stack() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { loaderComplete } = useLoader();

  useEffect(() => {
    if (!sectionRef.current || !loaderComplete) return;

    const ctx = gsap.context(() => {
      // Section label
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

      // Cards stagger in
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: i * 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 65%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Stagger pills inside each card after card appears
        const pills = card.querySelectorAll(".skill-pill");
        gsap.fromTo(
          pills,
          { opacity: 0, y: 8, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.03,
            duration: 0.3,
            delay: i * 0.08 + 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 65%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loaderComplete]);

  return (
    <section
      ref={sectionRef}
      id="stack"
      data-section="stack"
      className="section section-light"
      style={{ minHeight: "100vh", padding: "160px 0 120px" }}
    >
      <div className="section-content">
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
            marginBottom: "56px",
            opacity: 0,
          }}
        >
          03 — Stack
        </span>

        {/* Skill Groups Grid — 3 columns desktop, 2 tablet, 1 mobile */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "48px 40px",
          }}
        >
          {SKILL_GROUPS.map((group, i) => (
            <div
              key={group.label}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              style={{ opacity: 0 }}
            >
              {/* Group Label */}
              <h3
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: "11px",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  borderBottom: "1px solid var(--grid-line)",
                  paddingBottom: "8px",
                  marginBottom: "16px",
                }}
              >
                {group.label}
              </h3>

              {/* Skill Pills */}
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="skill-pill"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 300,
                      fontSize: "13px",
                      letterSpacing: "0.05em",
                      padding: "6px 14px",
                      border: "1px solid var(--grid-line)",
                      backgroundColor: "transparent",
                      color: "var(--text-primary)",
                      transition:
                        "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
                      display: "inline-block",
                      opacity: 0,
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.backgroundColor = "var(--bg-dark)";
                      el.style.color = "var(--text-light)";
                      el.style.borderColor = "var(--bg-dark)";
                      el.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.backgroundColor = "transparent";
                      el.style.color = "var(--text-primary)";
                      el.style.borderColor = "var(--grid-line)";
                      el.style.transform = "translateY(0)";
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

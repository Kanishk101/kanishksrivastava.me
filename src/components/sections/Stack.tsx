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
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const { loaderComplete } = useLoader();

  useEffect(() => {
    if (!sectionRef.current || !stripRef.current || !loaderComplete) return;

    const ctx = gsap.context(() => {
      const strip = stripRef.current!;
      const stripWidth = strip.scrollWidth;
      const viewportWidth = window.innerWidth;
      const scrollDistance = stripWidth - viewportWidth + 200;

      if (scrollDistance > 0) {
        gsap.to(strip, {
          x: -scrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
            pin: pinContainerRef.current!,
            pinSpacing: true,
            anticipatePin: 1,
          },
        });
      }

      // Label fades in
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

      // Cards wave-in
      const cards = strip.querySelectorAll(".stack-card");
      const offsets = [0, -20, 12, -12, 20];
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: offsets[i % offsets.length], opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
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
      style={{ height: "500vh" }}
    >
      <div
        ref={pinContainerRef}
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
          padding: "0 var(--space-2xl)",
        }}
      >
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

        {/* Horizontal Strip */}
        <div
          ref={stripRef}
          style={{
            display: "flex",
            gap: "40px",
            willChange: "transform",
          }}
        >
          {SKILL_GROUPS.map((group) => (
            <div
              key={group.label}
              className="stack-card"
              style={{
                width: "380px",
                minWidth: "380px",
                height: "360px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--grid-line)",
                padding: "36px",
                display: "flex",
                flexDirection: "column",
                opacity: 0,
                transition:
                  "background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.backgroundColor = "var(--bg-primary)";
                el.style.borderColor = "var(--text-muted)";
                el.style.transform = "translateY(-6px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.backgroundColor = "var(--bg-surface)";
                el.style.borderColor = "var(--grid-line)";
                el.style.transform = "translateY(0)";
              }}
            >
              {/* Group Label */}
              <h3
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 800,
                  fontSize: "10px",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  borderBottom: "1px solid var(--grid-line)",
                  paddingBottom: "14px",
                  marginBottom: "24px",
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
                      fontSize: "14px",
                      letterSpacing: "0.05em",
                      padding: "8px 18px",
                      border: "1px solid var(--grid-line)",
                      backgroundColor: "transparent",
                      color: "var(--text-primary)",
                      transition:
                        "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
                      display: "inline-block",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.backgroundColor = "var(--bg-dark)";
                      el.style.color = "var(--text-light)";
                      el.style.borderColor = "var(--bg-dark)";
                      el.style.transform = "translateY(-2px)";
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

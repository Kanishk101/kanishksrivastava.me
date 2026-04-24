"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
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
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Cards wave-in — y only, opacity always 1
      const cards = strip.querySelectorAll(".stack-card");
      const offsets = [0, -20, 12, -12, 20];
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: offsets[i % offsets.length] },
          {
            y: 0,
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
      className="section section-light lg:h-[500vh]"
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "8% 8% auto",
          height: "36vh",
          background:
            "radial-gradient(circle at 18% 32%, rgba(196, 185, 174, 0.16), transparent 40%), radial-gradient(circle at 82% 62%, rgba(12, 12, 11, 0.08), transparent 32%)",
          filter: "blur(34px)",
          pointerEvents: "none",
          opacity: 0.9,
        }}
      />
      <div
        ref={pinContainerRef}
        data-stack-pin
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
          data-ripple-text
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "10px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            display: "block",
            marginBottom: "56px",
          }}
        >
          Stack
        </span>

        <p
          data-ripple-text
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "17px",
            lineHeight: 1.7,
            color: "var(--text-secondary)",
            maxWidth: "560px",
            marginBottom: "44px",
          }}
        >
          An evolving toolkit across product engineering, interface systems, and native platforms.
        </p>

        {/* Horizontal Strip */}
        <div
          ref={stripRef}
          className="flex flex-col lg:flex-row"
          style={{
            gap: "56px",
            willChange: "transform",
          }}
        >
          {SKILL_GROUPS.map((group) => (
            <div
              key={group.label}
              className="stack-card"
              data-ripple-reactive
              style={{
                width: "min(456px, calc(100vw - 48px))",
                minWidth: "min(456px, calc(100vw - 48px))",
                height: "clamp(360px, 82vw, 456px)",
                background:
                  "linear-gradient(180deg, rgba(249, 247, 244, 0.84), rgba(240, 237, 232, 0.96))",
                border: "1px solid rgba(196, 185, 174, 0.34)",
                padding: "clamp(32px, 6vw, 72px)",
                display: "flex",
                flexDirection: "column",
                boxShadow:
                  "0 28px 64px rgba(12, 12, 11, 0.08), 0 0 0 1px rgba(249, 247, 244, 0.42) inset",
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
                data-ripple-text
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 800,
                  fontSize: "10px",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  borderBottom: "1px solid var(--grid-line)",
                  paddingBottom: "18px",
                  marginBottom: "34px",
                }}
              >
                {group.label}
              </h3>

              <span
                data-ripple-text
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "34px",
                  color: "rgba(107, 103, 96, 0.58)",
                  marginBottom: "34px",
                }}
              >
                0{SKILL_GROUPS.indexOf(group) + 1}
              </span>

              {/* Skill Pills */}
              <div className="flex flex-wrap gap-3">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="skill-pill"
                    data-ripple-reactive
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 300,
                      fontSize: "15px",
                      letterSpacing: "0.05em",
                      padding: "11px 22px",
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

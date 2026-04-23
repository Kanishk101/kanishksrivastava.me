"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const EXPERIENCE = [
  {
    date: "2023 – Present",
    role: "Senior Engineer / Lead",
    company: "Company Name",
    description:
      "Leading engineering initiatives across the full stack, driving architectural decisions and mentoring a growing team of developers.",
  },
  {
    date: "2021 – 2023",
    role: "Full-Stack Developer",
    company: "Company Name",
    description:
      "Built and shipped production web applications and APIs, collaborating closely with design and product teams.",
  },
  {
    date: "2020 – 2021",
    role: "iOS Developer (Intern)",
    company: "Company Name",
    description:
      "Developed native iOS features using Swift and UIKit, contributing to apps used by thousands of daily active users.",
  },
  {
    date: "2020",
    role: "BSc Computer Science",
    company: "University Name",
    description: "Graduated with First Class Honours.",
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<SVGLineElement>(null);
  const entriesRef = useRef<(HTMLDivElement | null)[]>([]);
  const nodesRef = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Timeline line draws itself
      if (timelineRef.current) {
        const lineLength = timelineRef.current.getTotalLength();
        gsap.fromTo(
          timelineRef.current,
          {
            strokeDasharray: lineLength,
            strokeDashoffset: lineLength,
          },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "bottom 80%",
              scrub: true,
            },
          }
        );
      }

      // Entries and nodes animate in
      entriesRef.current.forEach((entry, i) => {
        if (!entry) return;

        gsap.fromTo(
          entry,
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: entry,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        if (nodesRef.current[i]) {
          gsap.fromTo(
            nodesRef.current[i],
            { scale: 0, transformOrigin: "center" },
            {
              scale: 1,
              duration: 0.3,
              ease: "back.out(2)",
              scrollTrigger: {
                trigger: entry,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      data-section="experience"
      className="section section-light"
      style={{ minHeight: "100vh", padding: "120px 0" }}
    >
      <div className="section-content">
        {/* Section Label */}
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            fontSize: "10px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            display: "block",
            marginBottom: "48px",
          }}
        >
          04 — Experience
        </span>

        {/* Timeline */}
        <div className="relative" style={{ paddingLeft: "40px" }}>
          {/* SVG Timeline Spine */}
          <svg
            className="absolute left-0 top-0"
            style={{ width: "2px", height: "100%" }}
          >
            <line
              ref={timelineRef}
              x1="1"
              y1="0"
              x2="1"
              y2="100%"
              stroke="var(--accent)"
              strokeWidth="2"
            />
          </svg>

          {/* Entries */}
          <div className="flex flex-col gap-16">
            {EXPERIENCE.map((item, i) => (
              <div
                key={i}
                ref={(el) => { entriesRef.current[i] = el; }}
                className="relative"
                style={{ opacity: 0 }}
              >
                {/* Timeline Node */}
                <svg
                  className="absolute"
                  style={{
                    left: "-44px",
                    top: "4px",
                    width: "10px",
                    height: "10px",
                  }}
                >
                  <circle
                    ref={(el) => { nodesRef.current[i] = el; }}
                    cx="5"
                    cy="5"
                    r="3"
                    fill="var(--accent)"
                  />
                </svg>

                {/* Content */}
                <div>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 400,
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    {item.date}
                  </span>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 700,
                        fontSize: "18px",
                        color: "var(--text-primary)",
                      }}
                    >
                      {item.role}
                    </h3>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 300,
                        fontStyle: "italic",
                        fontSize: "18px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      · {item.company}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 300,
                      fontSize: "14px",
                      lineHeight: 1.7,
                      color: "var(--text-secondary)",
                      maxWidth: "480px",
                      marginTop: "8px",
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

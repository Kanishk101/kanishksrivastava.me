"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLoader } from "@/contexts/LoaderContext";

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
  const labelRef = useRef<HTMLSpanElement>(null);
  const timelineLineRef = useRef<SVGLineElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const entriesRef = useRef<(HTMLDivElement | null)[]>([]);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
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

      // Timeline line draws itself using clip-path
      if (timelineContainerRef.current) {
        gsap.fromTo(
          timelineContainerRef.current.querySelector(".timeline-line"),
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 55%",
              end: "bottom 80%",
              scrub: 0.5,
            },
          }
        );
      }

      // Entries slide in from right as timeline passes
      entriesRef.current.forEach((entry, i) => {
        if (!entry) return;

        gsap.fromTo(
          entry,
          { opacity: 0, x: 25 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: entry,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Node circles scale in
        if (nodesRef.current[i]) {
          gsap.fromTo(
            nodesRef.current[i],
            { scale: 0 },
            {
              scale: 1,
              duration: 0.4,
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
  }, [loaderComplete]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      data-section="experience"
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
          04 — Experience
        </span>

        {/* Timeline Container */}
        <div
          ref={timelineContainerRef}
          className="relative"
          style={{ paddingLeft: "48px" }}
        >
          {/* Timeline Spine — thin vertical line */}
          <div
            className="timeline-line absolute"
            style={{
              left: "0",
              top: "0",
              width: "2px",
              height: "100%",
              backgroundColor: "var(--accent)",
              transformOrigin: "top center",
              transform: "scaleY(0)",
            }}
          />

          {/* Entries */}
          <div className="flex flex-col" style={{ gap: "56px" }}>
            {EXPERIENCE.map((item, i) => (
              <div
                key={i}
                ref={(el) => {
                  entriesRef.current[i] = el;
                }}
                className="relative"
                style={{ opacity: 0 }}
              >
                {/* Timeline Node — circle on the spine */}
                <div
                  ref={(el) => {
                    nodesRef.current[i] = el;
                  }}
                  className="absolute"
                  style={{
                    left: "-52px",
                    top: "6px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "var(--accent)",
                    transform: "scale(0)",
                  }}
                />

                {/* Content */}
                <div>
                  {/* Date */}
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 400,
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    {item.date}
                  </span>

                  {/* Role + Company */}
                  <div
                    className="flex flex-wrap items-baseline"
                    style={{ gap: "8px", marginBottom: "8px" }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 700,
                        fontSize: "18px",
                        color: "var(--text-primary)",
                        lineHeight: 1.3,
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

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 300,
                      fontSize: "14px",
                      lineHeight: 1.7,
                      color: "var(--text-secondary)",
                      maxWidth: "480px",
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

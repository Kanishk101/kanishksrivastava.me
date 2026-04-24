"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
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
  const pinRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const entriesRef = useRef<(HTMLDivElement | null)[]>([]);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const { loaderComplete } = useLoader();

  useEffect(() => {
    if (!sectionRef.current || !pinRef.current || !loaderComplete) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(min-width: 1024px)", () => {
        if (!listRef.current) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=230%",
            scrub: 0.8,
            pin: pinRef.current,
            anticipatePin: 1,
          },
        });

        tl.fromTo(
          labelRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.08 },
          0.02
        ).fromTo(
          lineRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          { scaleY: 1, duration: 0.82, ease: "none" },
          0.06
        );

        tl.fromTo(
          listRef.current,
          { y: 70 },
          { y: -310, duration: 0.92, ease: "none" },
          0.08
        );

        entriesRef.current.forEach((entry, index) => {
          if (!entry) return;
          const start = 0.12 + index * 0.16;
          const node = nodesRef.current[index];

          tl.fromTo(
            entry,
            { opacity: 0.08, y: 70, x: 34, filter: "blur(8px)" },
            { opacity: 1, y: 0, x: 0, filter: "blur(0px)", duration: 0.18 },
            start
          );

          if (node) {
            tl.fromTo(
              node,
              { scale: 0, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.12, ease: "back.out(2)" },
              start + 0.02
            );
            tl.to(
              node,
              {
                backgroundColor: "var(--text-primary)",
                scale: 1.18,
                duration: 0.1,
              },
              start + 0.08
            );
            if (index > 0 && nodesRef.current[index - 1]) {
              tl.to(
                nodesRef.current[index - 1],
                {
                  backgroundColor: "var(--accent)",
                  scale: 1,
                  duration: 0.1,
                },
                start + 0.08
              );
            }
          }
        });
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo(
          labelRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
            },
          }
        );

        gsap.fromTo(
          lineRef.current,
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

        entriesRef.current.forEach((entry, index) => {
          if (!entry) return;

          gsap.fromTo(
            entry,
            { opacity: 0, x: 24, y: 18 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.55,
              scrollTrigger: {
                trigger: entry,
                start: "top 82%",
              },
            }
          );

          if (nodesRef.current[index]) {
            gsap.fromTo(
              nodesRef.current[index],
              { scale: 0 },
              {
                scale: 1,
                duration: 0.35,
                ease: "back.out(2)",
                scrollTrigger: {
                  trigger: entry,
                  start: "top 82%",
                },
              }
            );
          }
        });
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
      id="experience"
      data-section="experience"
      className="section section-light lg:min-h-[280vh]"
    >
      <div
        ref={pinRef}
        className="section-content"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingTop: "180px",
          paddingBottom: "180px",
        }}
      >
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
            opacity: 0,
          }}
        >
          Experience
        </span>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "72px 1fr",
            gap: "56px",
            alignItems: "start",
          }}
        >
          <div style={{ position: "relative", minHeight: "820px" }}>
            <div
              ref={lineRef}
              data-ripple-reactive
              style={{
                position: "absolute",
                left: "34px",
                top: 0,
                width: "3px",
                height: "100%",
                backgroundColor: "var(--accent)",
                transformOrigin: "top center",
                transform: "scaleY(0)",
              }}
            />
            {EXPERIENCE.map((_, index) => (
              <div
                key={`node-${index}`}
                ref={(el) => {
                  nodesRef.current[index] = el;
                }}
                data-ripple-reactive
                style={{
                  position: "absolute",
                  left: "28px",
                  top: `${index * 212}px`,
                  width: "14px",
                  height: "14px",
                  borderRadius: "999px",
                  backgroundColor: "var(--accent)",
                  transform: "scale(0)",
                }}
              />
            ))}
          </div>

          <div
            ref={listRef}
            className="flex flex-col"
            style={{ gap: "132px", willChange: "transform" }}
          >
            {EXPERIENCE.map((item, index) => (
              <div
                key={item.role}
                ref={(el) => {
                  entriesRef.current[index] = el;
                }}
                style={{ opacity: 0 }}
              >
                <span
                  data-ripple-text
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 400,
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  {item.date}
                </span>
                <div
                  className="flex flex-wrap items-baseline"
                  style={{ gap: "10px", marginBottom: "12px" }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 700,
                      fontSize: "clamp(26px, 2.4vw, 42px)",
                      color: "var(--text-primary)",
                      lineHeight: 1.18,
                    }}
                  >
                    {item.role}
                  </h3>
                  <span
                    data-ripple-text
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 300,
                      fontStyle: "italic",
                      fontSize: "clamp(24px, 2.1vw, 36px)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    · {item.company}
                  </span>
                </div>
                  <p
                    data-ripple-text
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 300,
                      fontSize: "18px",
                      lineHeight: 1.72,
                      color: "var(--text-secondary)",
                      maxWidth: "760px",
                    }}
                  >
                    {item.description}
                  </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

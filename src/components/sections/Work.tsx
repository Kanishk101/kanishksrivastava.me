"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { AnimatePresence, motion } from "framer-motion";

interface Project {
  id: string;
  index: string;
  name: string;
  type: string;
  year: string;
  description: string;
  stack: string[];
  github?: string;
  live?: string;
}

const PROJECTS: Project[] = [
  {
    id: "alpha",
    index: "01",
    name: "Project Alpha",
    type: "iOS Application",
    year: "2024",
    description:
      "A beautifully crafted iOS application that pushes the boundaries of mobile interaction design. Built with SwiftUI and backed by a robust server architecture, it delivers a seamless user experience across all Apple devices.",
    stack: ["Swift", "SwiftUI", "Firebase", "Node.js"],
    github: "#",
    live: "#",
  },
  {
    id: "beta",
    index: "02",
    name: "Project Beta",
    type: "Web Platform",
    year: "2024",
    description:
      "A full-stack web platform reimagining how teams collaborate on creative projects. Features real-time updates, sophisticated permission systems, and an interface that gets out of your way.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind"],
    github: "#",
    live: "#",
  },
  {
    id: "gamma",
    index: "03",
    name: "Project Gamma",
    type: "Full-Stack App",
    year: "2023",
    description:
      "An end-to-end application solving complex data visualization challenges. Combines a React frontend with a Python backend to process and present analytical insights in real time.",
    stack: ["React", "Python", "GraphQL", "Docker"],
    github: "#",
    live: "#",
  },
  {
    id: "delta",
    index: "04",
    name: "Project Delta",
    type: "Mobile & API",
    year: "2023",
    description:
      "A cross-platform mobile experience paired with a sophisticated REST API. Designed for scale, built for delight, and optimized for the moments that matter most to users.",
    stack: ["React Native", "Express", "MongoDB", "Redis"],
    github: "#",
    live: "#",
  },
];

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoverImagePos, setHoverImagePos] = useState({ x: 0, y: 0 });
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      rowsRef.current.forEach((row, i) => {
        if (!row) return;
        gsap.fromTo(
          row,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setHoverImagePos({ x: e.clientX + 20, y: e.clientY - 70 });
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="work"
        data-section="work"
        className="section section-surface"
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
              marginBottom: "16px",
            }}
          >
            02 — Work
          </span>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--accent)",
              marginBottom: "48px",
            }}
          />

          {/* Project List */}
          <div>
            {PROJECTS.map((project, i) => (
              <div
                key={project.id}
                ref={(el) => { rowsRef.current[i] = el; }}
                className="group"
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr auto auto",
                  alignItems: "center",
                  gap: "24px",
                  height: "80px",
                  borderBottom: "1px solid var(--grid-line)",
                  opacity: 0,
                  transition: "background-color 0.2s ease",
                  padding: "0 16px",
                }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                onMouseMove={handleMouseMove}
                onClick={() => setSelectedProject(project)}
                data-cursor="pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSelectedProject(project);
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--grid-line)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {/* Index */}
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "var(--text-muted)",
                  }}
                >
                  {project.index}
                </span>

                {/* Name */}
                <span
                  className="relative"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(24px, 3vw, 36px)",
                    color: "var(--text-primary)",
                  }}
                >
                  {project.name}
                </span>

                {/* Type */}
                <span
                  className="hidden sm:block"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 400,
                    fontSize: "11px",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "var(--text-secondary)",
                  }}
                >
                  {project.type}
                </span>

                {/* Year */}
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 400,
                    fontSize: "13px",
                    color: "var(--text-muted)",
                  }}
                >
                  {project.year}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Hover Image */}
        {hoveredProject && (
          <div
            style={{
              position: "fixed",
              left: hoverImagePos.x,
              top: hoverImagePos.y,
              width: "200px",
              height: "140px",
              backgroundColor: "var(--bg-dark-elevated)",
              transform: "rotate(-3deg) scale(1)",
              pointerEvents: "none",
              zIndex: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 0.2s ease",
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                color: "var(--text-muted)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              {PROJECTS.find((p) => p.id === hoveredProject)?.name}
            </span>
          </div>
        )}
      </section>

      {/* Full-Screen Case Study Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              backgroundColor: "var(--bg-dark)",
              overflowY: "auto",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedProject(null);
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              style={{
                position: "fixed",
                top: "24px",
                right: "48px",
                fontFamily: "var(--font-sans)",
                fontSize: "24px",
                color: "var(--text-light)",
                background: "none",
                border: "none",
                zIndex: 101,
                padding: "8px",
              }}
              aria-label="Close project"
            >
              ×
            </button>

            <div style={{ padding: "80px 48px", maxWidth: "1200px", margin: "0 auto" }}>
              {/* Project Header */}
              <div style={{ marginBottom: "48px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    letterSpacing: "0.3em",
                  }}
                >
                  {selectedProject.index}
                </span>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 300,
                    fontSize: "clamp(36px, 5vw, 64px)",
                    color: "var(--text-light)",
                    marginTop: "8px",
                  }}
                >
                  {selectedProject.name}
                </h2>
              </div>

              {/* Hero Image Placeholder */}
              <div
                style={{
                  width: "100%",
                  height: "50vh",
                  backgroundColor: "var(--bg-dark-elevated)",
                  marginBottom: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    letterSpacing: "0.3em",
                  }}
                >
                  [ Project Screenshot ]
                </span>
              </div>

              {/* Content Grid */}
              <div className="flex flex-col md:flex-row gap-16">
                {/* Left — Description & Stack */}
                <div className="flex-1">
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 300,
                      fontSize: "16px",
                      lineHeight: 1.8,
                      color: "var(--text-secondary)",
                      marginBottom: "32px",
                    }}
                  >
                    {selectedProject.description}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.stack.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "10px",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "var(--accent)",
                          border: "1px solid var(--bg-dark-border)",
                          padding: "6px 14px",
                          borderRadius: "2px",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right — Links */}
                <div className="flex flex-col gap-4">
                  {selectedProject.live && (
                    <a
                      href={selectedProject.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "14px",
                        color: "var(--text-light)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      View Live ↗
                    </a>
                  )}
                  {selectedProject.github && (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "14px",
                        color: "var(--text-light)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

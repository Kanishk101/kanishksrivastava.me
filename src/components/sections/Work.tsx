"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { AnimatePresence, motion } from "framer-motion";
import { useLoader } from "@/contexts/LoaderContext";

interface Project {
  id: string;
  index: string;
  name: string;
  type: string;
  year: string;
  description: string;
  secondaryDescription: string;
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
    secondaryDescription:
      "The project focused on creating fluid animations and gesture-driven interfaces that feel native and responsive, with offline-first data persistence and real-time sync capabilities.",
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
    secondaryDescription:
      "Built with a focus on performance and accessibility, achieving sub-second page loads and WCAG AA compliance throughout the entire application.",
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
    secondaryDescription:
      "Features an interactive dashboard with drag-and-drop widgets, custom charting library, and WebSocket-powered live data streaming for instant updates.",
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
    secondaryDescription:
      "The API handles 10K+ requests per minute with intelligent caching, rate limiting, and comprehensive logging. The mobile client features offline support and push notifications.",
    stack: ["React Native", "Express", "MongoDB", "Redis"],
    github: "#",
    live: "#",
  },
];

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [displayedProject, setDisplayedProject] = useState<string | null>(null);
  const hoverImageRef = useRef<HTMLDivElement>(null);
  const hoverContentRef = useRef<HTMLSpanElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const imgPosRef = useRef({ x: 0, y: 0 });
  const { loaderComplete } = useLoader();

  const isPlaceholderHref = (href?: string) => !href || href === "#";

  const showHoveredProject = (projectId: string) => {
    if (hoveredProject === projectId && displayedProject === projectId) return;

    setHoveredProject(projectId);
    setDisplayedProject(projectId);

    if (hoverContentRef.current) {
      gsap.killTweensOf(hoverContentRef.current);
      gsap.fromTo(
        hoverContentRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.28, ease: "power2.out" }
      );
    }
  };

  const hideHoveredProject = () => {
    setHoveredProject(null);

    if (!hoverContentRef.current) {
      setDisplayedProject(null);
      return;
    }

    gsap.killTweensOf(hoverContentRef.current);
    gsap.to(hoverContentRef.current, {
      y: -14,
      opacity: 0,
      duration: 0.18,
      ease: "power2.in",
      overwrite: true,
      onComplete: () => setDisplayedProject(null),
    });
  };

  // ═══════════════════════════════════════════════
  // FLOATING HOVER IMAGE — follows cursor with lerp
  // ═══════════════════════════════════════════════
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX + 20, y: e.clientY - 70 };
    };

    const lerpImage = () => {
      if (!hoverImageRef.current) return;
      const lerp = 0.12;
      imgPosRef.current.x +=
        (mouseRef.current.x - imgPosRef.current.x) * lerp;
      imgPosRef.current.y +=
        (mouseRef.current.y - imgPosRef.current.y) * lerp;

      hoverImageRef.current.style.left = `${imgPosRef.current.x}px`;
      hoverImageRef.current.style.top = `${imgPosRef.current.y}px`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    gsap.ticker.add(lerpImage);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(lerpImage);
    };
  }, []);

  // ═══════════════════════════════════════════════
  // SCROLL ANIMATIONS
  // ═══════════════════════════════════════════════
  useEffect(() => {
    if (!sectionRef.current || !loaderComplete) return;

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
              start: "top 65%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loaderComplete]);

  // ═══════════════════════════════════════════════
  // BODY SCROLL LOCK when modal is open
  // ═══════════════════════════════════════════════
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      // Stop Lenis so it doesn't scroll underneath the modal
      import("@/lib/lenis").then(({ getLenis }) => {
        getLenis()?.stop();
      });
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      import("@/lib/lenis").then(({ getLenis }) => {
        getLenis()?.start();
      });
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      import("@/lib/lenis").then(({ getLenis }) => {
        getLenis()?.start();
      });
    };
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject || !modalRef.current) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const modal = modalRef.current;
    const focusFirst = () => {
      closeButtonRef.current?.focus();
    };

    const animationFrame = requestAnimationFrame(focusFirst);

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusable = modal.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const focusableEls = Array.from(focusable);
      if (focusableEls.length === 0) return;

      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleTabTrap);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("keydown", handleTabTrap);
      previouslyFocusedRef.current?.focus();
    };
  }, [selectedProject]);

  // ═══════════════════════════════════════════════
  // ESCAPE KEY to close modal
  // ═══════════════════════════════════════════════
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="work"
        data-section="work"
        className="section section-surface"
        style={{ minHeight: "100vh", padding: "160px 0 120px" }}
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
            {PROJECTS.map((project, i) => {
              const marqueeText = `${project.name} · ${project.type} · ${project.year} · `.repeat(10);
              return (
                <div
                  key={project.id}
                  ref={(el) => {
                    rowsRef.current[i] = el;
                  }}
                  style={{ opacity: 0 }}
                >
                  {/* Main Row */}
                  <button
                    type="button"
                    className="project-row w-full text-left"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "48px 1fr auto auto",
                      alignItems: "center",
                      gap: "24px",
                      height: "80px",
                      borderBottom: hoveredProject === project.id ? "none" : "1px solid var(--grid-line)",
                      padding: "0 16px",
                      position: "relative",
                      transition: "background-color 0.25s ease",
                    }}
                    onMouseEnter={() => showHoveredProject(project.id)}
                    onMouseLeave={hideHoveredProject}
                    onClick={() => setSelectedProject(project)}
                    data-cursor="pointer"
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        e.preventDefault();
                        setSelectedProject(project);
                      }
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(232, 228, 223, 0.6)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    aria-label={`Open ${project.name} case study`}
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

                    {/* Name with hover underline */}
                    <span
                      className="relative inline-block"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "clamp(22px, 3vw, 36px)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {project.name}
                      {/* Animated underline — wipes from left */}
                      <span
                        style={{
                          position: "absolute",
                          bottom: "2px",
                          left: 0,
                          width: "100%",
                          height: "1.5px",
                          backgroundColor: "var(--text-primary)",
                          transform:
                            hoveredProject === project.id
                              ? "scaleX(1)"
                              : "scaleX(0)",
                          transformOrigin: "left center",
                          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      />
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
                  </button>

                  {/* ═══ MARQUEE BAND — slides open on hover ═══ */}
                  <div
                    style={{
                      height: hoveredProject === project.id ? "44px" : "0px",
                      overflow: "hidden",
                      backgroundColor: "var(--text-primary)",
                      transition: "height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "1px solid var(--grid-line)",
                    }}
                    onMouseEnter={() => showHoveredProject(project.id)}
                    onMouseLeave={hideHoveredProject}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="marquee-track">
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontWeight: 800,
                          fontSize: "11px",
                          letterSpacing: "0.3em",
                          color: "var(--accent)",
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {marqueeText}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ FLOATING HOVER IMAGE ═══ */}
        <div
          ref={hoverImageRef}
          style={{
            position: "fixed",
            width: "200px",
            height: "140px",
            backgroundColor: "var(--bg-dark-elevated)",
            transform: "rotate(-3deg)",
            pointerEvents: "none",
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hoveredProject ? 1 : 0,
            scale: hoveredProject ? "1" : "0.8",
            transition: "opacity 0.25s ease, scale 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
          }}
        >
          <span
            ref={hoverContentRef}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              color: "var(--text-muted)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              willChange: "transform",
            }}
          >
            {PROJECTS.find((p) => p.id === displayedProject)?.name || ""}
          </span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
           FULL-SCREEN CASE STUDY MODAL
           ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            ref={modalRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            data-modal-dark
            role="dialog"
            aria-modal="true"
            aria-labelledby={`project-title-${selectedProject.id}`}
            tabIndex={-1}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              backgroundColor: "var(--bg-dark)",
              overflowY: "scroll",
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
              touchAction: "pan-y",
            }}
          >
            {/* Close Button */}
            <button
              ref={closeButtonRef}
              onClick={() => setSelectedProject(null)}
              className="fixed z-[101] group"
              style={{
                top: "24px",
                right: "48px",
                background: "none",
                border: "none",
                padding: "12px",
              }}
              aria-label="Close project"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-light)"
                strokeWidth="1.5"
                style={{
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "rotate(90deg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "rotate(0deg)";
                }}
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>

            <div
              style={{
                padding: "80px 48px 120px",
                maxWidth: "1200px",
                margin: "0 auto",
              }}
            >
              {/* Project Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{ marginBottom: "48px" }}
              >
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
                  id={`project-title-${selectedProject.id}`}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 300,
                    fontSize: "clamp(36px, 5vw, 64px)",
                    color: "var(--text-light)",
                    marginTop: "8px",
                    lineHeight: 1.1,
                  }}
                >
                  {selectedProject.name}
                </h2>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "var(--text-secondary)",
                    marginTop: "12px",
                    display: "inline-block",
                  }}
                >
                  {selectedProject.type} — {selectedProject.year}
                </span>
              </motion.div>

              {/* Hero Image Placeholder */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                style={{
                  width: "100%",
                  height: "50vh",
                  backgroundColor: "var(--bg-dark-elevated)",
                  marginBottom: "64px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Subtle gradient overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, rgba(196, 185, 174, 0.05), transparent)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                  }}
                >
                  [ Project Screenshot ]
                </span>
              </motion.div>

              {/* Content Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-col md:flex-row gap-16"
              >
                {/* Left — Description & Stack */}
                <div className="flex-1">
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 300,
                      fontSize: "16px",
                      lineHeight: 1.8,
                      color: "var(--text-secondary)",
                      marginBottom: "20px",
                    }}
                  >
                    {selectedProject.description}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 300,
                      fontSize: "16px",
                      lineHeight: 1.8,
                      color: "var(--text-secondary)",
                      marginBottom: "40px",
                    }}
                  >
                    {selectedProject.secondaryDescription}
                  </p>

                  {/* Tech Stack Label */}
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 700,
                      fontSize: "10px",
                      letterSpacing: "0.4em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                      display: "block",
                      marginBottom: "12px",
                    }}
                  >
                    Stack
                  </span>

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
                          transition:
                            "border-color 0.2s ease, color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "var(--accent)";
                          e.currentTarget.style.color = "var(--text-light)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor =
                            "var(--bg-dark-border)";
                          e.currentTarget.style.color = "var(--accent)";
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right — Links */}
                <div
                  className="flex flex-col gap-6"
                  style={{ minWidth: "180px" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 700,
                      fontSize: "10px",
                      letterSpacing: "0.4em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                      marginBottom: "4px",
                    }}
                  >
                    Links
                  </span>
                  {!isPlaceholderHref(selectedProject.live) ? (
                    <a
                      href={selectedProject.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "var(--text-light)",
                        letterSpacing: "0.05em",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        backgroundImage: "none",
                        transition: "opacity 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "0.7";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                    >
                      View Live
                      <span style={{ fontSize: "14px" }}>↗</span>
                    </a>
                  ) : (
                    <span
                      aria-disabled="true"
                      title="Replace the placeholder URL to enable this link."
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "var(--text-light)",
                        letterSpacing: "0.05em",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        opacity: 0.45,
                        cursor: "not-allowed",
                      }}
                    >
                      View Live
                      <span style={{ fontSize: "14px" }}>↗</span>
                    </span>
                  )}
                  {!isPlaceholderHref(selectedProject.github) ? (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "var(--text-light)",
                        letterSpacing: "0.05em",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        backgroundImage: "none",
                        transition: "opacity 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "0.7";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                    >
                      GitHub
                      <span style={{ fontSize: "14px" }}>↗</span>
                    </a>
                  ) : (
                    <span
                      aria-disabled="true"
                      title="Replace the placeholder URL to enable this link."
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "16px",
                        fontWeight: 400,
                        color: "var(--text-light)",
                        letterSpacing: "0.05em",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        opacity: 0.45,
                        cursor: "not-allowed",
                      }}
                    >
                      GitHub
                      <span style={{ fontSize: "14px" }}>↗</span>
                    </span>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

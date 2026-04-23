"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLoader } from "@/contexts/LoaderContext";
import { Mail } from "lucide-react";
import { SITE_EMAIL, SOCIAL_LINKS } from "@/lib/constants";

/* Inline SVG icons for brands (lucide-react removed brand icons) */
const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const XIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* Social links driven from constants — single source of truth (Issue 15 + 16 fix) */
const CONTACT_LINKS = [
  { label: "GitHub", icon: GithubIcon, href: SOCIAL_LINKS.github },
  { label: "LinkedIn", icon: LinkedinIcon, href: SOCIAL_LINKS.linkedin },
  { label: "Twitter/X", icon: XIcon, href: SOCIAL_LINKS.twitter },
  { label: "Email", icon: Mail, href: `mailto:${SITE_EMAIL}` },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const { loaderComplete } = useLoader();

  useEffect(() => {
    if (!sectionRef.current || !headingRef.current || !loaderComplete) return;

    const ctx = gsap.context(() => {
      // ═══════════════════════════════════════════════
      // CHARACTER-BY-CHARACTER HEADING REVEAL
      // ═══════════════════════════════════════════════
      const heading = headingRef.current!;

      // Process each line separately (split by <br>)
      const lines = heading.querySelectorAll(".heading-line");
      const allChars: Element[] = [];

      lines.forEach((line) => {
        const text = line.textContent || "";
        line.innerHTML = text
          .split("")
          .map(
            (char) =>
              `<span class="contact-char" style="display:inline-block;opacity:0;transform:translateY(10px);">${
                char === " " ? "&nbsp;" : char
              }</span>`
          )
          .join("");
        line.querySelectorAll(".contact-char").forEach((c) => allChars.push(c));
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      // Characters
      tl.to(
        allChars,
        {
          opacity: 1,
          y: 0,
          stagger: 0.02,
          duration: 0.35,
          ease: "power2.out",
        },
        0
      );

      // Content fades in after heading
      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        ">-0.3"
      );

      // Social links stagger
      if (socialsRef.current) {
        const links = socialsRef.current.querySelectorAll(".social-link");
        tl.fromTo(
          links,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            duration: 0.3,
            ease: "power2.out",
          },
          ">-0.2"
        );
      }
    }, sectionRef);

    // ═══════════════════════════════════════════════
    // MAGNETIC CTA BUTTON
    // ═══════════════════════════════════════════════
    const cta = ctaRef.current;
    if (cta && window.matchMedia("(pointer: fine)").matches) {
      const handleMove = (e: MouseEvent) => {
        const rect = cta.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120;

        if (dist < maxDist) {
          const strength = (1 - dist / maxDist) * 0.35;
          gsap.to(cta, {
            x: dx * strength,
            y: dy * strength,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      };

      const handleLeave = () => {
        gsap.to(cta, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)",
        });
      };

      cta.addEventListener("mousemove", handleMove);
      cta.addEventListener("mouseleave", handleLeave);

      return () => {
        ctx.revert();
        cta.removeEventListener("mousemove", handleMove);
        cta.removeEventListener("mouseleave", handleLeave);
      };
    }

    return () => ctx.revert();
  }, [loaderComplete]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-section="contact"
      className="section section-dark relative flex flex-col items-center justify-center"
      style={{ minHeight: "110dvh", padding: "120px 24px 80px" }}
    >
      {/* Grain suppression cover for dark section */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "var(--bg-dark)",
          zIndex: 9991,
          pointerEvents: "none",
        }}
      />

      {/* All content above grain cover */}
      <div style={{ position: "relative", zIndex: 9992, display: "contents" }}>
        {/* Main Heading — char-by-char reveal, explicit line break */}
        <h2
          ref={headingRef}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(40px, 7vw, 96px)",
            color: "var(--text-light)",
            textAlign: "center",
            lineHeight: 1.1,
            maxWidth: "900px",
            position: "relative",
            zIndex: 9992,
          }}
        >
          <span className="heading-line" style={{ display: "block" }}>Let&apos;s build something</span>
          <span className="heading-line" style={{ display: "block" }}>remarkable.</span>
        </h2>

        {/* Content below heading */}
        <div
          ref={contentRef}
          className="flex flex-col items-center"
          style={{ opacity: 0, position: "relative", zIndex: 9992 }}
        >
          {/* Subtext */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: "16px",
              color: "var(--text-secondary)",
              marginTop: "16px",
              textAlign: "center",
            }}
          >
            Currently open to full-time roles and select freelance projects.
          </p>

          {/* Email CTA — magnetic effect, uses centralized constant */}
          <a
            ref={ctaRef}
            href={`mailto:${SITE_EMAIL}`}
            data-magnetic
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              fontSize: "20px",
              color: "var(--text-light)",
              border: "1px solid var(--bg-dark-border)",
              padding: "18px 40px",
              marginTop: "40px",
              backgroundColor: "transparent",
              transition:
                "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
              backgroundImage: "none",
              display: "inline-block",
              willChange: "transform",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.backgroundColor = "var(--text-light)";
              el.style.color = "var(--bg-dark)";
              el.style.borderColor = "var(--text-light)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.backgroundColor = "transparent";
              el.style.color = "var(--text-light)";
              el.style.borderColor = "var(--bg-dark-border)";
            }}
          >
            {SITE_EMAIL}
          </a>

          {/* Social Links — driven from constants */}
          <div
            ref={socialsRef}
            className="flex items-center flex-wrap justify-center"
            style={{ gap: "40px", marginTop: "48px" }}
          >
            {CONTACT_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link flex items-center gap-2"
                style={{
                  color: "var(--text-secondary)",
                  transition: "color 0.2s ease",
                  backgroundImage: "none",
                  opacity: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--text-light)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                <link.icon size={16} />
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  {link.label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="absolute bottom-0 left-0 right-0 flex flex-col sm:flex-row items-center justify-between"
          style={{
            padding: "24px 48px",
            zIndex: 9992,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "11px",
              color: "var(--bg-dark-border)",
            }}
          >
            © {new Date().getFullYear()} Kanishk Srivastava
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "11px",
              color: "var(--bg-dark-border)",
            }}
          >
            Designed & Built with intention
          </span>
        </div>
      </div>
    </section>
  );
}

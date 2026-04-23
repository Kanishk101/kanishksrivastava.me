"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Stack", href: "#stack" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Scroll background transition
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Dark section detection via IntersectionObserver
    const darkSections = document.querySelectorAll(".section-dark");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsDark(true);
          } else {
            // Check if any dark section is still intersecting
            const anyDark = Array.from(darkSections).some((section) => {
              const rect = section.getBoundingClientRect();
              return rect.top < 80 && rect.bottom > 80;
            });
            setIsDark(anyDark);
          }
        });
      },
      {
        rootMargin: "-70px 0px -90% 0px",
        threshold: 0,
      }
    );

    darkSections.forEach((section) => observer.observe(section));

    // Active section detection
    const sections = document.querySelectorAll("[data-section]");
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section") || "";
            setActiveSection(id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          padding: "24px 48px",
          backgroundColor: scrolled
            ? isDark
              ? "rgba(12, 12, 11, 0.85)"
              : "rgba(249, 247, 244, 0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="flex items-center justify-between max-w-[1440px] mx-auto">
          {/* Monogram */}
          <a
            href="#"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="font-display text-xl tracking-wide"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "20px",
              color: isDark ? "var(--text-light)" : "var(--text-primary)",
              backgroundImage: "none",
            }}
            data-magnetic
          >
            KS
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="relative"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 400,
                  fontSize: "11px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: isDark ? "var(--text-secondary)" : "var(--text-secondary)",
                  backgroundImage: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = isDark
                    ? "var(--text-light)"
                    : "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                {link.label}
                {/* Active indicator dot */}
                {activeSection === link.href.slice(1) && (
                  <span
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                      bottom: "-8px",
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      backgroundColor: "var(--accent)",
                    }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] bg-transparent border-none p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className="block w-5 h-[1.5px] transition-all duration-300"
              style={{
                backgroundColor: isDark
                  ? "var(--text-light)"
                  : "var(--text-primary)",
                transform: mobileOpen
                  ? "rotate(45deg) translate(2px, 4px)"
                  : "none",
              }}
            />
            <span
              className="block w-5 h-[1.5px] transition-all duration-300"
              style={{
                backgroundColor: isDark
                  ? "var(--text-light)"
                  : "var(--text-primary)",
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-[1.5px] transition-all duration-300"
              style={{
                backgroundColor: isDark
                  ? "var(--text-light)"
                  : "var(--text-primary)",
                transform: mobileOpen
                  ? "rotate(-45deg) translate(2px, -4px)"
                  : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 md:hidden"
          style={{
            backgroundColor: "var(--bg-dark)",
          }}
        >
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "48px",
                color: "var(--text-light)",
                backgroundImage: "none",
                opacity: 0,
                animation: `fadeInUp 0.4s ${i * 0.08}s forwards`,
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

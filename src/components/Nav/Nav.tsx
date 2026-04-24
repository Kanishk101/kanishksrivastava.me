"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLoader } from "@/contexts/LoaderContext";

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
  const { loaderComplete } = useLoader();
  const mobileMenuId = useId();
  const navIsDark = isDark || activeSection === "contact";

  useEffect(() => {
    if (!loaderComplete) return;

    const darkSections = document.querySelectorAll<HTMLElement>(".section-dark");
    const contactSection = document.querySelector<HTMLElement>("#contact");

    const getNavDarkState = () =>
      Array.from(darkSections).some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top < 80 && rect.bottom > 80;
      }) ||
      (() => {
        if (!contactSection) return false;
        const rect = contactSection.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.28 && rect.bottom > 80;
      })();

    // Scroll background transition
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setIsDark(getNavDarkState());
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    // Dark section detection via IntersectionObserver
    const darkObserver = new IntersectionObserver(
      () => setIsDark(getNavDarkState()),
      {
        rootMargin: "-1px 0px -90% 0px",
        threshold: [0, 0.1],
      }
    );

    darkSections.forEach((section) => darkObserver.observe(section));

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
      darkObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, [loaderComplete]);

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

  // Hide nav during loader
  if (!loaderComplete) return null;

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          padding: "24px 48px",
          backgroundColor: scrolled
            ? navIsDark
              ? "rgba(12, 12, 11, 0.85)"
              : "rgba(249, 247, 244, 0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          transition:
            "background-color 0.4s ease, backdrop-filter 0.4s ease",
        }}
      >
        <div className="flex items-center justify-between max-w-[1440px] mx-auto">
          {/* Monogram */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            data-magnetic
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "20px",
              color: navIsDark ? "var(--text-light)" : "var(--text-primary)",
              backgroundImage: "none",
              transition: "color 0.4s ease",
              letterSpacing: "0.1em",
            }}
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
                  color:
                    activeSection === link.href.slice(1)
                      ? navIsDark
                        ? "var(--text-light)"
                        : "var(--text-primary)"
                      : "var(--text-secondary)",
                  backgroundImage: "none",
                  transition: "color 0.3s ease",
                  padding: "4px 0",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = navIsDark
                    ? "var(--text-light)"
                    : "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== link.href.slice(1)) {
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }
                }}
              >
                {link.label}
                {/* Active indicator dot */}
                {activeSection === link.href.slice(1) && (
                  <span
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                      bottom: "-6px",
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      backgroundColor: "var(--accent)",
                      display: "block",
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
            aria-expanded={mobileOpen}
            aria-controls={mobileMenuId}
            style={{ position: "relative", zIndex: 60 }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-[1.5px] transition-all duration-300"
                style={{
                  width: "20px",
                  backgroundColor:
                    mobileOpen || navIsDark
                      ? "var(--text-light)"
                      : "var(--text-primary)",
                  transform:
                    mobileOpen && i === 0
                      ? "rotate(45deg) translate(2px, 4.5px)"
                      : mobileOpen && i === 2
                        ? "rotate(-45deg) translate(2px, -4.5px)"
                        : "none",
                  opacity: mobileOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        id={mobileMenuId}
        className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 md:hidden"
        style={{
          backgroundColor: "var(--bg-dark)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
          transition: "opacity 0.4s ease",
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
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.4s ${i * 0.06}s ease, transform 0.4s ${i * 0.06}s ease`,
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}

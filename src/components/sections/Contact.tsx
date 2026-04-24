"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useLoader } from "@/contexts/LoaderContext";
import { SITE_EMAIL, SOCIAL_LINKS } from "@/lib/constants";

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

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.75A4 4 0 003.75 7.75v8.5a4 4 0 004 4h8.5a4 4 0 004-4v-8.5a4 4 0 00-4-4h-8.5zm8.938 1.312a1.188 1.188 0 110 2.376 1.188 1.188 0 010-2.376zM12 6.75A5.25 5.25 0 1112 17.25 5.25 5.25 0 0112 6.75zm0 1.75A3.5 3.5 0 1012 15.5 3.5 3.5 0 0012 8.5z" />
  </svg>
);

const CONTACT_LINKS = [
  { label: "GitHub", icon: GithubIcon, href: SOCIAL_LINKS.github, external: true },
  { label: "LinkedIn", icon: LinkedinIcon, href: SOCIAL_LINKS.linkedin, external: true },
  { label: "Twitter/X", icon: XIcon, href: SOCIAL_LINKS.twitter, external: true },
  { label: "Instagram", icon: InstagramIcon, href: SOCIAL_LINKS.instagram, external: true },
] as const;

const HEADING_WORDS = ["Let’s", "build", "something", "remarkable."];

const COPYRIGHT_YEAR = "2026";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const introWrapRef = useRef<HTMLDivElement>(null);
  const introInnerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subcopyRef = useRef<HTMLParagraphElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const formWrapRef = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([]);
  const messageRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const { loaderComplete } = useLoader();
  const [submitState, setSubmitState] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  useEffect(() => {
    if (!sectionRef.current || !pinRef.current || !loaderComplete) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(min-width: 1024px)", () => {
        const introStartWidth = Math.min(window.innerWidth - 120, 1200);
        const introEndWidth = Math.min(window.innerWidth * 0.34, 620);

        if (introInnerRef.current) {
          gsap.set(introInnerRef.current, {
            width: introStartWidth,
          });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=210%",
            scrub: 0.85,
            pin: pinRef.current,
            anticipatePin: 1,
          },
        });

        tl.fromTo(
          [headingRef.current, subcopyRef.current, emailRef.current],
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.16,
          },
          0.02
        )
          .fromTo(
            linksRef.current?.querySelectorAll(".contact-link") || [],
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.04,
              duration: 0.14,
            },
            0.16
          )
          .to({}, { duration: 0.22 }, 0.28)
          .fromTo(
            formWrapRef.current,
            { opacity: 0, x: 90, y: 28 },
            { opacity: 1, x: 0, y: 0, duration: 0.26 },
            0.68
          )
          .fromTo(
            fieldRefs.current,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.05,
              duration: 0.14,
            },
            0.76
          )
          .fromTo(
            [messageRef.current, submitRef.current],
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.05,
              duration: 0.14,
            },
            0.9
          )
          .to(
            introWrapRef.current,
            {
              x: "-24vw",
              y: -12,
              duration: 0.48,
            },
            0.68
          )
          .to(
            introInnerRef.current,
            {
              scale: 0.98,
              width: introEndWidth,
              duration: 0.52,
            },
            0.64
          )
          .to(
            headingRef.current,
            {
              letterSpacing: "-0.01em",
              duration: 0.48,
            },
            0.66
          )
          .to(
            footerRef.current,
            { opacity: 1, y: 0, duration: 0.16 },
            0.94
          );
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo(
          [headingRef.current, subcopyRef.current, emailRef.current],
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.07,
            duration: 0.55,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
            },
          }
        );

        gsap.fromTo(
          linksRef.current?.querySelectorAll(".contact-link") || [],
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            duration: 0.45,
            scrollTrigger: {
              trigger: linksRef.current,
              start: "top 82%",
            },
          }
        );

        gsap.fromTo(
          [formWrapRef.current, ...fieldRefs.current, messageRef.current, submitRef.current],
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.48,
            scrollTrigger: {
              trigger: formWrapRef.current,
              start: "top 84%",
            },
          }
        );

        gsap.fromTo(
          footerRef.current,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.48,
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 96%",
            },
          }
        );
      });
    }, sectionRef);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [loaderComplete]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const form = event.currentTarget;

    if (!name || !email || !message) {
      setSubmitState("error");
      return;
    }

    setSubmitState("sending");

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${SITE_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio message${name ? ` from ${name}` : ""}`,
          _captcha: "false",
          _template: "table",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      form.reset();
      setSubmitState("sent");
      window.setTimeout(() => setSubmitState("idle"), 2400);
    } catch {
      setSubmitState("error");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-section="contact"
      className="section section-dark relative min-h-screen lg:min-h-[230vh]"
    >
      <div
        ref={pinRef}
        className="section-content"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "140px",
          paddingBottom: "84px",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "10% 10% 8%",
            background:
              "radial-gradient(circle at 50% 24%, rgba(196, 185, 174, 0.16), transparent 0 28%), radial-gradient(circle at 72% 76%, rgba(249, 247, 244, 0.07), transparent 0 22%)",
            filter: "blur(42px)",
            opacity: 0.86,
            pointerEvents: "none",
          }}
        />

        <div
          className="relative w-full"
          style={{ minHeight: "min(74vh, 760px)" }}
        >
          <div
            ref={introWrapRef}
            className="relative lg:absolute lg:inset-0 flex items-center justify-center"
            style={{ pointerEvents: "none" }}
          >
            <div
              ref={introInnerRef}
              data-ripple-reactive
              className="flex flex-col items-center"
              style={{
                width: "min(1200px, 100%)",
                textAlign: "center",
                pointerEvents: "auto",
                willChange: "transform",
              }}
            >
              <h2
                ref={headingRef}
                data-ripple-text
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 300,
                  fontSize: "clamp(40px, 7vw, 96px)",
                  color: "var(--text-light)",
                  lineHeight: 1.1,
                  maxWidth: "none",
                  textShadow: "0 18px 44px rgba(0, 0, 0, 0.24)",
                  opacity: 0,
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  columnGap: "0.18em",
                  rowGap: "0.04em",
                }}
              >
                {HEADING_WORDS.map((word) => (
                  <span key={word} style={{ display: "inline-block" }}>
                    {word}
                  </span>
                ))}
              </h2>

              <p
                ref={subcopyRef}
                data-ripple-text
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: "16px",
                  color: "var(--text-secondary)",
                  marginTop: "18px",
                  maxWidth: "620px",
                  lineHeight: 1.8,
                  opacity: 0,
                }}
              >
                Currently open to full-time roles and select freelance projects.
              </p>

              <a
                ref={emailRef}
                href={`mailto:${SITE_EMAIL}`}
                data-ripple-text
                data-cursor="pointer"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: "20px",
                  color: "var(--text-secondary)",
                  marginTop: "34px",
                  textDecoration: "none",
                  backgroundImage: "none",
                  opacity: 0,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--text-light)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                {SITE_EMAIL}
              </a>

              <div
                ref={linksRef}
                className="flex items-center flex-wrap justify-center"
                style={{ gap: "36px", marginTop: "46px" }}
              >
                {CONTACT_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    data-cursor="pointer"
                    className="contact-link flex items-center gap-2"
                    style={{
                      color: "var(--text-secondary)",
                      transition:
                        "color 0.2s ease, transform 0.25s ease, gap 0.25s ease",
                      textDecoration: "none",
                      backgroundImage: "none",
                      backgroundSize: "0 0",
                      opacity: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--text-light)";
                      e.currentTarget.style.transform = "translateX(6px)";
                      e.currentTarget.style.gap = "14px";
                      const label = e.currentTarget.querySelector<HTMLElement>("[data-link-label]");
                      if (label) label.style.letterSpacing = "0.28em";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--text-secondary)";
                      e.currentTarget.style.transform = "translateX(0)";
                      e.currentTarget.style.gap = "8px";
                      const label = e.currentTarget.querySelector<HTMLElement>("[data-link-label]");
                      if (label) label.style.letterSpacing = "0.2em";
                    }}
                  >
                    <link.icon size={16} />
                    <span
                      data-ripple-text
                      data-link-label
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "11px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        transition: "letter-spacing 0.25s ease",
                      }}
                    >
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div
            ref={formWrapRef}
            data-ripple-reactive
            className="relative mt-20 lg:mt-0 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 w-full lg:w-[42%]"
            style={{
              opacity: 0,
              willChange: "transform",
              minHeight: "420px",
            }}
          >
            <form
              onSubmit={handleSubmit}
              className="flex flex-col h-full"
              style={{ gap: "26px", justifyContent: "space-between" }}
            >
              {[
                {
                  label: "Name",
                  name: "name",
                  type: "text",
                  autoComplete: "name",
                },
                {
                  label: "Email",
                  name: "email",
                  type: "email",
                  autoComplete: "email",
                },
              ].map((field, index) => (
                <div
                  key={field.name}
                  ref={(el) => {
                    fieldRefs.current[index] = el;
                  }}
                  data-ripple-reactive
                  style={{ opacity: 0 }}
                >
                  <label
                    htmlFor={field.name}
                    style={{
                      display: "block",
                      fontFamily: "var(--font-sans)",
                      fontSize: "10px",
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                      marginBottom: "12px",
                    }}
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: 0,
                      borderBottom: "1px solid rgba(196, 185, 174, 0.34)",
                      padding: "0 0 16px",
                      fontFamily: "var(--font-body)",
                      fontWeight: 300,
                      fontSize: "18px",
                      color: "var(--text-light)",
                      outline: "none",
                      transition: "border-color 0.25s ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderBottomColor =
                        "rgba(249, 247, 244, 0.86)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderBottomColor =
                        "rgba(196, 185, 174, 0.34)";
                    }}
                  />
                </div>
              ))}

              <div ref={messageRef} data-ripple-reactive style={{ opacity: 0 }}>
                <label
                  htmlFor="message"
                  style={{
                    display: "block",
                    fontFamily: "var(--font-sans)",
                    fontSize: "10px",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    marginBottom: "12px",
                  }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: 0,
                    borderBottom: "1px solid rgba(196, 185, 174, 0.34)",
                    padding: "0 0 18px",
                    fontFamily: "var(--font-body)",
                    fontWeight: 300,
                    fontSize: "18px",
                    lineHeight: 1.7,
                    color: "var(--text-light)",
                    outline: "none",
                    resize: "vertical",
                    minHeight: "140px",
                    transition: "border-color 0.25s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderBottomColor =
                      "rgba(249, 247, 244, 0.86)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderBottomColor =
                      "rgba(196, 185, 174, 0.34)";
                  }}
                />
              </div>

              <button
                ref={submitRef}
                type="submit"
                data-ripple-text
                data-cursor="pointer"
                disabled={submitState === "sending"}
                style={{
                  alignSelf: "flex-start",
                  background: "transparent",
                  border: 0,
                  padding: 0,
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: "13px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--text-light)",
                  opacity: 0,
                  transition:
                    "opacity 0.25s ease, letter-spacing 0.25s ease, color 0.25s ease",
                  cursor: submitState === "sending" ? "default" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (submitState === "sending") return;
                  e.currentTarget.style.opacity = "0.72";
                  e.currentTarget.style.letterSpacing = "0.28em";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.letterSpacing = "0.22em";
                }}
              >
                {submitState === "sending"
                  ? "Sending..."
                  : submitState === "sent"
                    ? "Message sent"
                    : submitState === "error"
                      ? "Try again"
                      : "Send message"}
              </button>
            </form>
          </div>
        </div>

        <div
          ref={footerRef}
          className="absolute bottom-0 left-0 right-0 flex flex-col sm:flex-row items-center justify-between"
          style={{
            padding: "24px 48px",
            gap: "12px",
            opacity: 0,
            transform: "translateY(18px)",
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
            © {COPYRIGHT_YEAR} Kanishk Srivastava
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

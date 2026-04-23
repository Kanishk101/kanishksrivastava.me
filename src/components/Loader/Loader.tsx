"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useLoader } from "@/contexts/LoaderContext";

export default function Loader() {
  const { setLoaderComplete } = useLoader();
  const loaderRef = useRef<HTMLDivElement>(null);
  const monogramRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    let skipFrame = 0;

    if (typeof window !== "undefined") {
      const alreadyShown = sessionStorage.getItem("loaderShown");
      if (alreadyShown) {
        skipFrame = window.requestAnimationFrame(() => {
          setVisible(false);
          setShouldRender(false);
          setLoaderComplete();
        });
        return;
      }
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Mark as shown for this session
          sessionStorage.setItem("loaderShown", "true");
          setShouldRender(false);
          setLoaderComplete();
        },
      });

      // 1. Monogram fades + slides up from 10px below
      tl.fromTo(
        monogramRef.current,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        }
      );

      // 2. Progress bar fills over 2000ms (linear)
      tl.fromTo(
        progressFillRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 2,
          ease: "none",
          onUpdate: function () {
            // Update percentage counter
            if (counterRef.current) {
              const progress = Math.round(this.progress() * 100);
              counterRef.current.textContent = String(progress);
            }
          },
        },
        "+=0.1" // slight pause after monogram
      );

      // 3. At 100%: 200ms pause
      tl.to({}, { duration: 0.2 });

      // 4. CURTAIN REVEAL: split into two halves
      tl.to(
        topCurtainRef.current,
        {
          yPercent: -100,
          duration: 0.7,
          ease: "expo.inOut",
        },
        "curtain"
      );

      tl.to(
        bottomCurtainRef.current,
        {
          yPercent: 100,
          duration: 0.7,
          ease: "expo.inOut",
        },
        "curtain"
      );

      // Fade out monogram and progress during curtain
      tl.to(
        [monogramRef.current, progressBarRef.current, counterRef.current],
        {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        },
        "curtain"
      );
    }, loaderRef);

    return () => {
      if (skipFrame) {
        window.cancelAnimationFrame(skipFrame);
      }
      ctx.revert();
    };
  }, [setLoaderComplete]);

  if (!shouldRender) return null;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9998] pointer-events-auto"
      style={{
        display: visible ? "block" : "none",
        backgroundColor: "rgb(12, 12, 11)",
      }}
    >
      {/* Top Curtain Half */}
      <div
        ref={topCurtainRef}
        className="absolute top-0 left-0 w-full"
        style={{
          height: "50vh",
          backgroundColor: "var(--bg-dark)",
          zIndex: 2,
        }}
      />

      {/* Bottom Curtain Half */}
      <div
        ref={bottomCurtainRef}
        className="absolute bottom-0 left-0 w-full"
        style={{
          height: "50.1vh", // slight overlap to prevent gap
          backgroundColor: "var(--bg-dark)",
          zIndex: 2,
        }}
      />

      {/* Center Content (sits between curtains) */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ zIndex: 3 }}
      >
        <div
          style={{
            width: "min(320px, calc(100vw - 56px))",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: "translate3d(0, -2.5vh, 0)",
          }}
        >
          {/* Monogram */}
          <div
            ref={monogramRef}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.24em",
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "clamp(72px, 8vw, 92px)",
              color: "var(--text-light)",
              lineHeight: 0.95,
              opacity: 0,
              textShadow: "0 0 18px rgba(249, 247, 244, 0.08)",
            }}
          >
            <span>K</span>
            <span>S</span>
          </div>

          {/* Progress Bar */}
          <div
            ref={progressBarRef}
            style={{
              width: "100%",
              height: "1px",
              backgroundColor: "rgba(249, 247, 244, 0.14)",
              marginTop: "40px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 0 24px rgba(196, 185, 174, 0.12)",
            }}
          >
            <div
              ref={progressFillRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "var(--accent)",
                transformOrigin: "left center",
                transform: "scaleX(0)",
                boxShadow: "0 0 24px rgba(196, 185, 174, 0.32)",
              }}
            />
          </div>

          {/* Percentage Counter */}
          <span
            ref={counterRef}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: "11px",
              letterSpacing: "0.34em",
              color: "rgba(249, 247, 244, 0.56)",
              marginTop: "18px",
              transform: "translateX(0.17em)",
            }}
          >
            0
          </span>
        </div>
      </div>

      {/* Grain overlay for loader */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 4,
          opacity: 0.04,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />
    </div>
  );
}

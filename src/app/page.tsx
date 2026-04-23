"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { initLenis, destroyLenis } from "@/lib/lenis";
import { useLoader } from "@/contexts/LoaderContext";

/* ─── Dynamic imports for client-only components ─── */
const Cursor = dynamic(() => import("@/components/Cursor/Cursor"), {
  ssr: false,
});
const Nav = dynamic(() => import("@/components/Nav/Nav"), {
  ssr: false,
});
const Loader = dynamic(() => import("@/components/Loader/Loader"), {
  ssr: false,
});

/* ─── Hero is above-the-fold — static import for priority ─── */
import Hero from "@/components/sections/Hero";

/* ─── Below-fold sections — lazy loaded ─── */
const About = dynamic(() => import("@/components/sections/About"));
const Quote = dynamic(() => import("@/components/sections/Quote"));
const Work = dynamic(() => import("@/components/sections/Work"));
const Stack = dynamic(() => import("@/components/sections/Stack"));
const Experience = dynamic(() => import("@/components/sections/Experience"));
const Contact = dynamic(() => import("@/components/sections/Contact"));

export default function Home() {
  const { loaderComplete } = useLoader();

  useEffect(() => {
    // Initialize smooth scroll (desktop only) after loader completes
    if (!loaderComplete) return;

    const isMobile =
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 768;

    if (!isMobile) {
      initLenis();
    }

    return () => {
      destroyLenis();
    };
  }, [loaderComplete]);

  return (
    <>
      <Loader />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <About />
        <Quote />
        <Work />
        <Stack />
        <Experience />
        <Contact />
      </main>
    </>
  );
}

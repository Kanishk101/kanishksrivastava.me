"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { initLenis, destroyLenis } from "@/lib/lenis";
import { useLoader } from "@/contexts/LoaderContext";
import Nav from "@/components/Nav/Nav";
import Loader from "@/components/Loader/Loader";
import About from "@/components/sections/About";
import Quote from "@/components/sections/Quote";
import Work from "@/components/sections/Work";
import Stack from "@/components/sections/Stack";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";

/* ─── Dynamic imports for client-only components ─── */
const Cursor = dynamic(() => import("@/components/Cursor/Cursor"), {
  ssr: false,
});

/* ─── Hero is above-the-fold — static import for priority ─── */
import Hero from "@/components/sections/Hero";

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

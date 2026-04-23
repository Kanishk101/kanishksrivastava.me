"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { initLenis, destroyLenis } from "@/lib/lenis";

/* ─── Dynamic imports for client-only components ─── */
const Cursor = dynamic(() => import("@/components/Cursor/Cursor"), {
  ssr: false,
});
const Nav = dynamic(() => import("@/components/Nav/Nav"), {
  ssr: false,
});

/* ─── Section imports ─── */
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Quote from "@/components/sections/Quote";
import Work from "@/components/sections/Work";
import Stack from "@/components/sections/Stack";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";

export default function Home() {
  useEffect(() => {
    // Initialize smooth scroll (desktop only)
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (!isMobile) {
      initLenis();
    }

    return () => {
      destroyLenis();
    };
  }, []);

  return (
    <>
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

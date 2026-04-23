"use client";

import { ReactNode } from "react";
import { LoaderProvider } from "@/contexts/LoaderContext";
import { CursorProvider } from "@/contexts/CursorContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LoaderProvider>
      <CursorProvider>{children}</CursorProvider>
    </LoaderProvider>
  );
}

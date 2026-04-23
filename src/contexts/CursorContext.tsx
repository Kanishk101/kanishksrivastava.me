"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type CursorState =
  | "DEFAULT"
  | "HOVER_LINK"
  | "HOVER_PROJECT"
  | "HOVER_MAGNETIC"
  | "JITTER";

interface CursorContextType {
  cursorState: CursorState;
  setCursorState: (state: CursorState) => void;
}

const CursorContext = createContext<CursorContextType>({
  cursorState: "DEFAULT",
  setCursorState: () => {},
});

export function CursorProvider({ children }: { children: ReactNode }) {
  const [cursorState, setState] = useState<CursorState>("DEFAULT");

  const setCursorState = useCallback((state: CursorState) => {
    setState(state);
  }, []);

  return (
    <CursorContext.Provider value={{ cursorState, setCursorState }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  return useContext(CursorContext);
}

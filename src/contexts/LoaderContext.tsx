"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface LoaderContextType {
  loaderComplete: boolean;
  setLoaderComplete: () => void;
}

const LoaderContext = createContext<LoaderContextType>({
  loaderComplete: false,
  setLoaderComplete: () => {},
});

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [loaderComplete, setComplete] = useState(false);

  const setLoaderComplete = useCallback(() => {
    setComplete(true);
  }, []);

  return (
    <LoaderContext.Provider value={{ loaderComplete, setLoaderComplete }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  return useContext(LoaderContext);
}

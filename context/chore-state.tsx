"use client";

import { createContext, useContext } from "react";
import type { ChoreWithQueue } from "@/types/types";

interface ChoreStateContextValue {
  choreMap: Record<string, ChoreWithQueue>;
}

const ChoreStateContext = createContext<ChoreStateContextValue | null>(null);

export const useChoreState = () => {
  const context = useContext(ChoreStateContext);
  if (!context) {
    throw new Error("useChoreState must be used within a ChoreStateProvider");
  }
  return context;
};

// context provider
export function ChoreStateProvider({
  children,
  choreMap
}: {
  children: React.ReactNode;
  choreMap: Record<string, ChoreWithQueue>;
}) {
  return (
    <ChoreStateContext.Provider value={{ choreMap }}>
      {children}
    </ChoreStateContext.Provider>
  );
}

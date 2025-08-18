"use client";

import { ChoreWithQueue } from "@/types/types";
import { createContext, useContext } from "react";

interface ChoreStateContextValue {
  choreMap: Record<string, ChoreWithQueue>;
}

const ChoreStateContext = createContext<ChoreStateContextValue | null>(null);

// hook to use app state context
export const useChoreState = () => {
  const context = useContext(ChoreStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
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

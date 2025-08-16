"use client";

import { getChores } from "@/api/db";
import { ChoreWithQueue } from "@/lib/types";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface AppStateContextValue {
  choreMap: Record<string, ChoreWithQueue> | null;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

// hook to use app state context
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};

// context provider
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [choreMap, setChoreMap] = useState<Record<
    string,
    ChoreWithQueue
  > | null>(null);
  const fetched = useRef(false);

  // fetch chores on mount
  useEffect(() => {
    if (fetched.current) return; // prevent multiple fetches
    fetched.current = true;

    const fetchChores = async () => {
      try {
        const chores = (await getChores()) as unknown as ChoreWithQueue[];
        const map: Record<string, ChoreWithQueue> = {};
        chores.forEach((chore) => {
          map[chore.id] = chore;
        });
        setChoreMap(map);
      } catch (error) {
        console.error("Failed to fetch chores:", error);
      }
    };

    fetchChores();
  }, []);

  return (
    <AppStateContext.Provider value={{ choreMap }}>
      {children}
    </AppStateContext.Provider>
  );
}

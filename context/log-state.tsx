"use client";

import { createContext, useContext } from "react";
import type { ChoreWithLogs } from "@/types/types";

type LogMapType = Record<string, ChoreWithLogs>;

interface LogStateContextValue {
  logMap: LogMapType;
}

const LogStateContext = createContext<LogStateContextValue | null>(null);

export const useLogState = () => {
  const context = useContext(LogStateContext);
  if (!context) {
    throw new Error("useLogState must be used within a LogStateProvider");
  }
  return context;
};

export function LogStateProvider({
  children,
  logMap
}: {
  children: React.ReactNode;
  logMap: LogMapType;
}) {
  return (
    <LogStateContext.Provider value={{ logMap }}>
      {children}
    </LogStateContext.Provider>
  );
}

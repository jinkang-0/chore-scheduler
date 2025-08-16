"use client";

import { createContext, useContext, useState } from "react";

interface HomeDialogContextValue {
  modalNaturallyOpened: boolean;
  setModalNaturallyOpened: (value: boolean) => void;
}

const HomeDialogContext = createContext<HomeDialogContextValue | null>(null);

export const useHomeDialog = () => {
  const context = useContext(HomeDialogContext);
  if (!context) {
    throw new Error("useHomeDialog must be used within a HomeDialogProvider");
  }
  return context;
};

export function HomeDialogProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [modalNaturallyOpened, setModalNaturallyOpened] = useState(false);

  return (
    <HomeDialogContext.Provider
      value={{ modalNaturallyOpened, setModalNaturallyOpened }}
    >
      {children}
    </HomeDialogContext.Provider>
  );
}

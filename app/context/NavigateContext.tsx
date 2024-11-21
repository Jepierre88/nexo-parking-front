"use client";
import { useRouter } from "next/navigation";
import { useContext, createContext, ReactNode } from "react";

const NavigateContext = createContext<any | undefined>(undefined);

export const UseNavigateContext = () => {
  const context = useContext(NavigateContext);

  if (!context) throw new Error("Context was not provided");

  return context;
};

export const NavigateProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  return (
    <NavigateContext.Provider value={{ router }}>
      {children}
    </NavigateContext.Provider>
  );
};

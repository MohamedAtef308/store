"use client";

import ThemeProvider from "./theme-provider";
import { Toaster } from "@/components/ui/toaster";
type ProviderProps = {
  children: React.ReactNode;
};

function Providers({ children }: ProviderProps) {
  return (
    <>
      <Toaster />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </>
  );
}

export default Providers;

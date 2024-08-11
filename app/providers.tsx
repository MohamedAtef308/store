"use client";

import ThemeProvider from "./theme-provider";
type ProviderProps = {
  children: React.ReactNode;
};

function Providers({ children }: ProviderProps) {
  return <>
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
  {children}
  </ThemeProvider>
  </>;
}

export default Providers;

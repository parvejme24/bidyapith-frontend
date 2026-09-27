"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Suspense, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/lib/app-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div className="min-h-screen bg-night-900" />}>
          <AppProvider>
            {children}
            <Toaster position="bottom-right" richColors />
          </AppProvider>
        </Suspense>
      </QueryClientProvider>
    </ThemeProvider>
  );
}


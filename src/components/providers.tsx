"use client";

import { environmentManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false } },
  });
}

let browserQueryClient: QueryClient | undefined;

// A fresh client per prerender, one shared client in the browser so the cache
// survives client-side navigation (TanStack Query advanced-SSR guide).
function getQueryClient() {
  if (environmentManager.isServer()) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>;
}

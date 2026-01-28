"use client";

import { createContext, useContext, ReactNode } from "react";

// Use a generic type for SupabaseClient to avoid version mismatches
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = any;

interface LaborarioUIConfig {
  /** Base URL for Laborario (e.g., "https://laborario.com") */
  baseUrl: string;
  /** Base path for assets in the current app (e.g., "/soporte" or "") */
  assetBasePath?: string;
  /** Function to create Supabase client */
  createSupabaseClient: () => AnySupabaseClient;
  /** Current app identifier - used to determine active nav link */
  currentApp?: "laborario" | "soporte";
  /** Custom link component for internal navigation (e.g., Next.js Link) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LinkComponent?: React.ComponentType<{ href: string; className?: string; children: any }>;
}

const LaborarioUIContext = createContext<LaborarioUIConfig | null>(null);

export function LaborarioUIProvider({
  children,
  config,
}: {
  children: ReactNode;
  config: LaborarioUIConfig;
}) {
  return <LaborarioUIContext.Provider value={config}>{children}</LaborarioUIContext.Provider>;
}

export function useLaborarioUI(): LaborarioUIConfig {
  const context = useContext(LaborarioUIContext);
  if (!context) {
    throw new Error("useLaborarioUI must be used within a LaborarioUIProvider");
  }
  return context;
}

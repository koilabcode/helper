"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { LaborarioUIProvider } from "./context";
import { createClient } from "@/lib/supabase/client";

const LABORARIO_BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://laborario.com";

// Wrapper for Next.js Link component
function NextLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function LaborarioProvider({ children }: { children: ReactNode }) {
  return (
    <LaborarioUIProvider
      config={{
        baseUrl: LABORARIO_BASE_URL,
        assetBasePath: "/soporte",
        createSupabaseClient: createClient,
        currentApp: "soporte",
        LinkComponent: NextLink,
      }}
    >
      {children}
    </LaborarioUIProvider>
  );
}

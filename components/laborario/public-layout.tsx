"use client";

import { PublicHeader } from "./public-header";
import { PublicFooter } from "./public-footer";
import { LaborarioProvider } from "./provider";

interface PublicLayoutProps {
  children: React.ReactNode;
  headerVariant?: "full" | "minimal";
  footerVariant?: "full" | "minimal";
}

export function PublicLayout({ children, headerVariant = "full", footerVariant = "full" }: PublicLayoutProps) {
  return (
    <LaborarioProvider>
      <div className="min-h-screen bg-[#181824] flex flex-col">
        <PublicHeader variant={headerVariant} />
        <main className="flex-1">{children}</main>
        <PublicFooter variant={footerVariant} />
      </div>
    </LaborarioProvider>
  );
}

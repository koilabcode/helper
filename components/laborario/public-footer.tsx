"use client";

import { useLaborarioUI } from "./context";

interface PublicFooterProps {
  variant?: "full" | "minimal";
}

export function PublicFooter({ variant = "full" }: PublicFooterProps) {
  const { baseUrl } = useLaborarioUI();

  const navLinks = [
    { href: `${baseUrl}/producto`, label: "Producto" },
    { href: `${baseUrl}/precios`, label: "Precios" },
    { href: `${baseUrl}/articulos/que-exige-la-ley`, label: "¿Qué exige la ley?" },
  ];

  const legalLinks = [
    { href: `${baseUrl}/terminos`, label: "Términos y Condiciones" },
    { href: `${baseUrl}/privacidad`, label: "Política de Privacidad" },
  ];

  if (variant === "minimal") {
    return (
      <footer className="px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-700/50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-gray-600 text-sm">Conforme al RD-ley 8/2019</span>
          <div className="flex items-center gap-6 text-sm">
            {legalLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-gray-500 hover:text-gray-300 transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="px-4 sm:px-6 lg:px-8 py-10 border-t border-gray-700/50">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6">
          <div className="flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-gray-400 hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-700/50">
          <div className="flex items-center gap-6 text-sm">
            {legalLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-gray-500 hover:text-gray-300 transition-colors">
                {link.label}
              </a>
            ))}
          </div>
          <span className="text-gray-600 text-sm">Conforme al RD-ley 8/2019</span>
        </div>
      </div>
    </footer>
  );
}

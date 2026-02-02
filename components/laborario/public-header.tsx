"use client";

import { useState, useEffect, ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { useLaborarioUI } from "./context";
import { DashboardIcon, PaymentsIcon, GavelIcon, HelpIcon } from "./nav-icons";

// Cache auth state globally so it persists across navigations
let cachedAuthState: {
  checked: boolean;
  user: User | null;
  userName: string | null;
  companyName: string | null;
} = {
  checked: false,
  user: null,
  userName: null,
  companyName: null,
};

interface PublicHeaderProps {
  variant?: "full" | "minimal";
  withBorder?: boolean;
}

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="6" y1="18" x2="18" y2="6" />
    </svg>
  );
}

type NavLink = {
  href: string;
  label: string;
  icon: React.FC<{ className?: string; size?: number }>;
  appId: "producto" | "precios" | "ley" | "soporte";
};

export function PublicHeader({ variant = "full", withBorder = false }: PublicHeaderProps) {
  const { baseUrl, assetBasePath = "", createSupabaseClient, currentApp, LinkComponent } = useLaborarioUI();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Initialize from cache if available
  const [user, setUser] = useState<User | null>(cachedAuthState.user);
  const [userName, setUserName] = useState<string | null>(cachedAuthState.userName);
  const [companyName, setCompanyName] = useState<string | null>(cachedAuthState.companyName);
  const [authLoading, setAuthLoading] = useState(!cachedAuthState.checked);

  // Check auth state
  useEffect(() => {
    const supabase = createSupabaseClient();

    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        cachedAuthState.user = currentUser;

        if (session?.user) {
          // Try employees first
          const { data: employeeData } = await supabase
            .from("employees")
            .select("full_name, companies(name)")
            .eq("user_id", session.user.id)
            .eq("is_active", true)
            .maybeSingle();

          if (employeeData) {
            setUserName(employeeData.full_name);
            setCompanyName((employeeData.companies as { name?: string })?.name || null);
            cachedAuthState.userName = employeeData.full_name;
            cachedAuthState.companyName = (employeeData.companies as { name?: string })?.name || null;
          } else {
            // Try accesses table
            const { data: accessData } = await supabase
              .from("accesses")
              .select("full_name, companies(name)")
              .eq("user_id", session.user.id)
              .maybeSingle();

            if (accessData) {
              setUserName(accessData.full_name);
              setCompanyName((accessData.companies as { name?: string })?.name || null);
              cachedAuthState.userName = accessData.full_name;
              cachedAuthState.companyName = (accessData.companies as { name?: string })?.name || null;
            }
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        cachedAuthState.checked = true;
        setAuthLoading(false);
      }
    }

    // Always check auth on mount — the cache is only for initial render to avoid flicker.
    // The iframe can't receive auth state changes from the parent page, so we must re-check.
    checkAuth();

    // Always listen for auth changes (login/logout from other tabs, etc.)
    const {
      data: { subscription },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      cachedAuthState.user = currentUser;
      if (!session?.user) {
        setUserName(null);
        setCompanyName(null);
        cachedAuthState.userName = null;
        cachedAuthState.companyName = null;
      }
    });

    return () => subscription.unsubscribe();
  }, [createSupabaseClient]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks: NavLink[] = [
    { href: `${baseUrl}/producto`, label: "Producto", icon: DashboardIcon, appId: "producto" },
    { href: `${baseUrl}/precios`, label: "Precios", icon: PaymentsIcon, appId: "precios" },
    { href: `${baseUrl}/articulos/que-exige-la-ley`, label: "¿Qué exige la ley?", icon: GavelIcon, appId: "ley" },
    { href: currentApp === "soporte" ? "/" : `${baseUrl}/soporte`, label: "Soporte", icon: HelpIcon, appId: "soporte" },
  ];

  async function handleLogout() {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    // Reset cached state
    cachedAuthState = {
      checked: false,
      user: null,
      userName: null,
      companyName: null,
    };
    window.top!.location.href = baseUrl;
  }

  const isActive = (link: NavLink) => {
    if (currentApp === "soporte" && link.appId === "soporte") return true;
    if (currentApp === "laborario") {
      // For Laborario main app, check pathname
      if (typeof window !== "undefined") {
        const pathname = window.location.pathname;
        if (link.appId === "producto" && pathname.startsWith("/producto")) return true;
        if (link.appId === "precios" && pathname.startsWith("/precios")) return true;
        if (link.appId === "ley" && pathname.startsWith("/articulos/que-exige-la-ley")) return true;
        if (link.appId === "soporte" && pathname.startsWith("/soporte")) return true;
      }
    }
    return false;
  };

  const renderLink = (
    href: string,
    className: string,
    children: ReactNode,
    isInternal: boolean = false,
    key?: string
  ) => {
    // Use LinkComponent for internal navigation if provided
    if (isInternal && LinkComponent) {
      return (
        <LinkComponent key={key} href={href} className={className}>
          {children}
        </LinkComponent>
      );
    }
    return (
      <a key={key} href={href} className={className} target="_top">
        {children}
      </a>
    );
  };

  const renderNavLink = (link: NavLink, isMobile: boolean = false) => {
    const IconComponent = link.icon;
    const active = isActive(link);
    const isInternal = currentApp === "soporte" && link.appId === "soporte";

    const className = isMobile
      ? `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
          active ? "bg-[#a3b18a]/10 text-[#a3b18a]" : "text-gray-300 hover:bg-[#252536] hover:text-white"
        }`
      : `relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          active ? "bg-[#252536] text-[#a3b18a] shadow-sm" : "text-gray-400 hover:text-white hover:bg-[#252536]/50"
        }`;

    return renderLink(
      link.href,
      className,
      <>
        <IconComponent />
        {isMobile ? link.label : <span>{link.label}</span>}
      </>,
      isInternal,
      link.href
    );
  };

  const logoSrc = `${assetBasePath}/icons/laborario-logo.svg`;

  const Logo = () => (
    <img src={logoSrc} alt="laborario" className="h-7 w-auto opacity-80 select-none" />
  );

  return (
    <>
      <header className={`relative px-4 sm:px-6 lg:px-8 py-5 ${withBorder ? "border-b border-gray-700/50" : ""}`}>
        <div className="flex items-center justify-between lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-4">
          {/* Logo */}
          <a href={baseUrl} target="_top">
            <Logo />
          </a>

          {variant === "full" ? (
            <>
              {/* Desktop navigation - centered */}
              <nav className="hidden lg:flex items-center justify-center">
                <div className="flex items-center bg-[#1e1e2e] rounded-full px-1.5 py-1.5 border border-gray-700/50">
                  {navLinks.map((link) => renderNavLink(link))}
                </div>
              </nav>

              {/* CTA + Mobile hamburger */}
              <div className="flex items-center gap-3">
                {/* Auth buttons - fixed width container to prevent layout shift */}
                <div className="hidden sm:block min-w-[320px]">
                  <div
                    className={`flex items-center gap-3 justify-end transition-opacity duration-150 ${authLoading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                  >
                    {user ? (
                      <>
                        <a
                          href={`${baseUrl}/company-admin`}
                          target="_top"
                          className="flex flex-col items-end text-xs text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          {companyName && <span>{companyName}</span>}
                          <span>{userName || user.email}</span>
                        </a>
                        <button
                          onClick={handleLogout}
                          className="flex items-center px-5 py-2.5 rounded-full border border-gray-600 text-gray-400 text-sm font-medium hover:bg-gray-700/50 hover:text-white transition-all whitespace-nowrap"
                        >
                          Cerrar sesión
                        </button>
                      </>
                    ) : (
                      <>
                        <a
                          href={`${baseUrl}/company-admin/login`}
                          target="_top"
                          className="flex items-center px-5 py-2.5 rounded-full border border-[#a3b18a] text-[#a3b18a] text-sm font-medium hover:bg-[#a3b18a]/10 transition-all whitespace-nowrap"
                        >
                          Iniciar sesión
                        </a>
                        <a
                          href={`${baseUrl}/oferta-lanzamiento`}
                          target="_top"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#a3b18a] text-[#181824] text-sm font-semibold hover:bg-[#b4c29b] transition-all whitespace-nowrap"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                          </svg>
                          Oferta Lanzamiento
                        </a>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                  aria-label="Abrir menú"
                >
                  <HamburgerIcon />
                </button>
              </div>
            </>
          ) : (
            <a href={baseUrl} target="_top" className="text-gray-400 hover:text-white transition-colors text-sm">
              Volver al inicio
            </a>
          )}
        </div>
      </header>

      {/* Mobile menu overlay */}
      {variant === "full" && mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />

          <div className="absolute right-0 top-0 h-full w-72 bg-[#1e1e2e] shadow-xl">
            <div className="flex items-center justify-between px-4 py-5 border-b border-gray-700/50">
              <a href={baseUrl} target="_top">
                <Logo />
              </a>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Cerrar menú"
              >
                <CloseIcon />
              </button>
            </div>

            <nav className="p-4 space-y-1">
              {navLinks.map((link) => renderNavLink(link, true))}

              {!authLoading && (
                <div className="pt-4 mt-4 border-t border-gray-700/50 space-y-2">
                  {user ? (
                    <>
                      <a
                        href={`${baseUrl}/company-admin`}
                        target="_top"
                        className="px-4 py-3 flex flex-col text-xs text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {companyName && <span>{companyName}</span>}
                        <span>{userName || user.email}</span>
                      </a>
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center w-full px-4 py-3 rounded-lg border border-gray-600 text-gray-400 text-sm font-medium hover:bg-gray-700/50 hover:text-white transition-all"
                      >
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <a
                        href={`${baseUrl}/company-admin/login`}
                        target="_top"
                        className="flex items-center justify-center w-full px-4 py-3 rounded-lg border border-[#a3b18a] text-[#a3b18a] text-sm font-medium hover:bg-[#a3b18a]/10 transition-all"
                      >
                        Iniciar sesión
                      </a>
                      <a
                        href={`${baseUrl}/oferta-lanzamiento`}
                        target="_top"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-[#a3b18a] text-[#181824] text-sm font-semibold hover:bg-[#b4c29b] transition-all"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        Oferta Lanzamiento
                      </a>
                    </>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

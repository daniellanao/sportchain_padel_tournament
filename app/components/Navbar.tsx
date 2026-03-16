"use client";

import Link from "next/link";

type NavbarProps = {
  /** Slug del torneo actual (desde env / BD). Se muestra en la navbar. */
  tournamentSlug?: string;
};

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/torneos", label: "Torneos" },
  { href: "/ranking", label: "Ranking" },
] as const;

export default function Navbar({ tournamentSlug }: NavbarProps) {
  return (
    <nav
      className="sticky top-0 z-50 border-b border-foreground/10 bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80"
      aria-label="Navegación principal"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo / Torneo */}
        <Link
          href="/"
          className="logo flex items-center gap-2 text-lg text-primary transition-colors hover:text-accent-gold"
        >
          Sportchain
          {tournamentSlug && (
            <span className="rounded bg-muted px-2 py-0.5 text-sm font-medium text-foreground">
              {tournamentSlug}
            </span>
          )}
        </Link>

        {/* Enlaces — páginas por crear: /, /torneos, /ranking */}
        <ul className="flex items-center gap-1" role="menubar">
          {navItems.map(({ href, label }) => (
            <li key={href} role="none">
              <Link
                href={href}
                className="navbar-text rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted hover:text-accent-gold"
                role="menuitem"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

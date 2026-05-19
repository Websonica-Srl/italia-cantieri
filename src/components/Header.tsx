'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ArrowRight, HardHat } from 'lucide-react';

const navItems = [
  { label: 'Cantieri per regione', href: '/regioni' },
  { label: 'Bandi pubblici', href: '/bandi' },
  { label: 'Statistiche', href: '/statistiche' },
  { label: 'Chi siamo', href: '/chi-siamo' },
  { label: 'Trasparenza dati', href: '/come-trattiamo-i-dati' },
];

const HUB_REGISTER =
  'https://www.italiaprogettisti.com/register?utm_source=italiacantieri&utm_medium=header&utm_campaign=iscriviti_gratis';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-md border-b border-border/50 supports-[backdrop-filter]:bg-background/70">
      <div className="container-zen">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Italia Cantieri — homepage"
          >
            <span
              aria-hidden="true"
              className="inline-flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-2xl bg-foreground text-background"
            >
              <HardHat className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2} />
            </span>
            <h1 className="text-xl md:text-2xl font-black tracking-tighter text-foreground leading-none">
              Italia<span className="text-foreground/55">Cantieri</span>
            </h1>
          </Link>

          {/* Navigation Desktop */}
          <nav
            className="hidden md:flex items-center space-x-7 lg:space-x-8"
            aria-label="Navigazione principale"
          >
            {navItems.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium text-sm relative after:absolute after:left-0 after:right-0 after:bottom-[-6px] after:h-[2px] after:bg-foreground after:scale-x-0 after:origin-left after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              >
                {i.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center space-x-3">
            <a
              href={HUB_REGISTER}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex btn-primary group hover:scale-[1.02] hover:shadow-md transition-all duration-200"
              aria-label="Iscriviti gratis al network ItaliaProgettisti"
            >
              Iscriviti gratis
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </a>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-2xl hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={open ? 'Chiudi menu' : 'Apri menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? (
                <X className="h-6 w-6" strokeWidth={1.5} />
              ) : (
                <Menu className="h-6 w-6" strokeWidth={1.5} />
              )}
              <span className="sr-only">Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - CTA in testa per priorità conversione */}
      {open && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-border bg-background animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <nav
            className="container-zen py-4 flex flex-col gap-1"
            aria-label="Navigazione mobile"
          >
            {/* CTA primaria SPOSTATA IN TESTA (R10) */}
            <a
              href={HUB_REGISTER}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="btn-primary w-full justify-center mb-2"
            >
              Iscriviti gratis
              <ArrowRight className="ml-1.5 h-4 w-4" strokeWidth={2} />
            </a>
            <div className="h-px bg-border my-2" />
            {navItems.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-3 min-h-[44px] text-foreground hover:bg-accent rounded-md transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {i.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

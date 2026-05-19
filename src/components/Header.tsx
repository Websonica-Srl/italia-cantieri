'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Cantieri per regione', href: '/regioni' },
  { label: 'Bandi pubblici', href: '/bandi' },
  { label: 'Statistiche', href: '/statistiche' },
  { label: 'Chi siamo', href: '/chi-siamo' },
  { label: 'Trasparenza dati', href: '/come-trattiamo-i-dati' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container-zen">
        <div className="flex items-center justify-between py-4">
          {/* Logo - stesso pattern HUB: testuale, font-black tracking-tighter */}
          <Link href="/" className="flex items-center">
            <h1 className="text-3xl font-black tracking-tighter text-foreground leading-none">
              ItaliaCantieri
            </h1>
          </Link>

          {/* Navigation Desktop */}
          <nav
            className="hidden md:flex items-center space-x-8"
            aria-label="Navigazione principale"
          >
            {navItems.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className="text-foreground hover:text-secondary-text transition-colors font-medium"
              >
                {i.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center space-x-3">
            <a
              href="https://www.italiaprogettisti.com/register"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex btn-primary"
            >
              Iscriviti gratis
            </a>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-2xl hover:bg-secondary transition-colors"
              aria-label="Menu"
              aria-expanded={open}
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

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav
            className="container-zen py-4 flex flex-col gap-1"
            aria-label="Navigazione mobile"
          >
            {navItems.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-3 min-h-[44px] text-foreground hover:bg-accent rounded-md transition-colors font-medium"
              >
                {i.label}
              </Link>
            ))}
            <div className="h-px bg-border my-3" />
            <a
              href="https://www.italiaprogettisti.com/register"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="btn-primary w-full justify-center"
            >
              Iscriviti gratis
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

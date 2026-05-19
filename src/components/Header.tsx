'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Building2 } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Regioni', href: '/regioni' },
  { label: 'Bandi', href: '/bandi' },
  { label: 'Statistiche', href: '/statistiche' },
  { label: 'Trasparenza dati', href: '/come-trattiamo-i-dati' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-border">
      <div className="container-zen flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <Building2 className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-extrabold tracking-tight">Italia Cantieri</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">database pubblico</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Navigazione principale">
          {navItems.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {i.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://www.italiaprogettisti.com/abbonamenti"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Sblocca Premium
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-xl hover:bg-secondary"
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-white">
          <nav className="container-zen py-4 flex flex-col gap-1" aria-label="Navigazione mobile">
            {navItems.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium border-b border-border/50 last:border-0"
              >
                {i.label}
              </Link>
            ))}
            <a
              href="https://www.italiaprogettisti.com/abbonamenti"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex self-start items-center justify-center rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium"
            >
              Sblocca Premium
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

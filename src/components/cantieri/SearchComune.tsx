'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { slugify } from '@/lib/utils';

interface ComuneResult {
  comune: string;
  provincia: string;
  regione: string;
}

interface Props {
  placeholder?: string;
  variant?: 'hero' | 'inline';
}

export default function SearchComune({
  placeholder = 'Cerca un comune (es. Milano, Torino, Bologna...)',
  variant = 'hero',
}: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ComuneResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/comuni/autocomplete?q=${encodeURIComponent(query)}`);
        const json = await r.json();
        setResults(json.results || []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', click);
    return () => document.removeEventListener('mousedown', click);
  }, []);

  const go = (c: ComuneResult) => {
    setOpen(false);
    setQuery('');
    router.push(`/comune/${slugify(c.comune)}`);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!open || !results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusIdx >= 0) go(results[focusIdx]);
      else if (results[0]) go(results[0]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const sizeCls = variant === 'hero' ? 'h-16 text-lg pl-14 pr-14 py-4' : 'h-12 text-base pl-12 pr-12 py-3';
  const iconLeftCls = variant === 'hero' ? 'left-5 h-5 w-5' : 'left-4 h-4 w-4';
  const iconRightCls = variant === 'hero' ? 'right-5 h-5 w-5' : 'right-4 h-4 w-4';

  return (
    <div ref={ref} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground ${iconLeftCls}`} strokeWidth={1.5} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKey}
          onFocus={() => results.length && setOpen(true)}
          placeholder={placeholder}
          className={`search-zen ${sizeCls} shadow-sm placeholder:text-muted-foreground/70`}
          aria-label="Cerca cantieri per comune"
          autoComplete="off"
        />
        {loading && (
          <Loader2 className={`absolute top-1/2 -translate-y-1/2 animate-spin text-muted-foreground ${iconRightCls}`} />
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-popover rounded-3xl border border-border shadow-xl overflow-hidden max-h-96 overflow-y-auto">
          {results.map((r, i) => (
            <button
              key={`${r.comune}-${r.provincia}-${i}`}
              onClick={() => go(r)}
              onMouseEnter={() => setFocusIdx(i)}
              className={`w-full px-5 py-3 flex items-center gap-3 text-left transition-colors ${
                i === focusIdx ? 'bg-secondary' : 'hover:bg-secondary/60'
              }`}
            >
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground">{r.comune}</div>
                <div className="text-xs text-muted-foreground">
                  {r.provincia} · {r.regione}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {open && !loading && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-popover rounded-3xl border border-border shadow-xl p-5 text-sm text-muted-foreground">
          Nessun comune trovato per &ldquo;{query}&rdquo;. Prova con un nome diverso.
        </div>
      )}
    </div>
  );
}

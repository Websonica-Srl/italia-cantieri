'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SlidersHorizontal, X, Search, ChevronDown } from 'lucide-react';
import {
  INTERVENTI,
  INTERVENTO_META,
  DESTINAZIONE_META,
  SCALA_META,
  MESTIERI,
  MESTIERE_LABELS,
} from '@websonica/cantieri-core';

/**
 * Filtri /esplora — naviga a /esplora con querystring.
 * /esplora è sempre noindex,follow (tool di ricerca, gestito lato page con
 * generateMetadata): nessuna combinazione di filtri va indicizzata, il valore
 * SEO indicizzabile vive nei silo geo/mestiere/intervento.
 */
export default function FiltriEsplora() {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [avanzatiOpen, setAvanzatiOpen] = useState(false);

  const [q, setQ] = useState('');
  const [regione, setRegione] = useState('');
  const [provincia, setProvincia] = useState('');
  const [comune, setComune] = useState('');
  const [intervento, setIntervento] = useState('');
  const [destinazione, setDestinazione] = useState('');
  const [scala, setScala] = useState('');
  const [mestiere, setMestiere] = useState('');
  const [valoreMin, setValoreMin] = useState('');

  // sync stato dai searchParams (per deep-link)
  useEffect(() => {
    setQ(params.get('q') || '');
    setRegione(params.get('regione') || '');
    setProvincia(params.get('provincia') || '');
    setComune(params.get('comune') || '');
    setIntervento(params.get('intervento') || '');
    setDestinazione(params.get('destinazione') || '');
    setScala(params.get('scala') || '');
    setMestiere(params.get('mestiere') || '');
    setValoreMin(params.get('valore_min') || '');
    if (params.get('destinazione') || params.get('scala') || params.get('mestiere') || params.get('valore_min')) {
      setAvanzatiOpen(true);
    }
  }, [params]);

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (q.trim()) qs.set('q', q.trim());
    if (regione.trim()) qs.set('regione', regione.trim());
    if (provincia.trim()) qs.set('provincia', provincia.trim());
    if (comune.trim()) qs.set('comune', comune.trim());
    if (intervento) qs.set('intervento', intervento);
    if (destinazione) qs.set('destinazione', destinazione);
    if (scala) qs.set('scala', scala);
    if (mestiere) qs.set('mestiere', mestiere);
    if (valoreMin) qs.set('valore_min', valoreMin);
    const s = qs.toString();
    router.push(s ? `/esplora?${s}` : '/esplora');
  }

  function reset() {
    setQ('');
    setRegione('');
    setProvincia('');
    setComune('');
    setIntervento('');
    setDestinazione('');
    setScala('');
    setMestiere('');
    setValoreMin('');
    router.push('/esplora');
  }

  const hasFilters =
    !!q || !!regione || !!provincia || !!comune || !!intervento || !!destinazione || !!scala || !!mestiere || !!valoreMin;

  return (
    <div className="rounded-3xl border border-border bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="md:hidden flex w-full items-center justify-between gap-2 px-5 py-4 text-sm font-semibold text-foreground"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" strokeWidth={2} /> Filtra i cantieri
          {hasFilters && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 text-[10px] font-bold text-background">
              attivi
            </span>
          )}
        </span>
        <span className="text-muted-foreground">{open ? '−' : '+'}</span>
      </button>

      <form
        onSubmit={apply}
        className={`${open ? 'block' : 'hidden'} md:block px-5 pb-5 md:p-6`}
      >
        <p className="hidden md:flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-5">
          <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={2} /> Filtra i cantieri
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block md:col-span-2">
            <span className="text-xs font-medium text-muted-foreground mb-1.5 block">Ricerca</span>
            <span className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 px-3 focus-within:border-foreground/40">
              <Search className="h-4 w-4 text-muted-foreground" strokeWidth={2} aria-hidden="true" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Descrizione, indirizzo, protocollo…"
                className="flex-1 min-w-0 bg-transparent py-2.5 text-sm focus:outline-none"
                aria-label="Cerca testo"
              />
            </span>
          </label>

          <label className="block">
            <span className="text-xs font-medium text-muted-foreground mb-1.5 block">Regione</span>
            <input
              type="text"
              value={regione}
              onChange={(e) => setRegione(e.target.value)}
              placeholder="Es. Lombardia"
              className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-sm focus:outline-none focus:border-foreground/40"
              aria-label="Filtra per regione"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-muted-foreground mb-1.5 block">Provincia (sigla)</span>
            <input
              type="text"
              value={provincia}
              onChange={(e) => setProvincia(e.target.value)}
              placeholder="Es. MI"
              maxLength={2}
              className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-sm uppercase focus:outline-none focus:border-foreground/40"
              aria-label="Filtra per provincia"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-muted-foreground mb-1.5 block">Comune</span>
            <input
              type="text"
              value={comune}
              onChange={(e) => setComune(e.target.value)}
              placeholder="Es. Milano"
              className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-sm focus:outline-none focus:border-foreground/40"
              aria-label="Filtra per comune"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-muted-foreground mb-1.5 block">Tipo di intervento</span>
            <select
              value={intervento}
              onChange={(e) => setIntervento(e.target.value)}
              className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-sm focus:outline-none focus:border-foreground/40"
              aria-label="Filtra per tipo di intervento"
            >
              <option value="">Tutti gli interventi</option>
              {INTERVENTI.map((k) => (
                <option key={k} value={k}>
                  {INTERVENTO_META[k].label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          onClick={() => setAvanzatiOpen((v) => !v)}
          className="mt-5 flex w-full items-center justify-between gap-2 text-sm font-semibold text-foreground"
          aria-expanded={avanzatiOpen}
        >
          <span>Altri filtri</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${avanzatiOpen ? 'rotate-180' : ''}`}
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>

        {avanzatiOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground mb-1.5 block">Destinazione d&apos;uso</span>
              <select
                value={destinazione}
                onChange={(e) => setDestinazione(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-sm focus:outline-none focus:border-foreground/40"
                aria-label="Filtra per destinazione d'uso"
              >
                <option value="">Tutte le destinazioni</option>
                {Object.entries(DESTINAZIONE_META).map(([k, meta]) => (
                  <option key={k} value={k}>
                    {meta.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-medium text-muted-foreground mb-1.5 block">Scala del cantiere</span>
              <select
                value={scala}
                onChange={(e) => setScala(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-sm focus:outline-none focus:border-foreground/40"
                aria-label="Filtra per scala"
              >
                <option value="">Tutte le scale</option>
                {Object.entries(SCALA_META).map(([k, meta]) => (
                  <option key={k} value={k}>
                    {meta.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-medium text-muted-foreground mb-1.5 block">Mestiere coinvolto</span>
              <select
                value={mestiere}
                onChange={(e) => setMestiere(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-sm focus:outline-none focus:border-foreground/40"
                aria-label="Filtra per mestiere"
              >
                <option value="">Tutti i mestieri</option>
                {MESTIERI.map((m) => (
                  <option key={m} value={m}>
                    {MESTIERE_LABELS[m]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-medium text-muted-foreground mb-1.5 block">Valore minimo stimato (€)</span>
              <input
                type="number"
                min={0}
                value={valoreMin}
                onChange={(e) => setValoreMin(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-sm tabular-nums focus:outline-none focus:border-foreground/40"
                aria-label="Valore minimo stimato"
              />
            </label>
          </div>
        )}

        <div className="flex items-center gap-3 mt-5">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-6 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Applica filtri
          </button>
          {hasFilters && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} /> Azzera
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

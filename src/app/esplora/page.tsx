/**
 * /esplora — tool di ricerca filtrabile sulle schede cantiere arricchite
 * (spec §5, Task 13). Mostra SOLO cantieri con scheda_pubblicabile=true (gate
 * 'index'): e' lo show-room del dato strutturato, non un elenco grezzo.
 *
 * Sempre noindex,follow: qualunque combinazione di filtri qui e' una vista
 * dinamica, il valore SEO indicizzabile vive nei silo (geo, mestiere,
 * intervento) generati altrove. /esplora resta raggiungibile e crawlabile
 * (follow) per scoprire le singole schede /cantiere/[slug].
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { INTERVENTI, type InterventoCategoria } from '@websonica/cantieri-core';
import { getCantieriScheda, type SchedaFilters } from '@/lib/supabase/queries/cantieri-scheda';
import { formatNumber } from '@/lib/utils';
import BreadcrumbCantiere from '@/components/cantieri/BreadcrumbCantiere';
import CardSchedaCompact from '@/components/cantieri/CardSchedaCompact';
import ListPaywall from '@/components/cantieri/ListPaywall';
import FiltriEsplora from '@/components/cantieri/FiltriEsplora';

export const revalidate = 3600;

const PAGE_SIZE = 24;

interface PageProps {
  searchParams: {
    q?: string;
    regione?: string;
    provincia?: string;
    comune?: string;
    intervento?: string;
    destinazione?: string;
    scala?: string;
    mestiere?: string;
    valore_min?: string;
    page?: string;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Esplora i cantieri edilizi in Italia — ricerca con filtri',
    description:
      'Cerca i cantieri edilizi italiani arricchiti con dati strutturati: tipo di intervento, destinazione d\'uso, scala, mestieri coinvolti e valore stimato. Filtra per zona e tipologia.',
    alternates: { canonical: '/esplora' },
    // Tool di ricerca: qualunque combinazione di filtri e' una vista dinamica,
    // mai indicizzata. Resta crawlabile (follow) per scoprire le schede.
    robots: { index: false, follow: true },
  };
}

export default async function EsploraPage({ searchParams }: PageProps) {
  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const interventoParam =
    searchParams.intervento && (INTERVENTI as string[]).includes(searchParams.intervento)
      ? (searchParams.intervento as InterventoCategoria)
      : undefined;

  const filters: SchedaFilters = {
    q: searchParams.q,
    regione: searchParams.regione,
    provincia: searchParams.provincia,
    comune: searchParams.comune,
    intervento: interventoParam,
    destinazione: searchParams.destinazione,
    scala: searchParams.scala,
    mestiere: searchParams.mestiere,
    valore_min: searchParams.valore_min ? Number(searchParams.valore_min) : undefined,
    limit: PAGE_SIZE,
    offset,
  };

  // gate 'index': solo schede arricchite e pubblicabili (show-room del dato).
  const { data: cantieri, total } = await getCantieriScheda(filters, 'index');
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // costruttore querystring per paginazione che preserva i filtri
  const buildPageHref = (p: number) => {
    const qs = new URLSearchParams();
    if (searchParams.q) qs.set('q', searchParams.q);
    if (searchParams.regione) qs.set('regione', searchParams.regione);
    if (searchParams.provincia) qs.set('provincia', searchParams.provincia);
    if (searchParams.comune) qs.set('comune', searchParams.comune);
    if (searchParams.intervento) qs.set('intervento', searchParams.intervento);
    if (searchParams.destinazione) qs.set('destinazione', searchParams.destinazione);
    if (searchParams.scala) qs.set('scala', searchParams.scala);
    if (searchParams.mestiere) qs.set('mestiere', searchParams.mestiere);
    if (searchParams.valore_min) qs.set('valore_min', searchParams.valore_min);
    if (p > 1) qs.set('page', String(p));
    const s = qs.toString();
    return s ? `/esplora?${s}` : '/esplora';
  };

  return (
    <section className="pt-32 md:pt-40 pb-12 md:pb-16">
      <div className="container-zen">
        <BreadcrumbCantiere steps={[{ label: 'Esplora' }]} />
        <h1 className="heading-section mb-3">Esplora i cantieri</h1>
        <p className="body-default text-muted-foreground mb-8 max-w-2xl">
          Il tool di ricerca sulle schede arricchite: filtra i cantieri per zona, tipo di intervento, destinazione
          d&apos;uso, scala e mestieri coinvolti, con valore stimato dove disponibile.{' '}
          {total > 0
            ? `${formatNumber(total)} schede corrispondono ai criteri selezionati.`
            : 'Nessuna scheda corrisponde ai filtri selezionati.'}
        </p>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6 md:gap-8 items-start">
          <aside className="lg:sticky lg:top-28">
            <FiltriEsplora />
          </aside>

          <div>
            {cantieri.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" strokeWidth={1.25} />
                <h2 className="text-xl font-semibold mb-2">Nessun risultato</h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                  Prova ad allargare i filtri o a cercare un altro termine.
                </p>
                <Link href="/esplora" className="btn-primary inline-flex">Azzera i filtri</Link>
              </div>
            ) : (
              <>
                {/* Soft-paywall: prime 6 card nitide, resto sfocato + CTA
                    registrazione. Filtri e paginazione restano funzionanti. */}
                <ListPaywall
                  items={cantieri}
                  total={total}
                  keyOf={(c) => c.id}
                  renderCard={(c) => <CardSchedaCompact c={c} />}
                  gridClassName="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
                />

                {/* Paginazione */}
                {totalPages > 1 && (
                  <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Paginazione cantieri">
                    {page > 1 && (
                      <Link href={buildPageHref(page - 1)} rel="prev" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium hover:border-foreground/40 transition-colors">
                        ← Precedente
                      </Link>
                    )}
                    <span className="px-4 py-2 text-sm text-muted-foreground tabular-nums">
                      Pagina {page} di {totalPages}
                    </span>
                    {page < totalPages && (
                      <Link href={buildPageHref(page + 1)} rel="next" className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium hover:border-foreground/40 transition-colors">
                        Successiva →
                      </Link>
                    )}
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

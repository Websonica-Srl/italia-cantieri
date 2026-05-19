import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Lock, Info } from 'lucide-react';
import {
  getCantieri,
  getAggregatiAnonimiByComune,
  countFirmsByComune,
  getAllComuni,
} from '@/lib/supabase/queries/cantieri';
import { slugify, formatNumber, formatEuro, regioneSlug, provinciaSlug } from '@/lib/utils';
import BreadcrumbCantiere from '@/components/cantieri/BreadcrumbCantiere';
import StatsBox from '@/components/cantieri/StatsBox';
import CantiereCard from '@/components/cantieri/CantiereCard';
import CrossLinkCorrelati from '@/components/cantieri/CrossLinkCorrelati';
import BarChart from '@/components/cantieri/BarChart';

export const revalidate = 3600;

interface PageProps {
  params: { slug: string };
}

async function resolveComune(slug: string): Promise<{ comune: string; provincia: string; regione: string } | null> {
  const all = await getAllComuni();
  const target = slug.toLowerCase();
  const hit = all.find((c) => slugify(c.comune) === target);
  return hit || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const comune = await resolveComune(params.slug);
  if (!comune) return { title: 'Comune non trovato' };
  return {
    title: `Cantieri edilizi a ${comune.comune} (${comune.provincia}) — Italia Cantieri`,
    description: `Permessi di costruire, SCIA e CILA a ${comune.comune}, provincia di ${comune.provincia}. Dati pubblici aggregati.`,
    alternates: { canonical: `/comune/${params.slug}` },
  };
}

export default async function ComunePage({ params }: PageProps) {
  const meta = await resolveComune(params.slug);
  if (!meta) notFound();

  const [{ data: cantieriPubblici, total }, aggregati, firmCount] = await Promise.all([
    getCantieri({ comune: meta.comune, limit: 30, orderBy: 'data_pubblicazione' }),
    getAggregatiAnonimiByComune(meta.comune),
    countFirmsByComune(meta.comune),
  ]);

  const importoTotaleCampione = cantieriPubblici.reduce((s, c) => s + (Number(c.importo_lavori) || 0), 0);

  return (
    <section className="py-12 md:py-16">
      <div className="container-zen">
        <BreadcrumbCantiere
          steps={[
            { label: 'Regioni', href: '/regioni' },
            { label: meta.regione, href: `/${regioneSlug(meta.regione)}` },
            { label: `Provincia di ${meta.provincia}`, href: `/${regioneSlug(meta.regione)}/${provinciaSlug(meta.provincia)}` },
            { label: meta.comune },
          ]}
        />
        <h1 className="heading-section mb-3">Cantieri a {meta.comune}</h1>
        <p className="body-default text-muted-foreground mb-10 max-w-2xl">
          Database pubblico cantieri edilizi a {meta.comune} ({meta.provincia}, {meta.regione}). Dati aggregati da fonti
          open data PA e albo pretorio comunale.
        </p>

        <StatsBox
          items={[
            { label: 'Cantieri pubblici tracciati', value: total, format: 'number' },
            { label: 'Statistiche anonime aggiuntive', value: aggregati.totale_aggregato, format: 'number', helper: 'cantieri privati k-anon 5' },
            { label: 'Importo recenti (campione)', value: importoTotaleCampione, format: 'euro' },
          ]}
          columns={3}
        />

        {/* SEZIONE PUBBLICA (LAYER 1) */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-1">Cantieri pubblici a {meta.comune}</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Schede dettagliate dei cantieri con visibilità pubblica (PDC, SCIA, CILA dichiarati in albo pretorio).
          </p>
          {cantieriPubblici.length === 0 ? (
            <p className="text-sm text-muted-foreground rounded-2xl border border-dashed border-border p-6 text-center">
              Nessun cantiere pubblico attualmente disponibile per {meta.comune}.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cantieriPubblici.map((c) => (
                <CantiereCard key={c.id} cantiere={c} />
              ))}
            </div>
          )}
        </div>

        {/* SEZIONE AGGREGATI ANONIMI (LAYER 2) */}
        {aggregati.categorie.length > 0 && (
          <div className="mt-16">
            <div className="flex items-start gap-3 mb-6 rounded-2xl border border-border bg-secondary p-5">
              <Lock className="h-5 w-5 text-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-semibold mb-1">Statistiche anonime — Cantieri privati a {meta.comune}</h2>
                <p className="text-sm text-secondary-text leading-relaxed">
                  Aggregati con tecnica di <strong>k-anonymity 5</strong>: visualizzati solo gruppi con almeno 5 cantieri per
                  proteggere la privacy degli individui. Dati derivati dall&apos;analisi degli open data PA. Per accesso ai
                  dati di dettaglio,{' '}
                  <a href="https://www.italiaprogettisti.com/abbonamenti" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    sblocca Premium
                  </a>
                  .
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-white p-6">
              <h3 className="font-semibold mb-4">Distribuzione per categoria</h3>
              <BarChart
                data={aggregati.categorie.map((c) => ({
                  label: c.categoria,
                  value: c.totale,
                }))}
              />
              <p className="mt-4 text-xs text-muted-foreground inline-flex items-center gap-1">
                <Info className="h-3 w-3" /> Importi totali stimati: {formatEuro(aggregati.categorie.reduce((s, c) => s + (c.importo_totale || 0), 0), { compact: true })}
              </p>
            </div>
          </div>
        )}

        {/* CROSS LINK */}
        <div className="mt-12">
          <CrossLinkCorrelati comune={meta.comune} countImprese={firmCount} />
        </div>
      </div>
    </section>
  );
}

/**
 * Pillar-intervento /cantieri/[intervento] (spec §2.1, Task 10).
 *
 * Pagina di volume educativa (H1 + answer-first + sezioni + FAQ + correlati, via
 * PillarSections) con un blocco-dato opzionale sotto index-gate: solo se l'inventario
 * reale dell'intervento supera la soglia (isAggregateIndexable) mostriamo il conteggio,
 * la distribuzione per provincia e i cantieri recenti. Sotto soglia il pillar resta
 * puramente educativo (nessun numero inventato).
 *
 * 404 se il pillar non è pronto (answerFirst vuoto, stub): vedi getPillar/pillars.ts.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin } from 'lucide-react';
import {
  interventoBySlug,
  INTERVENTO_META,
  TITOLO_GUIDA_SLUG,
  TITOLO_LABELS,
  displayInterventoLabel,
  type TipoTitolo,
} from '@websonica/cantieri-core';
import { getPillar, getInterventoPillarSlugs } from '@/lib/content/pillars';
import { getInterventoAggregato } from '@/lib/supabase/queries/cantieri-scheda';
import { isAggregateIndexable } from '@/lib/seo/indexable';
import { itemListLd, safeJsonLd, ogImageUrl } from '@/lib/seo/structured-data';
import { siteConfig } from '@/lib/site-config';
import { formatNumber } from '@/lib/utils';
import { provinciaNameFromCode } from '@/lib/province';
import { resolveLucideIcon } from '@/lib/cantieri/resolveLucideIcon';
import BreadcrumbCantiere from '@/components/cantieri/BreadcrumbCantiere';
import PillarSections from '@/components/cantieri/PillarSections';
import CardSchedaCompact from '@/components/cantieri/CardSchedaCompact';
import AlertCantieriCTA from '@/components/cantieri/AlertCantieriCTA';

export const revalidate = 3600;

interface PageProps {
  params: { intervento: string };
}

/** Titoli edilizi con guida pubblicata, per il quick-link "quale titolo edilizio serve". */
const TITOLI_CON_GUIDA = (['CILA', 'SCIA', 'PDC'] as TipoTitolo[]).filter(
  (t) => TITOLO_GUIDA_SLUG[t],
);

export async function generateStaticParams() {
  return getInterventoPillarSlugs().map((intervento) => ({ intervento }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const intervento = interventoBySlug(params.intervento);
  const pillar = getPillar('intervento', params.intervento);
  if (!intervento || !pillar || !pillar.answerFirst) {
    return { title: 'Pagina non trovata' };
  }

  const meta = INTERVENTO_META[intervento];
  const ogImage = ogImageUrl({
    title: pillar.h1,
    subtitle: 'Dati aggiornati da albi pretori e open data PA',
    kind: 'generic',
    label: meta.label,
  });

  return {
    title: pillar.metaTitle,
    description: pillar.metaDescription,
    // Pagina di volume: sempre indicizzabile, il blocco-dato è solo un componente opzionale.
    alternates: { canonical: `/cantieri/${pillar.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: pillar.metaTitle,
      description: pillar.metaDescription,
      url: `/cantieri/${pillar.slug}`,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: pillar.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pillar.metaTitle,
      description: pillar.metaDescription,
      images: [ogImage],
    },
  };
}

export default async function InterventoPillarPage({ params }: PageProps) {
  const intervento = interventoBySlug(params.intervento);
  const pillar = getPillar('intervento', params.intervento);
  if (!intervento || !pillar || !pillar.answerFirst) notFound();

  const meta = INTERVENTO_META[intervento];
  const Icon = resolveLucideIcon(meta.icon);
  const agg = await getInterventoAggregato(intervento);
  const blocDatoAttivo = isAggregateIndexable(agg.total);

  return (
    <>
      {/* itemListLd sui recenti: solo quando il blocco-dato è attivo (davvero indicizzabile). */}
      {blocDatoAttivo && agg.recenti.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(
              itemListLd(
                agg.recenti.map((c) => ({
                  name: `${c.intervento_categoria ? displayInterventoLabel(c.intervento_categoria) : meta.label} a ${c.comune}`,
                  url: `${siteConfig.baseUrl}/cantiere/${c.slug}`,
                })),
                `Cantieri recenti di ${meta.label.toLowerCase()}`,
              ),
            ),
          }}
        />
      )}

      <section className="pt-32 md:pt-40 pb-12 md:pb-16">
        <div className="container-zen">
          <BreadcrumbCantiere steps={[{ label: 'Cantieri', href: '/cantieri' }, { label: meta.label }]} />
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl mb-2"
            style={{ backgroundColor: `${meta.color}1a` }}
            aria-hidden="true"
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} style={{ color: meta.color }} />
          </span>
        </div>

        <PillarSections pillar={pillar}>
          {/* Quick-link ai titoli edilizi (consuma TITOLO_GUIDA_SLUG di cantieri-core). */}
          {TITOLI_CON_GUIDA.length > 0 && (
            <div className="max-w-3xl mb-10">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
                Guide ai titoli edilizi
              </p>
              <div className="flex flex-wrap gap-2">
                {TITOLI_CON_GUIDA.map((t) => (
                  <Link
                    key={t}
                    href={`/guide/${TITOLO_GUIDA_SLUG[t]}`}
                    className="chip hover:bg-secondary transition-colors"
                  >
                    {TITOLO_LABELS[t]}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* BLOCCO-DATO [gate inventario]: solo sopra soglia (isAggregateIndexable). */}
          {blocDatoAttivo && (
            <div className="max-w-5xl mb-4">
              <div className="card-zen p-6 md:p-8 mb-8">
                <p className="text-2xl md:text-3xl font-extrabold text-foreground">
                  {formatNumber(agg.total)} cantieri di {meta.label.toLowerCase()} in Italia
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Dati aggregati da albi pretori comunali e open data della Pubblica Amministrazione, aggiornati
                  periodicamente.
                </p>
              </div>

              {agg.perProvincia.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-lg md:text-xl font-bold mb-4">
                    Distribuzione per provincia
                  </h2>
                  {/* Fase 1: elenco non cliccabile (nessuna combinazione intervento+provincia filtrata
                      ancora disponibile). La route /cantieri/[intervento]/[provincia] è Fase 2. */}
                  <ul className="flex flex-wrap gap-2">
                    {agg.perProvincia.map((p) => (
                      <li
                        key={p.provincia}
                        className="chip inline-flex items-center gap-1.5"
                      >
                        <MapPin className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                        {provinciaNameFromCode(p.provincia)}
                        <span className="text-muted-foreground">({formatNumber(p.cnt)})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {agg.recenti.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-lg md:text-xl font-bold mb-4">
                    Cantieri recenti di {meta.label.toLowerCase()}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agg.recenti.map((c) => (
                      <CardSchedaCompact key={c.id} c={c} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="max-w-3xl mb-4">
            <AlertCantieriCTA scope={{ intervento: params.intervento }} />
          </div>
        </PillarSections>
      </section>
    </>
  );
}

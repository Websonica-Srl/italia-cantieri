/**
 * Pillar-guida /guide/[slug] (spec §2.2, Task 11).
 *
 * Editoriale pura: H1 + answer-first + sezioni (quando si usa/quando NON basta,
 * iter/tempi/costi/sanzioni) + tabella di confronto tra titoli edilizi + FAQ +
 * correlati, via PillarSections. NESSUN blocco-dato (quello vive solo nei pillar-
 * intervento, Task 10): qui il contenuto è normativo, non un aggregato di cantieri.
 *
 * 404 se il pillar non è pronto (answerFirst vuoto, stub): vedi getPillar/pillars.ts.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Scale } from 'lucide-react';
import {
  TITOLO_LABELS,
  TITOLO_GUIDA_SLUG,
  type TipoTitolo,
} from '@websonica/cantieri-core';
import { getPillar, getGuidaPillarSlugs } from '@/lib/content/pillars';
import { faqLd, breadcrumbLd, glossaryLd, safeJsonLd, ogImageUrl } from '@/lib/seo/structured-data';
import BreadcrumbCantiere from '@/components/cantieri/BreadcrumbCantiere';
import PillarSections from '@/components/cantieri/PillarSections';
import AlertCantieriCTA from '@/components/cantieri/AlertCantieriCTA';

export const revalidate = 86400;

interface PageProps {
  params: { slug: string };
}

/** I 3 titoli edilizi con guida propria (cfr. TITOLO_GUIDA_SLUG di cantieri-core). */
const TITOLI_TABELLA = (['PDC', 'SCIA', 'CILA'] as TipoTitolo[]).filter((t) => TITOLO_GUIDA_SLUG[t]);

/** Riepilogo "quando si usa" per la tabella di confronto (sintesi, il dettaglio vive nella guida dedicata). */
const QUANDO_BREVE: Partial<Record<TipoTitolo, string>> = {
  PDC: 'Nuova costruzione, ampliamento con aumento di volume, modifica della sagoma',
  SCIA: 'Ristrutturazione "leggera", restauro, risanamento conservativo, senza modifica di sagoma o volume',
  CILA: 'Manutenzione straordinaria non strutturale (tramezzi, pavimenti, infissi, impianti)',
};

/** Riepilogo tempi per la tabella di confronto. */
const TEMPI_BREVE: Partial<Record<TipoTitolo, string>> = {
  PDC: '~90 giorni (silenzio-assenso salvo diniego espresso)',
  SCIA: 'Immediato (controlli comunali entro 60 giorni)',
  CILA: 'Immediato (nessun controllo preventivo)',
};

export async function generateStaticParams() {
  return getGuidaPillarSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const pillar = getPillar('guida', params.slug);
  if (!pillar || !pillar.answerFirst) {
    return { title: 'Pagina non trovata' };
  }

  const ogImage = ogImageUrl({
    title: pillar.h1,
    subtitle: 'Guida normativa: titoli edilizi ed edilizia in Italia',
    kind: 'generic',
    label: pillar.titolo ? TITOLO_LABELS[pillar.titolo] : 'Guida',
  });

  return {
    title: pillar.metaTitle,
    description: pillar.metaDescription,
    alternates: { canonical: `/guide/${pillar.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: pillar.metaTitle,
      description: pillar.metaDescription,
      url: `/guide/${pillar.slug}`,
      type: 'article',
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

export default async function GuidaPillarPage({ params }: PageProps) {
  const pillar = getPillar('guida', params.slug);
  if (!pillar || !pillar.answerFirst) notFound();

  return (
    <>
      {/* JSON-LD esplicito (breadcrumbLd/faqLd/glossaryLd): la BreadcrumbCantiere e la FAQ
          interne di PillarSections sono in modalita' skipJsonLd per evitare doppio schema. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(breadcrumbLd([{ name: 'Guide', path: '/guide' }, { name: pillar.h1 }])),
        }}
      />
      {pillar.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLd(pillar.faq)) }}
        />
      )}
      {pillar.titolo && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd(
              glossaryLd(`Titolo edilizio: ${TITOLO_LABELS[pillar.titolo]}`, [
                {
                  termCode: pillar.titolo,
                  name: TITOLO_LABELS[pillar.titolo],
                  definition: pillar.answerFirst,
                  relatedPath: `/guide/${pillar.slug}`,
                },
              ]),
            ),
          }}
        />
      )}

      <section className="pt-32 md:pt-40 pb-12 md:pb-16">
        <div className="container-zen">
          <BreadcrumbCantiere
            steps={[{ label: 'Guide', href: '/guide' }, { label: pillar.h1 }]}
            skipJsonLd
          />
        </div>

        <PillarSections pillar={pillar} skipFaqJsonLd>
          {/* Tabella di confronto tra titoli edilizi: link incrociato alle altre guide. */}
          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              <Scale className="h-3.5 w-3.5" aria-hidden="true" /> Differenza con gli altri titoli edilizi
            </div>
            <div className="card-zen overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left bg-secondary/40">
                    <th className="py-3 px-4 font-semibold">Titolo</th>
                    <th className="py-3 px-4 font-semibold">Quando si usa</th>
                    <th className="py-3 px-4 font-semibold">Tempi</th>
                    <th className="py-3 px-4 font-semibold sr-only">Guida</th>
                  </tr>
                </thead>
                <tbody>
                  {TITOLI_TABELLA.map((t) => {
                    const isCurrent = pillar.titolo === t;
                    const slug = TITOLO_GUIDA_SLUG[t];
                    return (
                      <tr key={t} className="border-b border-border/50 last:border-b-0 align-top">
                        <td className="py-3 px-4 font-semibold whitespace-nowrap">
                          {TITOLO_LABELS[t]}
                          {isCurrent && (
                            <span className="ml-2 chip text-[11px] align-middle">Questa guida</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{QUANDO_BREVE[t]}</td>
                        <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{TEMPI_BREVE[t]}</td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          {!isCurrent && slug && (
                            <Link
                              href={`/guide/${slug}`}
                              className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
                            >
                              Guida <ArrowRight className="h-3 w-3" aria-hidden="true" />
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="max-w-3xl mb-4">
            <AlertCantieriCTA scope={{}} />
          </div>
        </PillarSections>
      </section>
    </>
  );
}

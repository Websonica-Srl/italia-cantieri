/**
 * Indice /guide (Task 11): elenca i pillar-guida pubblicati (answerFirst non vuoto),
 * stesso pattern dell'indice /cantieri (Task 10). Pagina di volume, sempre indicizzabile.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookText } from 'lucide-react';
import { getGuidaPillarSlugs, getPillar } from '@/lib/content/pillars';
import BreadcrumbCantiere from '@/components/cantieri/BreadcrumbCantiere';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Guide ai titoli edilizi: CILA, SCIA, Permesso di Costruire',
  description:
    'Guide normative ai titoli edilizi italiani: cos\'e\' la CILA, cos\'e\' la SCIA, il Permesso di Costruire, quando servono e quali sono le differenze.',
  alternates: { canonical: '/guide' },
  robots: { index: true, follow: true },
};

export default function GuideIndexPage() {
  const slugs = getGuidaPillarSlugs();
  const guide = slugs
    .map((slug) => getPillar('guida', slug))
    .filter((p): p is NonNullable<typeof p> => p !== null && !!p.answerFirst);

  return (
    <section className="pt-32 md:pt-40 pb-12 md:pb-16">
      <div className="container-zen">
        <BreadcrumbCantiere steps={[{ label: 'Guide' }]} />
        <h1 className="heading-section mb-3">Guide ai titoli edilizi</h1>
        <p className="body-default text-muted-foreground mb-10 max-w-2xl">
          Prima di aprire un cantiere serve il titolo edilizio corretto. Scegli una guida per capire cos'e',
          quando si usa e quando invece serve un titolo diverso.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guide.map((p) => (
            <Link
              key={p.slug}
              href={`/guide/${p.slug}`}
              aria-label={`Leggi la guida: ${p.h1}`}
              className="group rounded-2xl border border-border bg-white p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 bg-secondary/60">
                  <BookText className="h-5 w-5 text-foreground" strokeWidth={1.75} />
                </span>
                <h2 className="text-lg font-semibold">{p.h1}</h2>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{p.answerFirst}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Leggi la guida <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

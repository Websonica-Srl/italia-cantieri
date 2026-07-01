/**
 * Indice /cantieri (Task 10): elenca i pillar-intervento pubblicati
 * (i 5 con hasPillar=true in INTERVENTO_META, cfr. getInterventoPillarSlugs).
 * Pagina di volume, sempre indicizzabile.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { INTERVENTO_META, type InterventoCategoria } from '@websonica/cantieri-core';
import { getInterventoPillarSlugs, getPillar } from '@/lib/content/pillars';
import { resolveLucideIcon } from '@/lib/cantieri/resolveLucideIcon';
import BreadcrumbCantiere from '@/components/cantieri/BreadcrumbCantiere';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Cantieri per tipo di intervento: ristrutturazione, ampliamento e altro',
  description:
    'Esplora i cantieri edilizi italiani per tipo di intervento: ristrutturazione, manutenzione straordinaria, ampliamento, cambio di destinazione d\'uso, demolizione e ricostruzione.',
  alternates: { canonical: '/cantieri' },
  robots: { index: true, follow: true },
};

export default function CantieriIndexPage() {
  const slugs = getInterventoPillarSlugs();
  const interventi = slugs
    .map((slug) => getPillar('intervento', slug))
    .filter((p): p is NonNullable<typeof p> => p !== null && p.intervento !== undefined && !!p.answerFirst);

  return (
    <section className="pt-32 md:pt-40 pb-12 md:pb-16">
      <div className="container-zen">
        <BreadcrumbCantiere steps={[{ label: 'Cantieri' }]} />
        <h1 className="heading-section mb-3">Cantieri per tipo di intervento</h1>
        <p className="body-default text-muted-foreground mb-10 max-w-2xl">
          Ogni cantiere pubblicato viene classificato per tipo di intervento edilizio. Scegli una categoria per
          scoprire quando serve, quale titolo edilizio richiede e quanto costa indicativamente.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {interventi.map((p) => {
            const meta = INTERVENTO_META[p.intervento as InterventoCategoria];
            const Icon = resolveLucideIcon(meta.icon);
            return (
              <Link
                key={p.slug}
                href={`/cantieri/${p.slug}`}
                aria-label={`Vedi i cantieri di ${meta.label.toLowerCase()}`}
                className="group rounded-2xl border border-border bg-white p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0"
                    style={{ backgroundColor: `${meta.color}1a` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: meta.color }} strokeWidth={1.75} />
                  </span>
                  <h2 className="text-lg font-semibold">{meta.label}</h2>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{p.answerFirst}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Scopri di piu' <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

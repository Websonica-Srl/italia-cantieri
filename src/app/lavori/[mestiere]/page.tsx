/**
 * Navigazione mestiere /lavori/[mestiere] (spec §1, Task 12).
 *
 * Pagina di navigazione interna per l'azienda esecutrice: elenco dei cantieri che
 * richiedono un dato mestiere (es. serramenti, impianti elettrici). NON è un pillar
 * di volume: in Fase 1 resta sempre noindex,follow (nessuna pagina /lavori indicizzata),
 * usata solo per instradare il crawler/utente verso le schede cantiere pubbliche.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  MESTIERI,
  mestiereBySlug,
  mestiereLabel,
  mestiereSlug,
} from '@websonica/cantieri-core';
import { getCantieriScheda } from '@/lib/supabase/queries/cantieri-scheda';
import { formatNumber } from '@/lib/utils';
import BreadcrumbCantiere from '@/components/cantieri/BreadcrumbCantiere';
import CardSchedaCompact from '@/components/cantieri/CardSchedaCompact';
import AlertCantieriCTA from '@/components/cantieri/AlertCantieriCTA';

export const revalidate = 3600;

interface PageProps {
  params: { mestiere: string };
}

export async function generateStaticParams() {
  return MESTIERI.map((m) => ({ mestiere: mestiereSlug(m) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const m = mestiereBySlug(params.mestiere);
  if (!m) return { title: 'Pagina non trovata' };

  const label = mestiereLabel(m);
  const title = `Cantieri che richiedono ${label} — Italia Cantieri`;
  const description = `Elenco dei cantieri che richiedono il mestiere ${label.toLowerCase()}: permessi di costruire, SCIA e CILA dove la tua impresa può proporsi per i lavori.`;

  return {
    title,
    description,
    alternates: { canonical: `/lavori/${params.mestiere}` },
    // Navigazione interna, non pagina di volume: mai indicizzata in Fase 1 (spec §1).
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: `/lavori/${params.mestiere}`,
      type: 'website',
    },
  };
}

export default async function MestierePage({ params }: PageProps) {
  const m = mestiereBySlug(params.mestiere);
  if (!m) notFound();

  const label = mestiereLabel(m);
  const { data: cantieri, total } = await getCantieriScheda({ mestiere: m, limit: 24 }, 'list');

  return (
    <section className="pt-32 md:pt-40 pb-12 md:pb-16">
      <div className="container-zen">
        <BreadcrumbCantiere steps={[{ label: 'Lavori' }, { label }]} />
        <h1 className="heading-section mb-3">Cantieri che richiedono {label}</h1>
        <p className="body-default text-muted-foreground mb-10 max-w-2xl">
          {total > 0
            ? `${formatNumber(total)} cantieri con lavori di ${label.toLowerCase()} da intercettare. `
            : ''}
          Se la tua impresa lavora nel mestiere &ldquo;{label.toLowerCase()}&rdquo;, qui trovi i cantieri
          appena aperti dove proporti prima della concorrenza.
        </p>

        {cantieri.length === 0 ? (
          <p className="text-sm text-muted-foreground rounded-2xl border border-dashed border-border p-6 text-center">
            Nessun cantiere disponibile al momento per il mestiere {label.toLowerCase()}. Stiamo lavorando per
            estendere la copertura: torna a trovarci presto.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cantieri.map((c) => (
              <CardSchedaCompact key={c.id} c={c} />
            ))}
          </div>
        )}

        <div className="mt-12">
          <AlertCantieriCTA scope={{}} />
        </div>
      </div>
    </section>
  );
}

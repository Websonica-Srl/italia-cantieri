import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { getCantieriByRegione } from '@/lib/supabase/queries/cantieri';
import { regioneSlug, formatNumber } from '@/lib/utils';
import BreadcrumbCantiere from '@/components/cantieri/BreadcrumbCantiere';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Cantieri edilizi per regione — Italia Cantieri',
  description:
    'Esplora tutti i cantieri edilizi pubblici per regione italiana. Permessi di costruire, SCIA, CILA da fonti open data PA.',
  alternates: { canonical: '/regioni' },
};

export default async function RegioniPage() {
  const regioni = await getCantieriByRegione();
  const totale = regioni.reduce((s, r) => s + r.cnt, 0);

  return (
    <section className="py-12 md:py-16">
      <div className="container-zen">
        <BreadcrumbCantiere steps={[{ label: 'Regioni' }]} />
        <h1 className="heading-section mb-3">Cantieri per regione</h1>
        <p className="body-default text-muted-foreground mb-10 max-w-2xl">
          {formatNumber(totale)} cantieri edilizi tracciati in {regioni.length} regione/i italiane. Clicca su una regione per
          esplorare le province e i singoli cantieri pubblici.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {regioni.map((r) => (
            <Link
              key={r.regione}
              href={`/${regioneSlug(r.regione)}`}
              className="group rounded-2xl border border-border bg-white p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <MapPin className="h-5 w-5" />
                </span>
                <h2 className="text-lg font-semibold">{r.regione}</h2>
              </div>
              <div className="text-3xl font-extrabold text-foreground">{formatNumber(r.cnt)}</div>
              <div className="text-sm text-muted-foreground mt-1">cantieri tracciati</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

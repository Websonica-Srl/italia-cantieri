import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, ArrowRight } from 'lucide-react';
import {
  getCantieri,
  getCantieriByProvincia,
  getCantieriByRegione,
  getRegioneStats,
} from '@/lib/supabase/queries/cantieri';
import { regioneFromSlug, regioneSlug, provinciaSlug, formatNumber } from '@/lib/utils';
import BreadcrumbCantiere from '@/components/cantieri/BreadcrumbCantiere';
import StatsBox from '@/components/cantieri/StatsBox';
import CantiereCard from '@/components/cantieri/CantiereCard';
import BarChart from '@/components/cantieri/BarChart';

export const revalidate = 3600;

interface PageProps {
  params: { regione: string };
}

/** Pre-render top 20 regioni a build time, le altre on-demand. */
export async function generateStaticParams() {
  const list = await getCantieriByRegione();
  return list.slice(0, 20).map((r) => ({ regione: regioneSlug(r.regione) }));
}

async function resolveRegione(slug: string): Promise<string | null> {
  const all = await getCantieriByRegione();
  const target = slug.toLowerCase();
  const hit = all.find((r) => regioneSlug(r.regione) === target);
  return hit ? hit.regione : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const reg = await resolveRegione(params.regione);
  if (!reg) return { title: 'Regione non trovata' };
  return {
    title: `Cantieri edilizi in ${reg} — Italia Cantieri`,
    description: `Permessi di costruire, SCIA e CILA in ${reg}. Aggregatore pubblico open data PA.`,
    alternates: { canonical: `/${params.regione}` },
  };
}

export default async function RegionePage({ params }: PageProps) {
  const regioneNome = await resolveRegione(params.regione);
  if (!regioneNome) notFound();

  const [stats, province, recenti] = await Promise.all([
    getRegioneStats(regioneNome),
    getCantieriByProvincia(regioneNome),
    getCantieri({ regione: regioneNome, limit: 20, orderBy: 'data_pubblicazione' }),
  ]);

  return (
    <section className="py-12 md:py-16">
      <div className="container-zen">
        <BreadcrumbCantiere steps={[{ label: 'Regioni', href: '/regioni' }, { label: regioneNome }]} />
        <h1 className="heading-section mb-3">Cantieri in {regioneNome}</h1>
        <p className="body-default text-muted-foreground mb-10 max-w-2xl">
          {formatNumber(stats.totale)} cantieri edilizi tracciati, distribuiti su {stats.province} province e {stats.comuni}{' '}
          comuni della regione {regioneNome}.
        </p>

        <StatsBox
          items={[
            { label: 'Cantieri tracciati', value: stats.totale, format: 'number' },
            { label: 'Province', value: stats.province, format: 'number' },
            { label: 'Comuni', value: stats.comuni, format: 'number' },
            { label: 'Importo totale', value: stats.importo_totale, format: 'euro' },
          ]}
        />

        {/* TOP CATEGORIE */}
        {stats.top_categorie.length > 0 && (
          <div className="mt-12 rounded-2xl border border-border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Top categorie di lavori in {regioneNome}</h2>
            <BarChart data={stats.top_categorie.map((c) => ({ label: c.categoria, value: c.cnt }))} />
          </div>
        )}

        {/* PROVINCE */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Province di {regioneNome}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {province.map((p) => (
              <Link
                key={p.provincia}
                href={`/${params.regione}/${provinciaSlug(p.provincia)}`}
                className="rounded-xl border border-border bg-white p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-semibold uppercase tracking-wider text-sm">{p.provincia}</span>
                </div>
                <div className="text-xs text-muted-foreground">{formatNumber(p.cnt)} cantieri</div>
              </Link>
            ))}
          </div>
        </div>

        {/* CANTIERI RECENTI */}
        <div className="mt-12">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-xl font-semibold">Cantieri recenti in {regioneNome}</h2>
            <Link href="/regioni" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
              Cambia regione <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recenti.data.map((c) => (
              <CantiereCard key={c.id} cantiere={c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

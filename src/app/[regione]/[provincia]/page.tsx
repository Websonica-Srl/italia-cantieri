import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin } from 'lucide-react';
import {
  getCantieri,
  getCantieriByComune,
  getCantieriByProvincia,
  getCantieriByRegione,
} from '@/lib/supabase/queries/cantieri';
import { regioneFromSlug, regioneSlug, provinciaSlug, slugify, formatNumber } from '@/lib/utils';
import BreadcrumbCantiere from '@/components/cantieri/BreadcrumbCantiere';
import CantiereCard from '@/components/cantieri/CantiereCard';
import StatsBox from '@/components/cantieri/StatsBox';

export const revalidate = 3600;

interface PageProps {
  params: { regione: string; provincia: string };
}

async function resolveRegione(slug: string): Promise<string | null> {
  const all = await getCantieriByRegione();
  const target = slug.toLowerCase();
  const hit = all.find((r) => regioneSlug(r.regione) === target);
  return hit ? hit.regione : null;
}

async function resolveProvincia(regione: string, slug: string): Promise<string | null> {
  const list = await getCantieriByProvincia(regione);
  const target = slug.toLowerCase();
  const hit = list.find((p) => provinciaSlug(p.provincia) === target);
  return hit ? hit.provincia : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const reg = await resolveRegione(params.regione);
  if (!reg) return { title: 'Provincia non trovata' };
  const prov = await resolveProvincia(reg, params.provincia);
  if (!prov) return { title: 'Provincia non trovata' };
  return {
    title: `Cantieri provincia di ${prov} (${reg}) — Italia Cantieri`,
    description: `Permessi di costruire e SCIA nella provincia di ${prov}, regione ${reg}.`,
    alternates: { canonical: `/${params.regione}/${params.provincia}` },
  };
}

export default async function ProvinciaPage({ params }: PageProps) {
  const reg = await resolveRegione(params.regione);
  if (!reg) notFound();
  const prov = await resolveProvincia(reg, params.provincia);
  if (!prov) notFound();

  const [comuni, recenti] = await Promise.all([
    getCantieriByComune(prov),
    getCantieri({ regione: reg, provincia: prov, limit: 30, orderBy: 'data_pubblicazione' }),
  ]);

  const totale = recenti.total;
  const importoTotale = recenti.data.reduce((s, c) => s + (Number(c.importo_lavori) || 0), 0);

  return (
    <section className="pt-32 md:pt-40 pb-12 md:pb-16">
      <div className="container-zen">
        <BreadcrumbCantiere
          steps={[
            { label: 'Regioni', href: '/regioni' },
            { label: reg, href: `/${params.regione}` },
            { label: `Provincia di ${prov}` },
          ]}
        />
        <h1 className="heading-section mb-3">Cantieri in provincia di {prov}</h1>
        <p className="body-default text-muted-foreground mb-10 max-w-2xl">
          {formatNumber(totale)} cantieri tracciati nella provincia di {prov} ({reg}), distribuiti su {comuni.length}{' '}
          comuni.
        </p>

        <StatsBox
          items={[
            { label: 'Cantieri', value: totale, format: 'number' },
            { label: 'Comuni', value: comuni.length, format: 'number' },
            { label: 'Importo recenti (campione)', value: importoTotale, format: 'euro' },
          ]}
          columns={3}
        />

        {/* COMUNI */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Comuni della provincia di {prov}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {comuni.map((c) => (
              <Link
                key={c.comune}
                href={`/comune/${slugify(c.comune)}`}
                className="rounded-xl border border-border bg-white p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-semibold text-sm">{c.comune}</span>
                </div>
                <div className="text-xs text-muted-foreground">{formatNumber(c.cnt)} cantieri</div>
              </Link>
            ))}
          </div>
        </div>

        {/* CANTIERI RECENTI */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Cantieri recenti in provincia di {prov}</h2>
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

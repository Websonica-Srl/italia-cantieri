import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, ArrowRight, Bell } from 'lucide-react';
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
import FAQ from '@/components/cantieri/FAQ';

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
    title: `Cantieri edilizi in ${reg} — Permessi PDC, SCIA e CILA`,
    description: `Tutti i cantieri attivi in ${reg}: permessi di costruire, SCIA, CILA e bandi pubblici aggiornati. Aggregati da albi pretori e open data PA.`,
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

  const regioneFaq = [
    {
      q: `Quanti cantieri sono tracciati in ${regioneNome}?`,
      a: `Attualmente abbiamo ${formatNumber(stats.totale)} cantieri attivi tracciati in ${regioneNome}, distribuiti su ${stats.province} province e ${stats.comuni} Comuni. Il numero cresce ogni settimana con l'importazione automatica dai portali ufficiali.`,
    },
    {
      q: `Come posso intercettare i nuovi cantieri in ${regioneNome}?`,
      a: `Iscrivendoti gratis al network ItaliaProgettisti puoi attivare alert email personalizzati: ricevi notifiche immediate quando viene pubblicato un nuovo permesso di costruire o una SCIA in ${regioneNome}, filtrabili per provincia, Comune, tipologia e importo.`,
    },
    {
      q: `I dati di ${regioneNome} sono completi?`,
      a: `Stiamo costruendo la copertura Comune per Comune: oggi importiamo dai portali con open data attivo e dagli albi pretori digitali. Se il tuo Comune non e ancora coperto, segnalalo: lo aggiungiamo entro 30 giorni quando i dati sono accessibili.`,
    },
    {
      q: `Posso esportare i cantieri di ${regioneNome} in CSV?`,
      a: `L'esportazione CSV completa con dati committenti, importi dettagliati e contatti professionisti e disponibile con i piani Premium di ItaliaProgettisti, a partire da pochi euro al mese.`,
    },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="container-zen">
        <BreadcrumbCantiere steps={[{ label: 'Regioni', href: '/regioni' }, { label: regioneNome }]} />
        <h1 className="heading-section mb-3">Cantieri edilizi in {regioneNome}</h1>
        <p className="body-default text-muted-foreground mb-10 max-w-2xl">
          {formatNumber(stats.totale)} cantieri attivi tracciati in {regioneNome}, distribuiti su {stats.province} province
          e {stats.comuni} Comuni. Permessi di costruire, SCIA e CILA aggiornati ogni giorno da fonti pubbliche.
        </p>

        <StatsBox
          items={[
            { label: 'Cantieri attivi', value: stats.totale, format: 'number' },
            { label: 'Province coperte', value: stats.province, format: 'number' },
            { label: 'Comuni tracciati', value: stats.comuni, format: 'number' },
            { label: 'Valore opere tracciate', value: stats.importo_totale, format: 'euro' },
          ]}
        />

        {/* TOP CATEGORIE */}
        {stats.top_categorie.length > 0 && (
          <div className="mt-12 rounded-2xl border border-border bg-white p-6">
            <h2 className="text-lg font-semibold mb-1">Categorie di lavori piu frequenti in {regioneNome}</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Distribuzione per tipologia di intervento sui cantieri tracciati.
            </p>
            <BarChart data={stats.top_categorie.map((c) => ({ label: c.categoria, value: c.cnt }))} />
          </div>
        )}

        {/* PROVINCE */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-1">Cantieri per provincia in {regioneNome}</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Seleziona una provincia per esplorare i Comuni e i singoli cantieri pubblicati.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {province.map((p) => (
              <Link
                key={p.provincia}
                href={`/${params.regione}/${provinciaSlug(p.provincia)}`}
                aria-label={`Vedi i cantieri in provincia di ${p.provincia}`}
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
            <div>
              <h2 className="text-xl font-semibold">Ultimi cantieri pubblicati in {regioneNome}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Permessi e SCIA arrivati di recente dagli albi pretori comunali.
              </p>
            </div>
            <Link
              href="/regioni"
              className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              Cambia regione <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recenti.data.map((c) => (
              <CantiereCard key={c.id} cantiere={c} />
            ))}
          </div>
        </div>

        {/* CTA ALERT */}
        <div className="mt-16 rounded-2xl bg-foreground text-background p-8 md:p-10">
          <div className="flex items-start gap-4">
            <Bell className="h-6 w-6 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                Vuoi ricevere ogni nuovo cantiere in {regioneNome}?
              </h2>
              <p className="text-sm md:text-base opacity-80 mb-5 leading-relaxed">
                Attiva gli alert email gratuiti: ricevi una notifica appena viene pubblicato un nuovo permesso di
                costruire, SCIA o bando di gara in {regioneNome}. Filtrabili per provincia, importo e categoria.
              </p>
              <a
                href="https://www.italiaprogettisti.com/register"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-background text-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Iscriviti gratis e attiva gli alert
              </a>
            </div>
          </div>
        </div>

        <FAQ
          title={`Domande frequenti sui cantieri in ${regioneNome}`}
          items={regioneFaq}
        />
      </div>
    </section>
  );
}

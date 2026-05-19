import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, BarChart3, ArrowRight, TrendingUp, MapPin, FileText, Database } from 'lucide-react';
import {
  getCantieriByRegione,
  getGlobalStats,
  getTipoTitoloDistribution,
  getTopCategorie,
} from '@/lib/supabase/queries/cantieri';
import { regioneSlug, formatNumber } from '@/lib/utils';
import BreadcrumbCantiere from '@/components/cantieri/BreadcrumbCantiere';
import StatsBox from '@/components/cantieri/StatsBox';
import BarChart from '@/components/cantieri/BarChart';
import FAQ from '@/components/cantieri/FAQ';
import DividerOrnament from '@/components/cantieri/DividerOrnament';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Statistiche cantieri edilizi in Italia — Dati nazionali aggregati',
  description:
    'Statistiche complete sui cantieri edilizi italiani: distribuzione per regione, tipologia (PDC, SCIA, CILA), categorie lavori e importi. Dati ufficiali aggiornati.',
  alternates: { canonical: '/statistiche' },
};

const statsFaq = [
  {
    q: 'Come vengono calcolate queste statistiche?',
    a: 'Le statistiche sono aggregazioni in tempo reale calcolate sui cantieri pubblici tracciati nel database (PDC, SCIA, CILA da albi pretori e open data PA). I numeri si aggiornano automaticamente ogni ora.',
  },
  {
    q: 'Posso scaricare i dati in CSV?',
    a: 'L\'esportazione completa in CSV con tutti i dati (incluso committenti, importi dettagliati, contatti professionisti) e disponibile con i piani Premium del network ItaliaProgettisti.',
  },
  {
    q: 'Quali fonti contribuiscono al campione nazionale?',
    a: 'Oggi importiamo da: open data Comune di Bologna, portali Maggioli (8 Comuni Piemonte e Lombardia), Comune di Torino, e in espansione settimanale su nuovi territori. Ogni cantiere dichiara la fonte originale.',
  },
  {
    q: 'Posso ottenere statistiche personalizzate per la mia regione o settore?',
    a: 'Si. I piani Premium di ItaliaProgettisti includono dashboard intelligence con filtri custom per territorio, categoria, fascia di importo, periodo temporale, e export programmati.',
  },
];

export default async function StatistichePage() {
  const [stats, regioni, tipi, categorie] = await Promise.all([
    getGlobalStats(),
    getCantieriByRegione(),
    getTipoTitoloDistribution(),
    getTopCategorie(15),
  ]);

  const topRegione = regioni[0];

  return (
    <section className="pt-14 md:pt-20 pb-12 md:pb-16">
      <div className="container-zen">
        <BreadcrumbCantiere steps={[{ label: 'Statistiche nazionali' }]} />

        {/* HEADER */}
        <div className="mb-12 md:mb-16 max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <span aria-hidden="true" className="h-px w-8 bg-foreground/30" />
            Intelligence pubblica
          </p>
          <h1 className="heading-section mb-4 text-balance">Statistiche cantieri edilizi in Italia</h1>
          <p className="body-default text-muted-foreground max-w-2xl">
            Numeri aggregati nazionali su {formatNumber(stats.totale)} cantieri pubblici italiani tracciati nel
            database di Italia Cantieri. Aggiornati in tempo reale, fonti dichiarate.
          </p>
        </div>

        {/* KPI TOP ROW */}
        <StatsBox
          items={[
            { label: 'Cantieri totali', value: stats.totale, format: 'number' },
            { label: 'Regioni coperte', value: stats.regioni, format: 'number' },
            { label: 'Comuni nel database', value: stats.comuni, format: 'number' },
            { label: 'Valore opere tracciate', value: stats.importo_totale, format: 'euro' },
          ]}
        />

        <DividerOrnament variant="label" label="Dashboard" spacing="default" />

        {/*
         * BENTO GRID - dashboard-style:
         *  - 1 grande tile (Top regioni - tutta la riga + colonna sinistra)
         *  - 4 piccoli tile (tipologia titolo, top categorie, top regione, fonte dati)
         */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 auto-rows-min">
          {/* TILE GRANDE: classifica regioni - span 2 colonne, span 2 righe su lg */}
          <div className="bento-tile-feature md:col-span-2 lg:row-span-2 flex flex-col">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <span aria-hidden="true" className="h-px w-6 bg-foreground/30" />
                  Top 20 regioni
                </p>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">Classifica nazionale per volume cantieri</h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  Distribuzione dei cantieri tracciati per regione italiana. Clicca per esplorare province e Comuni.
                </p>
              </div>
              <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-foreground text-background">
                <MapPin className="h-5 w-5" strokeWidth={1.75} />
              </span>
            </div>
            <div className="flex-1">
              <BarChart
                data={regioni.slice(0, 20).map((r) => ({
                  label: r.regione,
                  value: r.cnt,
                  href: `/${regioneSlug(r.regione)}`,
                }))}
              />
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              Clicca su una regione per esplorare province, Comuni e singoli cantieri.
            </p>
          </div>

          {/* TILE: tipologia titolo */}
          <div className="bento-tile">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Tipologia
                </p>
                <h2 className="text-base font-bold tracking-tight">Permessi per titolo</h2>
              </div>
              <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
                <FileText className="h-4 w-4" strokeWidth={1.75} />
              </span>
            </div>
            <BarChart data={tipi.map((t) => ({ label: t.tipo, value: t.cnt }))} />
            <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground/70">PDC</strong> Permesso di Costruire ·{' '}
              <strong className="text-foreground/70">SCIA</strong> Segnalazione Certificata ·{' '}
              <strong className="text-foreground/70">CILA</strong> Comunicazione Inizio Lavori
            </p>
          </div>

          {/* TILE: regione leader (mini-card) */}
          {topRegione && (
            <div className="bento-tile">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Regione leader
                  </p>
                  <h2 className="text-base font-bold tracking-tight">In testa per cantieri</h2>
                </div>
                <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
                  <TrendingUp className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </div>
              <Link
                href={`/${regioneSlug(topRegione.regione)}`}
                className="group block rounded-2xl bg-secondary/50 hover:bg-secondary/80 transition-colors p-5 -mx-2"
              >
                <div className="text-3xl md:text-4xl font-black tracking-tighter tabular-nums">
                  {formatNumber(topRegione.cnt)}
                </div>
                <div className="mt-1.5 text-sm font-medium text-foreground/80">
                  {topRegione.regione}
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-foreground/60 group-hover:text-foreground transition-colors">
                  Esplora la regione
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                </div>
              </Link>
            </div>
          )}

          {/* TILE: top categorie */}
          <div className="bento-tile md:col-span-2 lg:col-span-2">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Categorie
                </p>
                <h2 className="text-base font-bold tracking-tight">Top 15 categorie di lavori</h2>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Le tipologie di intervento piu frequenti nei cantieri italiani.
                </p>
              </div>
              <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
                <BarChart3 className="h-4 w-4" strokeWidth={1.75} />
              </span>
            </div>
            <BarChart data={categorie.map((c) => ({ label: c.categoria, value: c.cnt }))} />
          </div>
        </div>

        <DividerOrnament variant="line" spacing="default" />

        {/* CTA UNLOCK */}
        <div className="relative overflow-hidden rounded-[2rem] border border-foreground/10 bg-secondary p-8 md:p-12">
          <div
            aria-hidden="true"
            className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-foreground/[0.04] blur-3xl pointer-events-none"
          />
          <div className="relative flex items-start gap-5">
            <span className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-foreground text-background">
              <Download className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div className="flex-1 max-w-2xl">
              <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <span aria-hidden="true" className="h-px w-6 bg-foreground/30" />
                Intelligence completa
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight leading-tight">
                Ti servono i dati di dettaglio? Sblocca l&apos;intelligence completa.
              </h2>
              <p className="text-sm md:text-base text-secondary-text mb-7 leading-relaxed">
                Le statistiche pubbliche rappresentano l&apos;informativa minima trasparente garantita dall&apos;Art. 14
                GDPR. Per accedere a dati committenti, importi dettagliati, esportazioni CSV illimitate, alert email e
                dashboard intelligence personalizzata, attiva un piano Premium del network ItaliaProgettisti.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.italiaprogettisti.com/abbonamenti"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <BarChart3 className="h-4 w-4" strokeWidth={2} /> Scopri i piani Premium
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                </a>
                <a
                  href="https://www.italiaprogettisti.com/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 bg-white text-foreground px-6 py-3 text-sm font-semibold transition-all duration-200 hover:border-foreground/40 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Inizia con il piano gratuito
                </a>
              </div>
            </div>
          </div>
        </div>

        <FAQ title="Domande frequenti sulle statistiche" items={statsFaq} />
      </div>
    </section>
  );
}

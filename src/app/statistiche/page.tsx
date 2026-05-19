import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, BarChart3 } from 'lucide-react';
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

  return (
    <section className="py-12 md:py-16">
      <div className="container-zen">
        <BreadcrumbCantiere steps={[{ label: 'Statistiche nazionali' }]} />
        <h1 className="heading-section mb-3">Statistiche cantieri edilizi in Italia</h1>
        <p className="body-default text-muted-foreground mb-10 max-w-2xl">
          Numeri aggregati nazionali su {formatNumber(stats.totale)} cantieri pubblici italiani tracciati nel database
          di Italia Cantieri. Aggiornati in tempo reale, fonti dichiarate.
        </p>

        <StatsBox
          items={[
            { label: 'Cantieri totali', value: stats.totale, format: 'number' },
            { label: 'Regioni coperte', value: stats.regioni, format: 'number' },
            { label: 'Comuni nel database', value: stats.comuni, format: 'number' },
            { label: 'Valore opere tracciate', value: stats.importo_totale, format: 'euro' },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-lg font-semibold mb-1">Distribuzione per tipologia di titolo</h2>
            <p className="text-sm text-muted-foreground mb-4">Quali titoli edilizi vengono pubblicati piu spesso.</p>
            <BarChart data={tipi.map((t) => ({ label: t.tipo, value: t.cnt }))} />
            <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
              <strong>PDC</strong> = Permesso di Costruire · <strong>SCIA</strong> = Segnalazione Certificata di Inizio
              Attivita · <strong>CILA</strong> = Comunicazione Inizio Lavori Asseverata
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-lg font-semibold mb-1">Top 15 categorie di lavori</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Le tipologie di intervento piu frequenti nei cantieri italiani.
            </p>
            <BarChart data={categorie.map((c) => ({ label: c.categoria, value: c.cnt }))} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 mt-6">
          <h2 className="text-lg font-semibold mb-1">Classifica regioni per numero cantieri</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Top 20 regioni italiane ordinate per volume di cantieri tracciati.
          </p>
          <BarChart
            data={regioni.slice(0, 20).map((r) => ({
              label: r.regione,
              value: r.cnt,
              href: `/${regioneSlug(r.regione)}`,
            }))}
          />
          <p className="mt-4 text-xs text-muted-foreground">
            Clicca su una regione per esplorare province, Comuni e singoli cantieri.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-secondary p-6 md:p-8">
          <div className="flex items-start gap-4">
            <Download className="h-6 w-6 text-foreground flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-bold mb-2">
                Ti servono i dati di dettaglio? Sblocca l&apos;intelligence completa.
              </h2>
              <p className="text-sm text-secondary-text mb-5 leading-relaxed max-w-2xl">
                Le statistiche pubbliche rappresentano l&apos;informativa minima trasparente garantita dall&apos;Art. 14
                GDPR. Per accedere a dati committenti, importi dettagliati, esportazioni CSV illimitate, alert email e
                dashboard intelligence personalizzata, attiva un piano Premium del network ItaliaProgettisti.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.italiaprogettisti.com/abbonamenti"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <BarChart3 className="h-4 w-4" /> Scopri i piani Premium
                </a>
                <a
                  href="https://www.italiaprogettisti.com/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 text-foreground px-5 py-2.5 text-sm font-medium hover:bg-white transition-colors"
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

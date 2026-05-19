import type { Metadata } from 'next';
import Link from 'next/link';
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

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Statistiche cantieri edilizi Italia — Italia Cantieri',
  description:
    'Statistiche nazionali sui cantieri edilizi italiani: distribuzione per regione, tipologia (PDC/SCIA/CILA), categorie di lavori.',
  alternates: { canonical: '/statistiche' },
};

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
        <h1 className="heading-section mb-3">Statistiche cantieri edilizi Italia</h1>
        <p className="body-default text-muted-foreground mb-10 max-w-2xl">
          Dati aggregati nazionali sui cantieri edilizi tracciati nel database pubblico di Italia Cantieri.
        </p>

        <StatsBox
          items={[
            { label: 'Cantieri totali', value: stats.totale, format: 'number' },
            { label: 'Regioni', value: stats.regioni, format: 'number' },
            { label: 'Comuni coperti', value: stats.comuni, format: 'number' },
            { label: 'Importo totale', value: stats.importo_totale, format: 'euro' },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Distribuzione per tipologia titolo</h2>
            <BarChart data={tipi.map((t) => ({ label: t.tipo, value: t.cnt }))} />
            <p className="mt-4 text-xs text-muted-foreground">
              PDC = Permesso di Costruire · SCIA = Segnalazione Certificata · CILA = Comunicazione Inizio Lavori
              Asseverata
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-lg font-semibold mb-4">Top 15 categorie di lavori</h2>
            <BarChart data={categorie.map((c) => ({ label: c.categoria, value: c.cnt }))} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Top regioni per numero cantieri</h2>
          <BarChart
            data={regioni.slice(0, 20).map((r) => ({
              label: r.regione,
              value: r.cnt,
              href: `/${regioneSlug(r.regione)}`,
            }))}
          />
          <p className="mt-4 text-xs text-muted-foreground">
            Clicca su una regione per esplorare le sue province e i singoli cantieri.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-secondary p-6">
          <h2 className="text-lg font-semibold mb-2">Vuoi accesso ai dati di dettaglio?</h2>
          <p className="text-sm text-secondary-text mb-4 max-w-2xl">
            I dati visualizzati pubblicamente rappresentano l&apos;informazione minima trasparente garantita dall&apos;Art. 14
            GDPR. Per accesso a dati committenti, importi dettagliati, esportazioni CSV e alert via email, sblocca un
            abbonamento Premium sul network ItaliaProgettisti.
          </p>
          <a
            href="https://www.italiaprogettisti.com/abbonamenti"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium"
          >
            Scopri i piani Premium
          </a>
        </div>
      </div>
    </section>
  );
}

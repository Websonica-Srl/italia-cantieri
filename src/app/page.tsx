import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin, FileText, BarChart3, ShieldCheck, Zap, Users } from 'lucide-react';
import SearchComune from '@/components/cantieri/SearchComune';
import CantiereCard from '@/components/cantieri/CantiereCard';
import StatsBox from '@/components/cantieri/StatsBox';
import FAQ from '@/components/cantieri/FAQ';
import TrustBadges from '@/components/cantieri/TrustBadges';
import { getCantieri, getCantieriByRegione, getGlobalStats } from '@/lib/supabase/queries/cantieri';
import { regioneSlug, formatNumber } from '@/lib/utils';

export const revalidate = 3600; // ISR ogni ora

export const metadata: Metadata = {
  title: 'Italia Cantieri — Sai PRIMA dove si lavora in Italia | Cantieri edilizi e bandi pubblici',
  description:
    'Oltre 5.900 cantieri edilizi attivi in Italia: permessi di costruire, SCIA, CILA e bandi pubblici aggiornati ogni giorno. Intercetta le opere prima dei competitor.',
  alternates: { canonical: '/' },
};

const homepageFaq = [
  {
    q: 'Da dove provengono i dati pubblicati su Italia Cantieri?',
    a: 'Esclusivamente da fonti pubbliche italiane: albi pretori dei Comuni, open data della Pubblica Amministrazione (es. Comune di Bologna), portali appalti regionali e ANAC. Non utilizziamo dati privati ne fonti non autorizzate.',
  },
  {
    q: 'Quanto spesso vengono aggiornati i cantieri?',
    a: 'I dati vengono aggiornati quotidianamente. In media importiamo circa 200 nuovi cantieri al mese da Comuni gia coperti e siamo in continua espansione su nuovi territori.',
  },
  {
    q: 'Come posso ottenere i contatti del progettista di un cantiere?',
    a: 'I contatti diretti di progettisti, studi e imprese sono disponibili agli iscritti del network ItaliaProgettisti. La registrazione base e gratuita: ti permette di consultare i profili professionali collegati ai cantieri di tuo interesse.',
  },
  {
    q: 'Italia Cantieri e a pagamento?',
    a: 'La consultazione del database pubblico cantieri e dei bandi e completamente gratuita. Le funzioni avanzate (alert via email, esportazioni CSV, accesso dati committenti, dashboard intelligence) sono incluse nei piani Premium del network ItaliaProgettisti.',
  },
  {
    q: 'Sono il titolare di un cantiere pubblicato. Posso chiedere la rimozione?',
    a: 'Si. In qualsiasi momento puoi richiedere opt-out o rettifica scrivendo al nostro DPO. La valutiamo individualmente entro 30 giorni come previsto dal GDPR (Art. 15-22). Trovi il modulo direttamente nella pagina di ogni cantiere.',
  },
  {
    q: 'Italia Cantieri copre tutta Italia?',
    a: 'Stiamo costruendo la copertura nazionale Comune per Comune. Oggi siamo presenti in 20 regioni, con copertura completa di alcune citta chiave (Bologna, Torino) e in espansione settimanale su Piemonte, Lombardia, Emilia-Romagna e centro Italia.',
  },
];

export default async function HomePage() {
  const [stats, recenti, regioni] = await Promise.all([
    getGlobalStats(),
    getCantieri({ limit: 12, orderBy: 'data_pubblicazione', orderDirection: 'desc' }),
    getCantieriByRegione(),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 md:pb-20 bg-gradient-to-b from-secondary/40 to-background">
        <div className="container-zen text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-background border border-border px-4 py-1.5 text-xs font-medium text-secondary-text mb-6">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} /> Dati pubblici verificati · Aggiornati ogni giorno · GDPR-compliant
          </p>
          <h1 className="heading-hero mb-6 max-w-4xl mx-auto">
            Sai <span className="text-foreground/60">PRIMA</span> dove si lavora in Italia.
          </h1>
          <p className="body-large text-secondary-text max-w-2xl mx-auto mb-10">
            {formatNumber(stats.totale)} cantieri edilizi attivi e bandi pubblici aggregati da albi pretori comunali e
            open data della Pubblica Amministrazione. Intercetta le opere prima dei competitor.
          </p>

          <SearchComune placeholder="Cerca il tuo Comune (es. Milano, Bologna, Torino)..." />

          <div className="mt-6 text-sm text-muted-foreground">
            Citta popolari:{' '}
            <Link href="/comune/milano" className="underline hover:text-foreground transition-colors">Milano</Link>{' · '}
            <Link href="/comune/bologna" className="underline hover:text-foreground transition-colors">Bologna</Link>{' · '}
            <Link href="/comune/torino" className="underline hover:text-foreground transition-colors">Torino</Link>{' · '}
            <Link href="/regioni" className="underline hover:text-foreground transition-colors">esplora tutte le regioni</Link>
          </div>

          <div className="mt-10">
            <TrustBadges variant="row" />
          </div>
        </div>
      </section>

      {/* STATS GLOBALI */}
      <section className="py-12 md:py-16">
        <div className="container-zen">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="heading-section mb-3">Il database pubblico cantieri piu completo d&apos;Italia</h2>
            <p className="text-muted-foreground">
              Numeri reali, dati verificati, fonti dichiarate. Costruito per chi nell&apos;edilizia ci lavora ogni giorno.
            </p>
          </div>
          <StatsBox
            items={[
              { label: 'Cantieri attivi tracciati', value: stats.totale, format: 'number' },
              { label: 'Regioni coperte', value: stats.regioni, format: 'number' },
              { label: 'Comuni nel database', value: stats.comuni, format: 'number' },
              {
                label: 'Valore opere tracciate',
                value: stats.importo_totale,
                format: 'euro',
                helper: 'su cantieri con importo dichiarato',
              },
            ]}
          />
        </div>
      </section>

      {/* RECENTI */}
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="container-zen">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <h2 className="heading-section">Ultimi cantieri pubblicati</h2>
              <p className="text-muted-foreground mt-1">
                {recenti.data.length} permessi e SCIA arrivati di recente dai Comuni italiani.
              </p>
            </div>
            <Link
              href="/statistiche"
              className="text-sm font-medium text-foreground hover:underline inline-flex items-center gap-1"
            >
              Vedi tutte le statistiche <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recenti.data.map((c) => (
              <CantiereCard key={c.id} cantiere={c} />
            ))}
          </div>
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section className="py-16 md:py-20">
        <div className="container-zen">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="heading-section mb-3">Come funziona Italia Cantieri</h2>
            <p className="text-muted-foreground">
              Tre passi semplici per trasformare i dati pubblici in opportunita di lavoro concrete.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-zen p-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-foreground text-lg font-black mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2 text-lg">Cerca il tuo territorio</h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                Filtra cantieri e bandi per Comune, provincia o regione. Esplora i lavori in corso esattamente dove
                operi.
              </p>
            </div>
            <div className="card-zen p-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-foreground text-lg font-black mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2 text-lg">Analizza il cantiere</h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                Visualizza tipologia di titolo (PDC, SCIA, CILA), importo lavori, superficie, categoria e
                geolocalizzazione su mappa.
              </p>
            </div>
            <div className="card-zen p-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-foreground text-lg font-black mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2 text-lg">Sblocca i contatti</h3>
              <p className="text-sm text-secondary-text leading-relaxed">
                Iscriviti gratis su ItaliaProgettisti per accedere ai profili di progettisti, studi e imprese collegati
                al cantiere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* REGIONI */}
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="container-zen">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <h2 className="heading-section">Cantieri edilizi per regione</h2>
              <p className="text-muted-foreground mt-1">
                Esplora i permessi di costruire e i lavori in corso in ciascuna regione italiana.
              </p>
            </div>
            <Link
              href="/regioni"
              className="text-sm font-medium text-foreground hover:underline inline-flex items-center gap-1"
            >
              Vedi tutte le regioni <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {regioni.slice(0, 12).map((r) => (
              <Link
                key={r.regione}
                href={`/${regioneSlug(r.regione)}`}
                className="card-zen card-hover p-5"
                aria-label={`Vedi tutti i cantieri in ${r.regione}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                  <span className="font-semibold">{r.regione}</span>
                </div>
                <div className="text-xs text-muted-foreground">{formatNumber(r.cnt)} cantieri attivi</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16">
        <div className="container-zen max-w-4xl">
          <FAQ
            title="Domande frequenti su Italia Cantieri"
            subtitle="Tutto quello che ti serve sapere su dati, fonti, costi e accesso ai contatti."
            items={homepageFaq}
          />
        </div>
      </section>

      {/* CTA REGISTRAZIONE */}
      <section className="py-16 md:py-24 bg-foreground text-background">
        <div className="container-zen text-center max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-background/10 border border-background/20 px-4 py-1.5 text-xs font-medium mb-6">
            <Users className="h-3.5 w-3.5" /> 8.000+ professionisti gia iscritti al network
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Trasforma i cantieri pubblici in clienti reali.
          </h2>
          <p className="text-lg opacity-80 mb-8 leading-relaxed">
            Sei un progettista, uno studio o un&apos;impresa edile? Iscriviti gratuitamente al network
            ItaliaProgettisti per ricevere alert sui cantieri vicini, sbloccare i contatti dei committenti e farti
            trovare da chi sta progettando le prossime opere.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://www.italiaprogettisti.com/register"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-background text-foreground px-6 py-3 font-medium hover:opacity-90 transition-opacity"
            >
              <Zap className="h-4 w-4" /> Iscriviti gratis a ItaliaProgettisti
            </a>
            <a
              href="https://www.italiaprogettisti.com/abbonamenti"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-background/30 text-background px-6 py-3 font-medium hover:bg-background/10 transition-colors"
            >
              <BarChart3 className="h-4 w-4" /> Scopri i piani Premium
            </a>
          </div>
          <p className="text-xs opacity-60 mt-6">
            Dati provenienti da fonti pubbliche, trattati nel rispetto del GDPR (Art. 6.1.f legittimo interesse).
          </p>
        </div>
      </section>
    </>
  );
}

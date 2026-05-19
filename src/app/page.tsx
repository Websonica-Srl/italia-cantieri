import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, ShieldCheck } from 'lucide-react';
import SearchComune from '@/components/cantieri/SearchComune';
import CantiereCard from '@/components/cantieri/CantiereCard';
import StatsBox from '@/components/cantieri/StatsBox';
import FAQ from '@/components/cantieri/FAQ';
import TrustBadges from '@/components/cantieri/TrustBadges';
import TrustStrip from '@/components/cantieri/TrustStrip';
import IntentSplitCards from '@/components/cantieri/IntentSplitCards';
import IntentSplitCTA from '@/components/cantieri/IntentSplitCTA';
import SectionWrapper from '@/components/cantieri/SectionWrapper';
import DividerOrnament from '@/components/cantieri/DividerOrnament';
import { getCantieri, getCantieriByRegione, getGlobalStats, getKpiStats } from '@/lib/supabase/queries/cantieri';
import { regioneSlug, formatNumber } from '@/lib/utils';
import { HERO_CONSTRUCTION } from '@/lib/images/unsplash';

export const revalidate = 3600; // ISR ogni ora

export const metadata: Metadata = {
  title: 'Italia Cantieri — Sai PRIMA dove si lavora in Italia | Cantieri edilizi e bandi pubblici',
  description:
    'Database cantieri italiano in espansione: oltre 6.500 cantieri tracciati, 38.000 soggetti analizzati e 37.000 imprese e studi nel network. Permessi di costruire, SCIA, CILA e bandi pubblici aggregati settimanalmente da fonti pubbliche.',
  alternates: { canonical: '/' },
};

const homepageFaq = [
  {
    q: 'Da dove provengono i dati pubblicati su Italia Cantieri?',
    a: 'Esclusivamente da fonti pubbliche italiane: albi pretori dei Comuni, open data della Pubblica Amministrazione (es. Comune di Bologna), portali appalti regionali e ANAC. Non utilizziamo dati privati ne fonti non autorizzate.',
  },
  {
    q: 'Quanto spesso vengono aggiornati i cantieri?',
    a: 'I dati vengono aggiornati settimanalmente dalle fonti pubbliche (albi pretori comunali, portali Maggioli, open data PA). In media importiamo circa +200 nuovi cantieri al mese da Comuni gia coperti e siamo in continua espansione su nuovi territori.',
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
  const [stats, kpi, recenti, regioni] = await Promise.all([
    getGlobalStats(),
    getKpiStats(),
    getCantieri({ limit: 12, orderBy: 'data_pubblicazione', orderDirection: 'desc' }),
    getCantieriByRegione(),
  ]);

  return (
    <>
      {/* HERO — cinematic, sfondo cantiere italiano (Unsplash) */}
      <section
        className="hero-grid relative overflow-hidden isolate"
        style={{ minHeight: 'clamp(560px, 78vh, 820px)' }}
        aria-labelledby="hero-heading"
      >
        {/* Background image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src={HERO_CONSTRUCTION.src}
            alt={HERO_CONSTRUCTION.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center ken-burns"
          />
        </div>
        {/* Overlay scuro cinematic per leggibilità testo bianco */}
        <div aria-hidden="true" className="hero-overlay absolute inset-0 -z-10" />

        <div className="container-zen relative h-full flex flex-col justify-end pt-28 md:pt-36 pb-16 md:pb-24">
          <div className="max-w-3xl">
            <p className="eyebrow eyebrow-light mb-6">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
              <span>Dati pubblici · Aggiornati settimanalmente · GDPR</span>
            </p>
            <h1 id="hero-heading" className="heading-cinematic text-white mb-6">
              Sai{' '}
              <span className="text-white/60 italic font-extrabold">prima</span>
              <br className="hidden sm:block" />
              dove si lavora in Italia.
            </h1>
            <p className="body-large text-white/85 max-w-2xl mb-10">
              <span className="stat-display text-white text-3xl md:text-4xl mr-1.5">
                {formatNumber(stats.totale)}
              </span>
              cantieri edilizi e bandi pubblici aggregati settimanalmente da albi pretori
              comunali e open data della PA. Intercetta le opere prima dei competitor.
            </p>

            <div className="rounded-3xl bg-background/95 backdrop-blur-md p-2 md:p-3 ring-1 ring-foreground/5 shadow-2xl">
              <SearchComune placeholder="Cerca il tuo Comune (es. Milano, Bologna, Torino)..." />
            </div>

            <div className="mt-6 text-sm text-white/75">
              Citta popolari:{' '}
              <Link href="/comune/milano" className="text-white underline-offset-4 hover:underline transition-colors">Milano</Link>{' · '}
              <Link href="/comune/bologna" className="text-white underline-offset-4 hover:underline transition-colors">Bologna</Link>{' · '}
              <Link href="/comune/torino" className="text-white underline-offset-4 hover:underline transition-colors">Torino</Link>{' · '}
              <Link href="/regioni" className="text-white underline-offset-4 hover:underline transition-colors">tutte le regioni</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges in barra separata, sfondo neutro */}
      <section className="border-y border-border bg-background/95">
        <div className="container-zen py-6">
          <TrustBadges variant="row" />
        </div>
      </section>

      {/* TRUST STRIP - social proof quantitativo above-fold (numeri LIVE dal DB) */}
      <TrustStrip
        totaleCantieri={kpi.cantieri}
        totaleSoggetti={kpi.soggetti}
        totaleFirms={kpi.firms}
      />

      {/* STATS GLOBALI - vertical rhythm coerente con SectionWrapper */}
      <SectionWrapper
        id="stats"
        spacing="compact"
        align="center"
        eyebrow="Numeri verificati"
        title="Il database pubblico cantieri piu completo d'Italia"
        subtitle="Numeri reali, dati verificati, fonti dichiarate. Costruito per chi nell'edilizia ci lavora ogni giorno."
        headerMaxW="lg"
      >
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
      </SectionWrapper>

      {/* INTENT-SPLIT CARDS (R7 HIGH) - subito sotto stats per orientare il visitatore */}
      <IntentSplitCards />

      <DividerOrnament variant="dots" spacing="tight" />

      {/* RECENTI - rhythm aumentato, action pill premium */}
      <SectionWrapper
        spacing="compact"
        tone="muted"
        eyebrow="Aggiornamenti recenti"
        title="Ultimi cantieri pubblicati"
        subtitle={`${recenti.data.length} permessi e SCIA arrivati di recente dai Comuni italiani.`}
        action={
          <Link
            href="/statistiche"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground rounded-full border border-border bg-white px-5 py-2.5 transition-all hover:border-foreground/30 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Vedi tutte le statistiche
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </Link>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {recenti.data.map((c) => (
            <CantiereCard key={c.id} cantiere={c} />
          ))}
        </div>
      </SectionWrapper>

      {/* COME FUNZIONA - card con step number "ghost" tipografico (anti-3-card-generic) */}
      <SectionWrapper
        spacing="default"
        align="center"
        eyebrow="Come funziona"
        title="Tre passi per trasformare i dati pubblici in opportunita"
        subtitle="Dalla ricerca territoriale all'attivazione del contatto diretto. Tutto in un flusso lineare."
        headerMaxW="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
          {[
            {
              step: '01',
              title: 'Cerca il tuo territorio',
              body:
                'Filtra cantieri e bandi per Comune, provincia o regione. Esplora i lavori in corso esattamente dove operi.',
            },
            {
              step: '02',
              title: 'Analizza il cantiere',
              body:
                'Visualizza tipologia di titolo (PDC, SCIA, CILA), importo lavori, superficie, categoria e geolocalizzazione su mappa.',
            },
            {
              step: '03',
              title: 'Sblocca i contatti',
              body:
                'Iscriviti gratis su ItaliaProgettisti per accedere ai profili di progettisti, studi e imprese collegati al cantiere.',
            },
          ].map((s) => (
            <div
              key={s.step}
              className="card-zen card-hover-premium p-6 md:p-8 group"
            >
              <div className="mb-6 flex items-baseline gap-4">
                <span className="text-5xl md:text-6xl font-black leading-none tracking-tighter text-foreground/12 tabular-nums select-none">
                  {s.step}
                </span>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-border group-hover:bg-foreground/30 transition-colors duration-300"
                />
              </div>
              <h3 className="font-bold mb-3 text-xl tracking-tight">{s.title}</h3>
              <p className="text-sm text-secondary-text leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* REGIONI - card con arrow-on-hover reveal */}
      <SectionWrapper
        spacing="compact"
        tone="muted"
        eyebrow="Esplora il territorio"
        title="Cantieri edilizi per regione"
        subtitle="Permessi di costruire, SCIA e CILA aggiornati ogni giorno da fonti pubbliche."
        action={
          <Link
            href="/regioni"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground rounded-full border border-border bg-white px-5 py-2.5 transition-all hover:border-foreground/30 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Vedi tutte le regioni
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </Link>
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {regioni.slice(0, 12).map((r) => (
            <Link
              key={r.regione}
              href={`/${regioneSlug(r.regione)}`}
              className="group card-zen card-hover-premium p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Vedi tutti i cantieri in ${r.regione}`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin
                    className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors"
                    strokeWidth={1.5}
                  />
                  <span className="font-semibold truncate group-hover:text-foreground transition-colors">
                    {r.regione}
                  </span>
                </div>
                <ArrowRight
                  className="h-3 w-3 flex-shrink-0 text-muted-foreground/50 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-foreground"
                  strokeWidth={2}
                />
              </div>
              <div className="text-xs text-muted-foreground tabular-nums">{formatNumber(r.cnt)} cantieri attivi</div>
            </Link>
          ))}
        </div>
      </SectionWrapper>

      {/* FAQ - spacing aumentato per ritmo */}
      <section className="py-16 md:py-24">
        <div className="container-zen max-w-4xl">
          <FAQ
            title="Domande frequenti su Italia Cantieri"
            subtitle="Tutto quello che ti serve sapere su dati, fonti, costi e accesso ai contatti."
            items={homepageFaq}
          />
        </div>
      </section>

      {/* R5 HIGH: CTA REGISTRAZIONE - DIVISO IMPRESA vs STUDIO */}
      <IntentSplitCTA />
    </>
  );
}

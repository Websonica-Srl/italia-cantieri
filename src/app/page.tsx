import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin, ShieldCheck } from 'lucide-react';
import SearchComune from '@/components/cantieri/SearchComune';
import CantiereCard from '@/components/cantieri/CantiereCard';
import FAQ from '@/components/cantieri/FAQ';
import IntentSplitCards from '@/components/cantieri/IntentSplitCards';
import SectionWrapper from '@/components/cantieri/SectionWrapper';
import {
  getCantieri,
  getCantieriRegioniCached,
  getGlobalStats,
} from '@/lib/supabase/queries/cantieri';
import { regioneSlug, formatNumber } from '@/lib/utils';
import { ogImageUrl, howToLd, safeJsonLd } from '@/lib/seo/structured-data';

export const revalidate = 3600; // ISR ogni ora

export const metadata: Metadata = {
  title: 'Italia Cantieri — Sai chi lavora dove | Cantieri edilizi e permessi italiani',
  description:
    'Permessi, cantieri e opere sul territorio, con il dato che conta: chi sta già lavorando lì, con che frequenza e dove c\'è spazio per te. Decine di migliaia di cantieri tracciati da fonti pubbliche (albi pretori, open data PA). Consultazione gratuita.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Italia Cantieri — Sai chi lavora dove in Italia',
    description:
      'Database pubblico di cantieri edilizi, permessi di costruire (PDC, SCIA, CILA) e bandi di gara italiani. Aggiornato ogni settimana da albi pretori e open data PA.',
    url: '/',
    type: 'website',
    images: [
      {
        url: ogImageUrl({
          title: 'Sai chi lavora dove in Italia',
          subtitle: 'Database pubblico di cantieri edilizi, PDC, SCIA, CILA e bandi di gara',
          kind: 'generic',
        }),
        width: 1200,
        height: 630,
        alt: 'Italia Cantieri — database pubblico cantieri edilizi italiani',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Italia Cantieri — Sai chi lavora dove in Italia',
    description:
      'Database pubblico di cantieri edilizi italiani: PDC, SCIA, CILA e bandi pubblici aggiornati ogni settimana.',
    images: [
      ogImageUrl({
        title: 'Sai chi lavora dove in Italia',
        subtitle: 'Database pubblico di cantieri edilizi e bandi di gara',
        kind: 'generic',
      }),
    ],
  },
};

// HowTo schema (HIGH-3 featured snippet) per "Come funziona Italia Cantieri"
const homeHowTo = howToLd(
  'Come funziona Italia Cantieri',
  'Dai dati pubblici a una decisione su dove cercare lavoro, in tre passi.',
  [
    {
      name: 'Leggi il territorio',
      text: 'Filtra permessi e cantieri per Comune, provincia o regione. Vedi dove si concentrano i lavori, non solo i singoli indirizzi.',
    },
    {
      name: 'Capisci il segnale',
      text: 'Per ogni cantiere: tipo di titolo (PDC, SCIA, CILA), importo lavori se dichiarato, categoria e zona. Tre permessi vicini della stessa tipologia ti dicono che lì c\'è movimento.',
    },
    {
      name: 'Arriva prima degli altri',
      text: 'Attiva il radar sulla rete ItaliaProgettisti: ti avvisa quando si apre un cantiere nella tua zona, prima che lo vedano tutti.',
    },
  ],
);

const homepageFaq = [
  {
    q: 'Da dove arrivano i dati?',
    a: 'Da fonti pubbliche italiane: albi pretori dei Comuni, open data della Pubblica Amministrazione, portali appalti regionali e ANAC. Solo fonti pubbliche, dichiarate su ogni scheda.',
  },
  {
    q: 'Quanto spesso si aggiornano i cantieri?',
    a: 'Ogni settimana dalle fonti pubbliche.',
  },
  {
    q: 'Costa?',
    a: 'Consultare i cantieri pubblici è gratis. Gli strumenti avanzati (radar sui nuovi permessi della tua zona, statistiche di dettaglio, profili professionali collegati) sono inclusi nei piani della rete ItaliaProgettisti.',
  },
  {
    q: 'Cosa significano PDC, SCIA e CILA?',
    a: 'PDC è il Permesso di Costruire (interventi rilevanti, autorizzazione preventiva). SCIA è la Segnalazione Certificata di Inizio Attività (interventi minori, asseverata). CILA è la Comunicazione Inizio Lavori Asseverata (manutenzione straordinaria con asseverazione tecnica).',
  },
  {
    q: 'Sono il titolare di un cantiere. Posso chiedere la rimozione?',
    a: 'Sì. In qualsiasi momento puoi richiedere opt-out o rettifica. Trovi il modulo in ogni scheda cantiere; valutiamo entro 30 giorni come previsto dal GDPR (Art. 15-22).',
  },
];

export default async function HomePage() {
  const [stats, recenti, regioni] = await Promise.all([
    getGlobalStats(),
    getCantieri({ limit: 6, orderBy: 'data_pubblicazione', orderDirection: 'desc' }),
    getCantieriRegioniCached(),
  ]);

  // La cache stats esclude già il placeholder "Italia" e i count a zero:
  // mostriamo solo quello che esiste davvero, niente card "in arrivo".
  const regioniReali = regioni;

  return (
    <>
      {/* HowTo schema per featured snippet "Come funziona Italia Cantieri" */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(homeHowTo) }}
      />
      {/*
        FEATURED SNIPPET ANSWER BOX (HIGH-3): risposta DIRETTA in posizione SR-only ma indicizzata.
        AI Overview / Google snippet preferiscono frase fattuale all'inizio del DOM.
      */}
      <p className="sr-only">
        Italia Cantieri è il database pubblico dei cantieri edilizi italiani: raccoglie {formatNumber(stats.totale)} cantieri da {stats.comuni} Comuni e {stats.regioni} regioni, aggiornati settimanalmente da albi pretori e open data della Pubblica Amministrazione. Permessi di costruire (PDC), SCIA, CILA e bandi di gara consultabili gratuitamente, con fonte dichiarata su ogni scheda e base legale GDPR esplicita (Art. 6, par. 1, lett. f)).
      </p>
      {/*
        HERO MINIMAL HUB-ALIGNED — sfondo cream, NO immagine background,
        tipografia GIGANTE centrata su chiaro, KPI inline, due CTA pill.
        Coerente con italiaprogettisti.com.
      */}
      <section
        className="relative bg-background pt-32 pb-20 md:pt-44 md:pb-32"
        aria-labelledby="hero-heading"
      >
        <div className="container-zen">
          <div className="max-w-5xl mx-auto text-center">
            {/* Eyebrow editorial discreto */}
            <p className="mb-10 inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
              <span>Cantieri e permessi sul territorio · Fonti pubbliche (albi pretori, open data PA) · GDPR</span>
            </p>

            {/* Display headline GIGANTE su cream */}
            <h1
              id="hero-heading"
              className="font-black tracking-[-0.055em] leading-[0.88] text-foreground text-balance"
              style={{ fontSize: 'clamp(2.75rem, 8vw + 0.5rem, 7.5rem)' }}
            >
              Gli altri ti dicono dove si scava.
              <br />
              Noi chi{' '}
              <em className="italic font-black text-construction">lavora</em> dove.
            </h1>

            {/* Sub-headline misurato */}
            <p
              className="mt-10 md:mt-14 text-lg md:text-2xl font-light leading-relaxed text-secondary-text max-w-3xl mx-auto text-pretty"
            >
              Permessi, cantieri e opere sul territorio, con il dato che conta: chi sta già
              lavorando lì, con che frequenza, e dove c&apos;è spazio per te. Circa{' '}
              {formatNumber(stats.totale)} cantieri tracciati da fonti pubbliche.
            </p>

            {/* Search pill su sfondo chiaro */}
            <div className="mt-12 md:mt-16 max-w-2xl mx-auto">
              <SearchComune placeholder="Cerca il tuo Comune (es. Alessandria, Bologna, Moncalieri)..." />
              <p className="mt-5 text-sm text-muted-foreground">
                Comuni più coperti:{' '}
                <Link href="/comune/alessandria" className="text-foreground underline-offset-4 hover:underline transition-colors">Alessandria</Link>
                {' · '}
                <Link href="/comune/moncalieri" className="text-foreground underline-offset-4 hover:underline transition-colors">Moncalieri</Link>
                {' · '}
                <Link href="/comune/bologna" className="text-foreground underline-offset-4 hover:underline transition-colors">Bologna</Link>
                {' · '}
                <Link href="/regioni" className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors">tutte le regioni</Link>
              </p>
            </div>

            {/* CTA pair */}
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/regioni"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Esplora le regioni
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
              <Link
                href="/chi-siamo"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-transparent px-7 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:border-foreground/40 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Come funziona
              </Link>
            </div>

            {/* KPI inline editoriali — linee divider sottili */}
            <div className="mt-20 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8 md:gap-x-12 max-w-5xl mx-auto pt-12 border-t border-border">
              {[
                { value: formatNumber(stats.totale), label: 'Cantieri tracciati' },
                { value: formatNumber(stats.regioni), label: 'Regioni coperte' },
                { value: formatNumber(stats.comuni), label: 'Comuni coperti' },
                { value: 'GDPR', label: 'Solo dati pubblici' },
              ].map((k) => (
                <div key={k.label} className="text-center">
                  <div
                    className="font-black tracking-[-0.05em] leading-none tabular-nums text-foreground"
                    style={{ fontSize: 'clamp(2rem, 3.5vw + 0.5rem, 3.75rem)' }}
                  >
                    {k.value}
                  </div>
                  <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {k.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INTENT-SPLIT CARDS — line-art editorial, no foto stock */}
      <IntentSplitCards />

      {/*
        REGIONI - SOLO regioni con count > 0.
        Layout editoriale lineare: 1 colonna mobile, 3 colonne desktop.
        Card pulite con numero grande + nome regione. No foto, no placeholder.
      */}
      <SectionWrapper
        spacing="default"
        tone="muted"
        eyebrow="Esplora il territorio"
        title="Dove si lavora, regione per regione"
        subtitle={`Oggi tracciamo cantieri in ${regioniReali.length} regioni, Comune per Comune.`}
        action={
          <Link
            href="/regioni"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground rounded-full border border-border bg-white pl-5 pr-2 py-1.5 transition-all hover:border-foreground/30 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Vedi tutte le regioni
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground/5 transition-all duration-300 group-hover:bg-foreground group-hover:text-background group-hover:translate-x-0.5">
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
          </Link>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {regioniReali.map((r) => (
            <Link
              key={r.regione}
              href={`/${regioneSlug(r.regione)}`}
              className="group relative bg-white border border-border rounded-3xl p-7 md:p-8 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-foreground/30 hover:shadow-[0_18px_40px_-18px_rgba(17,17,17,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Vedi tutti i cantieri in ${r.regione}`}
            >
              <div className="flex items-start justify-between gap-3 mb-6">
                <MapPin
                  className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors"
                  strokeWidth={1.5}
                />
                <ArrowRight
                  className="h-4 w-4 flex-shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-foreground"
                  strokeWidth={2}
                />
              </div>
              <div
                className="font-black tracking-[-0.05em] leading-none tabular-nums text-foreground mb-3"
                style={{ fontSize: 'clamp(2.5rem, 3vw + 1rem, 3.75rem)' }}
              >
                {formatNumber(r.cnt)}
              </div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
                cantieri tracciati
              </div>
              <div className="font-bold text-lg md:text-xl tracking-[-0.02em] text-foreground">
                {r.regione}
              </div>
            </Link>
          ))}
        </div>
      </SectionWrapper>

      {/*
        COME FUNZIONA — editorial pattern: numerazione 01/02/03 grande ghost +
        linea verticale divider tra step (visual rhythm). Skill: impeccable.
      */}
      <SectionWrapper
        spacing="default"
        align="center"
        eyebrow="Come funziona"
        title="Dai dati pubblici a una decisione su dove cercare lavoro"
        subtitle="Un cantiere isolato e un punto. Migliaia di cantieri, letti insieme, sono una mappa della domanda."
        headerMaxW="lg"
      >
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0">
          {[
            {
              step: '01',
              title: 'Leggi il territorio',
              body:
                'Filtra permessi e cantieri per Comune, provincia o regione. Vedi dove si concentrano i lavori, non solo i singoli indirizzi.',
            },
            {
              step: '02',
              title: 'Capisci il segnale',
              body:
                'Per ogni cantiere: tipo di titolo (PDC, SCIA, CILA), importo lavori se dichiarato, categoria e zona. Tre permessi vicini della stessa tipologia ti dicono che lì c\'è movimento.',
            },
            {
              step: '03',
              title: 'Arriva prima degli altri',
              body:
                'Attiva il radar sulla rete ItaliaProgettisti: ti avvisa quando si apre un cantiere nella tua zona, prima che lo vedano tutti.',
            },
          ].map((s, i) => (
            <div
              key={s.step}
              className={[
                'group relative p-8 md:p-12 transition-colors duration-500',
                i > 0 ? 'md:border-l border-t md:border-t-0 border-border' : '',
              ].join(' ')}
            >
              <div className="flex items-baseline gap-5 mb-8">
                <span className="ghost-number text-[5rem] md:text-[6.5rem]">{s.step}</span>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-border group-hover:bg-foreground/30 transition-colors duration-500"
                />
              </div>
              <h3 className="font-black mb-4 text-xl md:text-2xl tracking-[-0.025em]">{s.title}</h3>
              <p className="text-[15px] text-secondary-text leading-relaxed text-pretty max-w-sm">{s.body}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* RECENTI - tabella editoriale pulita, sfondo muted */}
      <SectionWrapper
        spacing="default"
        tone="muted"
        eyebrow="Aggiornamenti"
        title="Ultimi cantieri pubblicati"
        subtitle="Permessi e SCIA arrivati di recente dai Comuni italiani."
        action={
          <Link
            href="/statistiche"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground rounded-full border border-border bg-white pl-5 pr-2 py-1.5 transition-all hover:border-foreground/30 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Vedi tutte le statistiche
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground/5 transition-all duration-300 group-hover:bg-foreground group-hover:text-background group-hover:translate-x-0.5">
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
          </Link>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {recenti.data.map((c) => (
            <CantiereCard key={c.id} cantiere={c} />
          ))}
        </div>
      </SectionWrapper>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="container-zen max-w-4xl">
          <FAQ
            title="Domande frequenti su Italia Cantieri"
            subtitle="Dati, fonti, costi e copertura."
            items={homepageFaq}
          />
        </div>
      </section>

      {/*
        CTA FINALE MINIMAL — pattern HUB italiaprogettisti.com:
        sfondo cream pulito, headline grande + 2 CTA pill (impresa / studio).
        Nessun background dark full-bleed, nessuna foto.
      */}
      <section className="py-24 md:py-32 bg-secondary/30 border-t border-border">
        <div className="container-zen">
          <div className="max-w-4xl mx-auto text-center">
            <p className="mb-8 inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              <span aria-hidden="true" className="h-px w-8 bg-foreground/30" />
              <span>Network ItaliaProgettisti</span>
              <span aria-hidden="true" className="h-px w-8 bg-foreground/30" />
            </p>
            <h2
              className="font-black tracking-[-0.04em] leading-[0.95] text-foreground text-balance mb-8"
              style={{ fontSize: 'clamp(2rem, 4vw + 0.5rem, 4.5rem)' }}
            >
              Tu vedi il tuo cantiere.<br className="hidden md:block" /> Noi vediamo dove pulsa il lavoro.
            </h2>
            <p className="text-base md:text-lg text-secondary-text leading-relaxed max-w-2xl mx-auto mb-12">
              Crea un account gratuito sulla rete: radar sui nuovi cantieri della tua zona e
              accesso ai profili professionali collegati. Gratis per iniziare.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href="https://www.italiaprogettisti.com/register?utm_source=italiacantieri&utm_medium=home_cta_final&intent=impresa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Registra la tua impresa
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </a>
              <a
                href="https://www.italiaprogettisti.com/register?utm_source=italiacantieri&utm_medium=home_cta_final&intent=studio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/15 bg-white px-7 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:border-foreground/40 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Registra il tuo studio
              </a>
            </div>
            <p className="mt-10 text-xs text-muted-foreground max-w-xl mx-auto">
              Dati da fonti pubbliche italiane, trattati nel rispetto del GDPR (Art. 6, par. 1, lett. f), legittimo interesse). Solo persone giuridiche.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

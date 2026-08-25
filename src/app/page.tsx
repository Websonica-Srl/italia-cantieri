import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, MapPin, ShieldCheck } from 'lucide-react';
import SearchComune from '@/components/cantieri/SearchComune';
import FAQ from '@/components/cantieri/FAQ';
import IntentSplitCards from '@/components/cantieri/IntentSplitCards';
import SectionWrapper from '@/components/cantieri/SectionWrapper';
import {
  getCantieriRegioniCached,
  getGlobalStats,
} from '@/lib/supabase/queries/cantieri';
import { regioneSlug, formatNumber } from '@/lib/utils';
import { ogImageUrl, howToLd, safeJsonLd } from '@/lib/seo/structured-data';

export const revalidate = 3600; // ISR ogni ora

const HUB_PREZZI_URL =
  'https://www.italiaprogettisti.com/servizio-cantieri?utm_source=italiacantieri&utm_medium=home_prezzi&utm_campaign=attivazione';
const HUB_CTA_FINALE_URL =
  'https://www.italiaprogettisti.com/servizio-cantieri?utm_source=italiacantieri&utm_medium=home_cta_final&utm_campaign=attivazione';

export const metadata: Metadata = {
  title: { absolute: 'Italia Cantieri: titoli edilizi nuovi ogni lunedì' },
  description:
    'Ogni lunedì una selezione fino a 10 titoli edilizi (PDC, SCIA, CILA) della tua provincia o regione, con tipo di intervento, mestieri e stima dei lavori.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Italia Cantieri: titoli edilizi nuovi ogni lunedì',
    description:
      'Ogni lunedì una selezione fino a 10 titoli edilizi (PDC, SCIA, CILA) della tua provincia o regione, con tipo di intervento, mestieri e stima dei lavori.',
    url: '/',
    type: 'website',
    images: [
      {
        url: ogImageUrl({
          title: 'I cantieri della tua zona',
          subtitle: 'Prima che inizino i lavori',
          kind: 'generic',
        }),
        width: 1200,
        height: 630,
        alt: 'Italia Cantieri: titoli edilizi nuovi ogni lunedì',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Italia Cantieri: titoli edilizi nuovi ogni lunedì',
    description:
      'Ogni lunedì una selezione fino a 10 titoli edilizi (PDC, SCIA, CILA) della tua provincia o regione, con tipo di intervento, mestieri e stima dei lavori.',
    images: [
      ogImageUrl({
        title: 'I cantieri della tua zona',
        subtitle: 'Prima che inizino i lavori',
        kind: 'generic',
      }),
    ],
  },
};

// HowTo schema (HIGH-3 featured snippet) per "Come funziona Italia Cantieri"
const homeHowTo = howToLd(
  'Dalla pratica depositata in comune alla tua email',
  'Tre passaggi. Nessun software da imparare, nessun programma da installare.',
  [
    {
      name: 'Leggiamo gli atti pubblici',
      text: 'Albi pretori comunali, portali SUE, open data della pubblica amministrazione. Prendiamo solo atti pubblici e per ogni segnalazione dichiariamo da dove arriva.',
    },
    {
      name: 'Il lunedì ricevi l\'email',
      text: 'Fino a 10 titoli edilizi della zona che hai scelto, provincia o regione, prima quelli del tuo comune. Per ciascuno: comune, tipo di pratica, data di deposito, intervento, destinazione, mestieri interessati e stima dei lavori.',
    },
    {
      name: 'Sblocchi quelli che ti servono',
      text: '1 credito per cantiere. Sbloccato, vedi indirizzo, estremi della pratica, soggetti indicati nell\'atto e link diretto all\'atto pubblico. La scheda arriva anche via email e resta tua.',
    },
  ],
);

const homepageFaq = [
  {
    q: 'Da dove arrivano i dati?',
    a: 'Da albi pretori comunali, portali SUE e open data della pubblica amministrazione. Sono atti pubblici: permessi di costruire, SCIA e CILA depositati in comune. Per ogni segnalazione dichiariamo la fonte, e dopo lo sblocco trovi il link diretto all\'atto.',
  },
  {
    q: 'Mi date i contatti dello studio?',
    a: 'No. Telefono ed email dello studio o del committente non li diamo: quello che pubblichiamo è un atto pubblico, non un contatto commerciale. Nell\'atto c\'è il nome dello studio o del professionista che firma il progetto, e l\'impresa se è indicata. Il contatto lo cerchi e lo fai tu.',
  },
  {
    q: 'Quanto costa?',
    a: 'Cantieri Locali: 149 € al mese oppure 1.490 € all\'anno, una provincia e 30 crediti di sblocco al mese. Cantieri Regionale: 349 € al mese oppure 3.490 € all\'anno, una regione e 100 crediti al mese. Prezzi IVA esclusa, solo per imprese con partita IVA.',
  },
  {
    q: 'La mia provincia è coperta?',
    a: 'Dipende, la copertura non è nazionale. Al 26/08/2026 abbiamo atti in 42 province, e negli ultimi 90 giorni sono arrivati 6.171 titoli da 34 province e 62 comuni. Scrivi la tua provincia nel form: ti diciamo com\'è messa prima di attivare qualsiasi cosa.',
  },
  {
    q: 'Cosa succede quando finisco i crediti?',
    a: 'Puoi acquistarne altri. L\'operatore ti spiega come, al telefono, prima di procedere. I crediti inclusi nell\'abbonamento tornano disponibili ogni mese.',
  },
  {
    q: 'Chi c\'è dietro Italia Cantieri?',
    a: 'Italia Cantieri è un servizio di AZIENDA 365 SRL (P.IVA 02724340746), parte del network Italia Progettisti, che dal 2024 collega progettisti, studi e imprese. Per il servizio cantieri scrivi a cantieri@italiaprogettisti.com.',
  },
];

// Esempio reale: prima settimana di agosto 2026 in provincia di Verona (dati d'archivio).
const esempioVerona = [
  {
    titolo: 'Nuova costruzione: casa singola, 1 unità - Torri del Benaco',
    riga: 'PDC del 04/08/2026, stima lavori 117.000 - 180.000 €',
  },
  {
    titolo: 'Ristrutturazione: casa singola, 1 unità - Torri del Benaco',
    riga: 'PDC del 06/08/2026, stima lavori 90.000 - 135.000 €',
  },
  {
    titolo: 'Ampliamento: ricettivo - Torri del Benaco',
    riga: 'PDC del 04/08/2026, stima lavori 72.000 - 136.000 €',
  },
  {
    titolo: 'Manutenzione straordinaria: commerciale - Verona',
    riga: 'CILA del 02/08/2026, stima lavori 20.000 - 48.000 €, negozio, nuova distribuzione interna',
  },
  {
    titolo: 'Manutenzione straordinaria: residenziale - Verona',
    riga: 'CILA del 01/08/2026, stima lavori 32.000 - 64.000 €, realizzazione bagno',
  },
];

const piani = [
  {
    nome: 'Cantieri Locali',
    prezzoMese: '149 € al mese',
    prezzoAnno: '1.490 € all\'anno (due mesi in omaggio)',
    righe: [
      'Una provincia a scelta, prima i cantieri del tuo comune',
      'Email ogni lunedì con fino a 10 titoli edilizi: PDC, SCIA, CILA',
      '30 crediti di sblocco al mese, 1 credito per cantiere',
      'Scheda sbloccata anche via email, resta tua',
    ],
    inEvidenza: true,
  },
  {
    nome: 'Cantieri Regionale',
    prezzoMese: '349 € al mese',
    prezzoAnno: '3.490 € all\'anno (due mesi in omaggio)',
    righe: [
      'Una regione intera, prima i cantieri del tuo comune',
      'Email ogni lunedì con fino a 10 titoli edilizi: PDC, SCIA, CILA',
      '100 crediti di sblocco al mese, 1 credito per cantiere',
      'Scheda sbloccata anche via email, resta tua',
    ],
    inEvidenza: false,
  },
];

export default async function HomePage() {
  const [stats, regioni] = await Promise.all([
    getGlobalStats(),
    getCantieriRegioniCached(),
  ]);

  // La cache stats esclude già il placeholder "Italia" e i count a zero:
  // mostriamo solo quello che esiste davvero, niente card "in arrivo".
  const regioniReali = regioni;

  const heroSubtitle = `Italia Cantieri raccoglie i titoli edilizi depositati nei comuni: ${formatNumber(stats.totale)} atti in archivio, ${stats.regioni} regioni, ${stats.comuni} comuni. Ogni lunedì ricevi via email fino a 10 nuove pratiche della zona che scegli, prima quelle del tuo comune.`;

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
      <p className="sr-only">{heroSubtitle}</p>
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
              <span>Feed cantieri per imprese edili, serramentisti e impiantisti</span>
            </p>

            {/* Display headline GIGANTE su cream */}
            <h1
              id="hero-heading"
              className="font-black tracking-[-0.055em] leading-[0.88] text-foreground text-balance"
              style={{ fontSize: 'clamp(2.75rem, 8vw + 0.5rem, 7.5rem)' }}
            >
              I cantieri della tua zona,{' '}
              <em className="italic font-black text-construction">prima</em> che inizino i lavori
            </h1>

            {/* Sub-headline misurato */}
            <p
              className="mt-10 md:mt-14 text-lg md:text-2xl font-light leading-relaxed text-secondary-text max-w-3xl mx-auto text-pretty"
            >
              {heroSubtitle}
            </p>

            {/* Search pill su sfondo chiaro */}
            <div className="mt-12 md:mt-16 max-w-2xl mx-auto">
              <SearchComune placeholder="Cerca il tuo Comune (es. Alessandria, Bologna, Moncalieri)..." />
              <p className="mt-5 text-sm text-muted-foreground">
                <Link href="/regioni" className="text-foreground underline-offset-4 hover:underline transition-colors">
                  Vedi le province coperte
                </Link>
              </p>
            </div>

            {/* CTA pair */}
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/per-le-imprese"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Vedi cosa ricevi
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Link>
              <Link
                href="/chi-siamo"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-transparent px-7 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:border-foreground/40 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Chi siamo
              </Link>
            </div>

            {/* KPI inline editoriali — linee divider sottili */}
            <div className="mt-20 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8 md:gap-x-12 max-w-5xl mx-auto pt-12 border-t border-border">
              {[
                { value: formatNumber(stats.totale), label: 'Titoli in archivio' },
                { value: formatNumber(6171), label: 'Ultimi 90 giorni' },
                { value: formatNumber(stats.regioni), label: 'Regioni coperte' },
                { value: formatNumber(stats.comuni), label: 'Comuni con atti' },
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
        title="Dalla pratica depositata in comune alla tua email"
        subtitle="Tre passaggi. Nessun software da imparare, nessun programma da installare."
        headerMaxW="lg"
      >
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0">
          {[
            {
              step: '01',
              title: 'Leggiamo gli atti pubblici',
              body:
                'Albi pretori comunali, portali SUE, open data della pubblica amministrazione. Prendiamo solo atti pubblici e per ogni segnalazione dichiariamo da dove arriva.',
            },
            {
              step: '02',
              title: 'Il lunedì ricevi l\'email',
              body:
                'Fino a 10 titoli edilizi della zona che hai scelto, provincia o regione, prima quelli del tuo comune. Per ciascuno: comune, tipo di pratica, data di deposito, intervento, destinazione, mestieri interessati e stima dei lavori.',
            },
            {
              step: '03',
              title: 'Sblocchi quelli che ti servono',
              body:
                '1 credito per cantiere. Sbloccato, vedi indirizzo, estremi della pratica, soggetti indicati nell\'atto e link diretto all\'atto pubblico. La scheda arriva anche via email e resta tua.',
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

      {/* COSA RICEVI OGNI LUNEDÌ — esempio reale, provincia di Verona (sostituisce la griglia cantieri) */}
      <SectionWrapper
        spacing="default"
        tone="muted"
        eyebrow="Un esempio vero"
        title="Una settimana in provincia di Verona"
        subtitle="Cinque titoli, come li leggi nell'email del lunedì."
        action={
          <Link
            href="/per-le-imprese"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground rounded-full border border-border bg-white pl-5 pr-2 py-1.5 transition-all hover:border-foreground/30 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Come funziona il servizio
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground/5 transition-all duration-300 group-hover:bg-foreground group-hover:text-background group-hover:translate-x-0.5">
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
          </Link>
        }
      >
        <div className="bg-white border border-border rounded-3xl p-7 md:p-10">
          <p className="mb-8 text-sm text-secondary-text leading-relaxed max-w-2xl">
            Questi sono i primi giorni di agosto 2026 in provincia di Verona, presi dal nostro archivio. Nel
            teaser vedi comune, tipo di pratica, data di deposito, intervento e stima dei lavori. L&apos;indirizzo
            no: quello compare dopo lo sblocco.
          </p>
          <div>
            {esempioVerona.map((item, i) => (
              <div
                key={item.titolo}
                className={i > 0 ? 'border-t border-border pt-5 mt-5' : ''}
              >
                <div className="font-bold text-foreground">{item.titolo}</div>
                <div className="mt-1 text-sm text-secondary-text">{item.riga}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-muted-foreground">
            Atti pubblici reali, depositati tra il 01/08/2026 e il 06/08/2026. Dopo lo sblocco vedi indirizzo,
            estremi della pratica, soggetti indicati nell&apos;atto e link diretto al documento del comune. La
            stima dei lavori la calcoliamo noi con l&apos;AI sui dati dell&apos;atto: non è un importo dichiarato.
          </p>
        </div>
      </SectionWrapper>

      {/* PREZZI — due formati, provincia o regione */}
      <SectionWrapper
        spacing="default"
        align="center"
        eyebrow="Abbonamenti"
        title="Due formati: una provincia o una regione"
        subtitle="Prezzi IVA esclusa, riservati alle imprese con partita IVA."
        headerMaxW="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {piani.map((p) => (
            <div
              key={p.nome}
              className="relative bg-white border border-border rounded-3xl p-8 md:p-10 text-left"
            >
              {p.inEvidenza && (
                <span className="absolute top-4 right-4 z-10 inline-flex items-center gap-1 rounded-full bg-foreground text-background px-3 py-1 text-[10px] font-bold uppercase tracking-wide shadow-md">
                  Più scelto
                </span>
              )}
              <div className="font-bold text-lg tracking-[-0.02em] text-foreground mb-4">{p.nome}</div>
              <div
                className="font-black tracking-[-0.05em] leading-none tabular-nums text-foreground"
                style={{ fontSize: 'clamp(2rem, 3.5vw + 0.5rem, 3.75rem)' }}
              >
                {p.prezzoMese}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{p.prezzoAnno}</div>
              <ul className="mt-8 space-y-3">
                {p.righe.map((riga) => (
                  <li key={riga} className="flex items-start gap-2.5 text-sm text-secondary-text leading-relaxed">
                    <Check className="h-4 w-4 flex-shrink-0 mt-0.5 text-foreground" strokeWidth={2} />
                    {riga}
                  </li>
                ))}
              </ul>
              <a
                href={HUB_PREZZI_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground text-background px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Richiedi una richiamata
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </a>
            </div>
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
        sfondo cream pulito, headline grande + CTA pill (richiamata / impresa / studio).
        Nessun background dark full-bleed, nessuna foto.
      */}
      <section className="py-24 md:py-32 bg-secondary/30 border-t border-border">
        <div className="container-zen">
          <div className="max-w-4xl mx-auto text-center">
            <p className="mb-8 inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              <span aria-hidden="true" className="h-px w-8 bg-foreground/30" />
              <span>Attivazione</span>
              <span aria-hidden="true" className="h-px w-8 bg-foreground/30" />
            </p>
            <h2
              className="font-black tracking-[-0.04em] leading-[0.95] text-foreground text-balance mb-8"
              style={{ fontSize: 'clamp(2rem, 4vw + 0.5rem, 4.5rem)' }}
            >
              Lasci il numero, ti richiamiamo noi
            </h2>
            <p className="text-base md:text-lg text-secondary-text leading-relaxed max-w-2xl mx-auto mb-12">
              L&apos;attivazione la facciamo al telefono: ci dici la zona, verifichiamo la copertura e ti
              spieghiamo condizioni e crediti prima di partire.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center items-center">
              <a
                href={HUB_CTA_FINALE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Richiedi una richiamata
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </a>
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
              I dati provengono da atti pubblici della pubblica amministrazione e sono trattati per legittimo
              interesse ai sensi dell&apos;art. 6.1.f del GDPR; il servizio è riservato alle imprese con partita
              IVA.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

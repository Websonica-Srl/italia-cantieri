import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import SearchComune from '@/components/cantieri/SearchComune';
import CantiereCard from '@/components/cantieri/CantiereCard';
import FAQ from '@/components/cantieri/FAQ';
import IntentSplitCards from '@/components/cantieri/IntentSplitCards';
import IntentSplitCTA from '@/components/cantieri/IntentSplitCTA';
import SectionWrapper from '@/components/cantieri/SectionWrapper';
import DividerOrnament from '@/components/cantieri/DividerOrnament';
import { getCantieri, getCantieriByRegione, getGlobalStats, getKpiStats } from '@/lib/supabase/queries/cantieri';
import { regioneSlug, formatNumber, formatEuro } from '@/lib/utils';
import { HERO_CONSTRUCTION, URBAN_RENOVATION } from '@/lib/images/unsplash';

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
    getCantieri({ limit: 9, orderBy: 'data_pubblicazione', orderDirection: 'desc' }),
    getCantieriByRegione(),
  ]);

  // Filtra "Italia" placeholder se presente
  const regioniReali = regioni.filter((r) => r.regione && r.regione.toLowerCase() !== 'italia');
  const regioniDisplay = regioniReali.slice(0, 12);
  const featuredRegione = regioniDisplay[0];
  const restRegioni = regioniDisplay.slice(1);
  // Placeholder card "tutte le altre regioni" se ne mostriamo poche
  const showAddMore = restRegioni.length < 5;

  return (
    <>
      {/*
        HERO FULL-BLEED EDITORIAL — HUB-aligned
        Typography GIGANTE centrato, KPI inline sotto, no card stats separato.
        Pattern skill: high-end-visual-design (Editorial Luxury archetype),
        impeccable (heavy whitespace + display tracking).
      */}
      <section
        className="hero-grid hero-grain relative overflow-hidden isolate -mt-20"
        style={{ minHeight: 'clamp(720px, 100vh, 1024px)' }}
        aria-labelledby="hero-heading"
      >
        {/* Background image full-bleed */}
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
        {/* Overlay full-bleed cinematic */}
        <div aria-hidden="true" className="hero-overlay-fullbleed absolute inset-0 -z-10" />

        <div className="container-zen relative h-full flex flex-col justify-center min-h-[100dvh] pt-36 pb-20 md:pt-44 md:pb-28">
          <div className="max-w-6xl mx-auto text-center">
            {/* Eyebrow editorial */}
            <p className="eyebrow eyebrow-light mb-8 mx-auto animate-reveal-mask" style={{ animationDelay: '120ms' }}>
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
              <span>Database cantieri Italia · Fonti pubbliche · GDPR</span>
            </p>

            {/* Display headline GIGANTE */}
            <h1
              id="hero-heading"
              className="heading-display text-white mb-10 animate-reveal-mask"
              style={{ animationDelay: '200ms' }}
            >
              Sai{' '}
              <em className="italic font-black not-italic-fallback" style={{ color: 'hsl(28 95% 60%)', fontStyle: 'italic' }}>
                prima
              </em>
              <br />
              dove si lavora<br className="md:hidden" /> in Italia.
            </h1>

            {/* Sub-headline elegante */}
            <p
              className="text-lg md:text-2xl text-white/85 font-light leading-relaxed max-w-3xl mx-auto mb-12 md:mb-16 text-pretty animate-reveal-mask"
              style={{ animationDelay: '300ms' }}
            >
              Permessi di costruire, SCIA e bandi pubblici aggregati settimanalmente da
              albi pretori e open data della PA. Intercetta le opere prima dei competitor.
            </p>

            {/* Search hero — pill premium */}
            <div
              className="max-w-3xl mx-auto mb-12 animate-reveal-mask"
              style={{ animationDelay: '400ms' }}
            >
              <div className="rounded-[2rem] bg-background/95 backdrop-blur-md p-2 md:p-2.5 ring-1 ring-foreground/5 shadow-[0_28px_80px_-20px_rgba(0,0,0,0.55)]">
                <SearchComune placeholder="Cerca il tuo Comune (es. Milano, Bologna, Torino)..." />
              </div>
              <div className="mt-5 text-sm text-white/70">
                Citta popolari:{' '}
                <Link href="/comune/milano" className="text-white underline-offset-4 hover:underline transition-colors">Milano</Link>{' · '}
                <Link href="/comune/bologna" className="text-white underline-offset-4 hover:underline transition-colors">Bologna</Link>{' · '}
                <Link href="/comune/torino" className="text-white underline-offset-4 hover:underline transition-colors">Torino</Link>{' · '}
                <Link href="/regioni" className="text-white/80 hover:text-white underline-offset-4 hover:underline transition-colors">tutte le regioni</Link>
              </div>
            </div>

            {/* KPI INLINE sotto hero — pattern HUB italiaprogettisti */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 max-w-5xl mx-auto pt-8 md:pt-12 border-t border-white/15 animate-reveal-mask"
              style={{ animationDelay: '520ms' }}
            >
              {[
                { value: formatNumber(stats.totale), label: 'Cantieri tracciati' },
                { value: formatNumber(kpi.soggetti), label: 'Soggetti analizzati' },
                { value: stats.regioni.toString(), label: 'Regioni coperte' },
                { value: 'GDPR', label: 'Trasparenza piena' },
              ].map((k) => (
                <div key={k.label} className="text-center md:text-left">
                  <div className="kpi-hero text-white">{k.value}</div>
                  <div className="kpi-hero-label text-white/65 mt-3">{k.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INTENT-SPLIT CARDS — line-art editorial, no foto stock */}
      <IntentSplitCards />

      <DividerOrnament variant="dots" spacing="tight" />

      {/* RECENTI - sempre pulito */}
      <SectionWrapper
        spacing="default"
        tone="muted"
        eyebrow="Aggiornamenti recenti"
        title="Ultimi cantieri pubblicati"
        subtitle={`${recenti.data.length} permessi e SCIA arrivati di recente dai Comuni italiani.`}
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

      {/*
        COME FUNZIONA — editorial pattern: numerazione 01/02/03 grande ghost +
        linea verticale divider tra step (visual rhythm). Skill: impeccable.
      */}
      <SectionWrapper
        spacing="default"
        align="center"
        eyebrow="Come funziona"
        title="Tre passi per trasformare i dati pubblici in opportunita"
        subtitle="Dalla ricerca territoriale all'attivazione del contatto diretto. Tutto in un flusso lineare."
        headerMaxW="lg"
      >
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0">
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

      {/*
        REGIONI - bento layout asimmetrico:
        - 1 card FEATURED grande (col-span-2) con immagine architettonica
        - 11 card piccole regione con count + comuni inline + arrow reveal
        Skill: high-end-visual-design (Asymmetrical Bento archetype).
      */}
      <SectionWrapper
        spacing="default"
        tone="muted"
        eyebrow="Esplora il territorio"
        title="Cantieri edilizi per regione"
        subtitle="Permessi di costruire, SCIA e CILA aggiornati ogni giorno da fonti pubbliche."
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {/* FEATURED tile: regione leader con visual */}
          {featuredRegione && (
            <Link
              href={`/${regioneSlug(featuredRegione.regione)}`}
              className="group relative col-span-2 row-span-2 overflow-hidden rounded-[2rem] border border-border bg-foreground text-background transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Esplora ${featuredRegione.regione}`}
            >
              <Image
                src={URBAN_RENOVATION.src}
                alt={URBAN_RENOVATION.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center opacity-30 transition-all duration-700 group-hover:opacity-40 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/95 via-foreground/85 to-foreground/65" />
              <div className="relative flex flex-col justify-between h-full p-7 md:p-10 min-h-[280px]">
                <div>
                  <p className="kpi-hero-label text-background/65 mb-4 inline-flex items-center gap-2">
                    <Sparkles className="h-3 w-3" strokeWidth={1.75} />
                    Regione in testa
                  </p>
                  <div className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[0.85] tabular-nums text-background mb-3">
                    {formatNumber(featuredRegione.cnt)}
                  </div>
                  <p className="text-base md:text-lg text-background/75">cantieri attivi tracciati</p>
                </div>
                <div className="flex items-end justify-between gap-4 mt-8">
                  <h3 className="text-2xl md:text-3xl font-black tracking-[-0.035em]">{featuredRegione.regione}</h3>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-background/15 backdrop-blur-sm transition-all duration-300 group-hover:bg-construction group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-0.5">
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </span>
                </div>
              </div>
            </Link>
          )}
          {restRegioni.map((r) => (
            <Link
              key={r.regione}
              href={`/${regioneSlug(r.regione)}`}
              className="group relative overflow-hidden rounded-3xl border border-border bg-white p-5 md:p-6 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-foreground/30 hover:shadow-[0_18px_40px_-18px_rgba(17,17,17,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Vedi tutti i cantieri in ${r.regione}`}
            >
              <div className="flex items-start justify-between gap-2 mb-4">
                <MapPin
                  className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors"
                  strokeWidth={1.5}
                />
                <ArrowRight
                  className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/50 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-foreground"
                  strokeWidth={2}
                />
              </div>
              <div className="font-bold text-[15px] tracking-tight text-foreground mb-2 line-clamp-1">{r.regione}</div>
              <div className="text-3xl md:text-4xl font-black tracking-[-0.04em] leading-none tabular-nums text-foreground">
                {formatNumber(r.cnt)}
              </div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mt-2">cantieri</div>
            </Link>
          ))}
          {/*
           * Placeholder editorial: regioni in arrivo.
           * Mostra "coverage" piuttosto che lasciare grid vuoto.
           * Skill: redesign-existing-projects (no empty states).
           */}
          {showAddMore && (
            <>
              {['Lombardia', 'Lazio', 'Veneto', 'Toscana', 'Campania', 'Liguria'].map((r) => (
                <div
                  key={r}
                  className="relative overflow-hidden rounded-3xl border border-dashed border-border bg-white/40 p-5 md:p-6"
                  aria-hidden="true"
                >
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <MapPin
                      className="h-4 w-4 flex-shrink-0 text-muted-foreground/40"
                      strokeWidth={1.5}
                    />
                    <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/55 font-semibold">
                      In arrivo
                    </span>
                  </div>
                  <div className="font-bold text-[15px] tracking-tight text-foreground/40 mb-2 line-clamp-1">{r}</div>
                  <div className="text-3xl md:text-4xl font-black tracking-[-0.04em] leading-none tabular-nums text-foreground/25">
                    soon
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/40 mt-2">copertura prossima</div>
                </div>
              ))}
            </>
          )}
        </div>
      </SectionWrapper>

      {/* FAQ - spacing aumentato per ritmo */}
      <section className="py-20 md:py-28">
        <div className="container-zen max-w-4xl">
          <FAQ
            title="Domande frequenti su Italia Cantieri"
            subtitle="Tutto quello che ti serve sapere su dati, fonti, costi e accesso ai contatti."
            items={homepageFaq}
          />
        </div>
      </section>

      {/* CTA architettonica finale HUB-aligned (split immagine + content) */}
      <IntentSplitCTA />
    </>
  );
}

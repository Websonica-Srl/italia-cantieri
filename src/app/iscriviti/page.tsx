import type { Metadata } from 'next';
import Link from 'next/link';
import { HardHat, DraftingCompass, User, ArrowRight, ShieldCheck, Zap, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Iscriviti gratis al network ItaliaProgettisti | Italia Cantieri',
  description:
    'Scegli il percorso più adatto a te: impresa edile, studio di progettazione o professionista. Registrazione gratuita al HUB ItaliaProgettisti in 30 secondi.',
  alternates: { canonical: '/iscriviti' },
  robots: { index: true, follow: true },
};

interface IscriviiPageProps {
  searchParams: { intent?: string; cantiere?: string; comune?: string; from?: string };
}

const UTM_BASE = '?utm_source=italiacantieri&utm_medium=iscriviti_page&utm_campaign=intent_splitter';

const OPTIONS = [
  {
    id: 'impresa',
    icon: HardHat,
    title: 'Sono un&apos;impresa edile',
    titleClean: "Sono un'impresa edile",
    pitch: 'Cerco subappalti, lavori e clienti per la mia impresa.',
    benefits: [
      'Alert email su nuovi cantieri della tua zona',
      'Mappa dei lavori entro 20 km dalla sede',
      'Profilo impresa visibile a 8.000+ progettisti',
      'Esportazione CSV dati committenti',
    ],
    hubPath: 'register',
    hubParams: '&intent=impresa&type=COMPANY',
    cta: 'Registra la mia impresa',
  },
  {
    id: 'studio',
    icon: DraftingCompass,
    title: 'Sono uno studio di progettazione',
    titleClean: 'Sono uno studio di progettazione',
    pitch: 'Cerco nuovi committenti e voglio far conoscere il mio studio.',
    benefits: [
      'Alert su cantieri in fase progettuale',
      '36.000+ committenti potenziali in database',
      'Profilo studio + portfolio digitale pubblicabile',
      'Network di 850+ studi già iscritti',
    ],
    hubPath: 'register',
    hubParams: '&intent=studio&type=STUDIO',
    cta: 'Registra il mio studio',
  },
  {
    id: 'professionista',
    icon: User,
    title: 'Sono un libero professionista',
    titleClean: 'Sono un libero professionista',
    pitch: 'Architetto, ingegnere o geometra che lavora in proprio.',
    benefits: [
      'Profilo personale con specializzazioni',
      'Visibilità nei risultati per Comune e regione',
      'Accesso libero al database cantieri',
      'Magic link per accesso veloce',
    ],
    hubPath: 'register',
    hubParams: '&intent=professionista&type=FREELANCE',
    cta: 'Registrami gratis',
  },
];

export default function IscriviPage({ searchParams }: IscriviiPageProps) {
  const intent = searchParams.intent;
  const cantiere = searchParams.cantiere;
  const comune = searchParams.comune;

  const contextCopy = cantiere
    ? `Stai sbloccando i dati del cantiere ${cantiere}${comune ? ` a ${comune}` : ''}.`
    : intent
      ? `Hai scelto il percorso "${intent}". Confermalo qui sotto.`
      : 'Tre percorsi, un solo network. Scegli il tuo punto di partenza.';

  return (
    <>
      <section className="py-12 md:py-16 bg-gradient-to-b from-secondary/40 to-background">
        <div className="container-zen text-center max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-background border border-border px-4 py-1.5 text-xs font-medium text-secondary-text mb-6">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} /> Registrazione gratuita · Senza carta · 30 secondi
          </span>
          <h1 className="heading-hero mb-5">
            Cosa cerchi su <span className="text-foreground/60">ItaliaProgettisti?</span>
          </h1>
          <p className="body-large text-secondary-text">{contextCopy}</p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container-zen max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isPreselected = intent === opt.id;
              const hubUrl = `https://www.italiaprogettisti.com/${opt.hubPath}${UTM_BASE}${opt.hubParams}${
                cantiere ? `&cantiere=${encodeURIComponent(cantiere)}` : ''
              }${comune ? `&comune=${encodeURIComponent(comune)}` : ''}`;

              return (
                <article
                  key={opt.id}
                  className={`group relative flex flex-col rounded-3xl border-2 bg-white p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    isPreselected ? 'border-foreground shadow-lg' : 'border-border hover:border-foreground/40'
                  }`}
                >
                  {isPreselected && (
                    <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-foreground text-background px-3 py-1 text-[10px] font-bold uppercase tracking-wide">
                      Consigliato per te
                    </span>
                  )}
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background mb-5">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <h2 className="font-bold text-lg md:text-xl mb-2 tracking-tight">{opt.titleClean}</h2>
                  <p className="text-sm text-secondary-text leading-relaxed mb-5">{opt.pitch}</p>
                  <ul className="space-y-2 mb-6 text-sm text-foreground/85 flex-grow">
                    {opt.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-foreground/40 flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={hubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground text-background px-5 py-3 font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={opt.cta}
                  >
                    {opt.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                  </a>
                </article>
              );
            })}
          </div>

          {/* Notify box */}
          <div className="mt-12 rounded-3xl border border-border bg-secondary/40 p-6 md:p-8 max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground/5 flex-shrink-0">
                <Mail className="h-5 w-5 text-foreground" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base md:text-lg mb-1">
                  Non sei sicuro? Resta aggiornato sui nuovi cantieri
                </h3>
                <p className="text-sm text-secondary-text leading-relaxed mb-4">
                  Inserisci la tua email e ti avvisiamo quando il sistema crediti e le funzioni Premium saranno
                  disponibili. Nessun impegno, nessuna carta richiesta.
                </p>
                <form
                  action="https://www.italiaprogettisti.com/register"
                  method="get"
                  target="_blank"
                  className="flex flex-col sm:flex-row gap-2"
                >
                  <input type="hidden" name="utm_source" value="italiacantieri" />
                  <input type="hidden" name="utm_medium" value="iscriviti_notify" />
                  <input type="hidden" name="utm_campaign" value="notify_premium" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="la-tua-email@esempio.it"
                    className="flex-1 rounded-2xl border border-border bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all"
                    aria-label="Inserisci la tua email per ricevere aggiornamenti"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground text-background px-5 py-3 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    Voglio essere avvisato
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Already registered */}
          <p className="text-center text-sm text-muted-foreground mt-10">
            Hai già un account?{' '}
            <a
              href={`https://www.italiaprogettisti.com/login${UTM_BASE}&intent=existing`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Accedi al HUB
            </a>{' '}
            ·{' '}
            <Link
              href="/"
              className="text-foreground font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Torna a Italia Cantieri
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

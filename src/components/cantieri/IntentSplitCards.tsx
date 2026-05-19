import Link from 'next/link';
import { HardHat, DraftingCompass, Eye, ArrowRight } from 'lucide-react';

const CARDS = [
  {
    icon: HardHat,
    title: 'Imprese edili',
    pitch: 'Intercetta subappalti e nuovi cantieri vicini',
    bullets: ['Alert email su nuove SCIA/PDC', 'Mappa lavori entro 20 km'],
    href: '/iscriviti?intent=impresa',
    cta: 'Soluzioni per imprese',
  },
  {
    icon: DraftingCompass,
    title: 'Studi & professionisti',
    pitch: 'Trova committenti in fase progettuale',
    bullets: ['36k+ cantieri attivi', 'Profilo studio + portfolio'],
    href: '/iscriviti?intent=studio',
    cta: 'Soluzioni per studi',
  },
  {
    icon: Eye,
    title: 'Cittadini & curiosi',
    pitch: 'Scopri cosa si costruisce nel tuo quartiere',
    bullets: ['Consultazione 100% gratuita', 'Dati ufficiali PA'],
    href: '/regioni',
    cta: 'Esplora i cantieri',
  },
];

/**
 * R7 HIGH: intent-splitter sulla homepage subito dopo lo stats box.
 * 3 card, 1 per persona, ognuna porta a un percorso diverso.
 */
export default function IntentSplitCards() {
  return (
    <section className="py-12 md:py-16" aria-labelledby="intent-cards-heading">
      <div className="container-zen">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 id="intent-cards-heading" className="heading-section mb-3">
            Per chi è Italia Cantieri?
          </h2>
          <p className="text-muted-foreground">
            Tre percorsi diversi, un solo database. Scegli il tuo punto di partenza.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CARDS.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.title}
                href={c.href}
                className="group relative flex flex-col rounded-3xl border border-border bg-white p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={`${c.cta}: ${c.pitch}`}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-foreground mb-5 transition-colors group-hover:bg-foreground group-hover:text-background">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3 className="font-bold text-lg mb-2 tracking-tight">{c.title}</h3>
                <p className="text-sm text-secondary-text leading-relaxed mb-4 flex-grow">
                  {c.pitch}
                </p>
                <ul className="space-y-1.5 mb-5 text-xs text-muted-foreground">
                  {c.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
                  {c.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

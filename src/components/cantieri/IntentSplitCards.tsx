import Image from 'next/image';
import Link from 'next/link';
import { HardHat, DraftingCompass, Eye, ArrowRight } from 'lucide-react';
import {
  URBAN_CRANE,
  ARCHITECT_BLUEPRINT,
  URBAN_RENOVATION,
} from '@/lib/images/unsplash';

const CARDS = [
  {
    icon: HardHat,
    title: 'Imprese edili',
    pitch: 'Intercetta subappalti e nuovi cantieri vicini',
    bullets: ['Alert email su nuove SCIA/PDC', 'Mappa lavori entro 20 km'],
    href: '/iscriviti?intent=impresa',
    cta: 'Soluzioni per imprese',
    image: URBAN_CRANE,
  },
  {
    icon: DraftingCompass,
    title: 'Studi & professionisti',
    pitch: 'Trova committenti in fase progettuale',
    bullets: ['6.500+ cantieri tracciati', 'Profilo studio + portfolio'],
    href: '/iscriviti?intent=studio',
    cta: 'Soluzioni per studi',
    image: ARCHITECT_BLUEPRINT,
  },
  {
    icon: Eye,
    title: 'Cittadini & curiosi',
    pitch: 'Scopri cosa si costruisce nel tuo quartiere',
    bullets: ['Consultazione 100% gratuita', 'Dati ufficiali PA'],
    href: '/regioni',
    cta: 'Esplora i cantieri',
    image: URBAN_RENOVATION,
  },
];

/**
 * R7 HIGH: intent-splitter sulla homepage subito dopo lo stats box.
 * 3 card con header image differenziata (Unsplash), porta a un percorso diverso.
 */
export default function IntentSplitCards() {
  return (
    <section className="py-16 md:py-24" aria-labelledby="intent-cards-heading">
      <div className="container-zen">
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="eyebrow eyebrow-dark mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-construction" />
            <span>Tre percorsi · Un solo database</span>
          </p>
          <h2 id="intent-cards-heading" className="heading-section mb-3">
            Per chi e Italia Cantieri?
          </h2>
          <p className="body-default text-muted-foreground">
            Scegli il tuo punto di partenza: chiunque lavora nell&apos;edilizia trova
            qui un percorso pensato apposta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARDS.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.title}
                href={c.href}
                className="group relative flex flex-col rounded-3xl border border-border bg-card overflow-hidden shadow-diffusion transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={`${c.cta}: ${c.pitch}`}
              >
                {/* Header image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
                  <Image
                    src={c.image.src}
                    alt={c.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-foreground/15 to-transparent"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-background/95 text-foreground shadow-md backdrop-blur-sm">
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-6 md:p-7">
                  <h3 className="font-bold text-lg md:text-xl mb-2 tracking-tight text-foreground">
                    {c.title}
                  </h3>
                  <p className="text-sm text-secondary-text leading-relaxed mb-5 flex-grow">
                    {c.pitch}
                  </p>
                  <ul className="space-y-1.5 mb-6 text-xs text-muted-foreground">
                    {c.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-construction flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    {c.cta}
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-foreground/5 transition-all duration-300 group-hover:bg-construction group-hover:text-background group-hover:translate-x-0.5">
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

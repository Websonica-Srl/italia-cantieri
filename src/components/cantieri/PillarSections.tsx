/**
 * PillarSections — blocco di rendering riusabile per le pagine pillar
 * (/cantieri/[intervento] e /guide/[slug]).
 *
 * Render, in ordine:
 *  1. h1
 *  2. answer-first in un box citabile (GEO/AEO: risposta diretta per AI Overviews/Perplexity/ChatGPT)
 *  3. sections[] come <section><h2>...
 *  4. children (slot opzionale, es. blocco-dato dei pillar intervento, Task 10)
 *  5. FAQ (componente esistente, con JSON-LD FAQPage)
 *  6. correlati[] come chip-link
 */
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import FAQ from '@/components/cantieri/FAQ';
import type { PillarContent } from '@/lib/content/pillars';

interface Props {
  pillar: PillarContent;
  /** Slot opzionale renderizzato dopo le sections e prima della FAQ (es. blocco-dato). */
  children?: ReactNode;
  /** Se true la FAQ interna non emette il proprio FAQPage JSON-LD: usare quando la pagina emette già faqLd() esplicitamente (evita doppio schema). */
  skipFaqJsonLd?: boolean;
}

export default function PillarSections({ pillar, children, skipFaqJsonLd = false }: Props) {
  return (
    <div className="container-zen section-spacing">
      <header className="max-w-3xl mb-10">
        <h1 className="heading-hero mb-6">{pillar.h1}</h1>

        {pillar.answerFirst && (
          <div className="card-zen p-6 md:p-8 bg-secondary/40">
            <span className="eyebrow mb-3 inline-flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> In sintesi
            </span>
            <p className="body-large text-foreground">{pillar.answerFirst}</p>
          </div>
        )}
      </header>

      {pillar.sections.length > 0 && (
        <div className="max-w-3xl space-y-10 mb-4">
          {pillar.sections.map((s, i) => (
            <section key={i} aria-labelledby={`pillar-section-${i}`}>
              <h2 id={`pillar-section-${i}`} className="heading-section mb-3">
                {s.heading}
              </h2>
              <p className="body-default text-secondary-text whitespace-pre-line">{s.body}</p>
            </section>
          ))}
        </div>
      )}

      {children}

      {pillar.faq.length > 0 && <FAQ items={pillar.faq} skipJsonLd={skipFaqJsonLd} />}

      {pillar.correlati.length > 0 && (
        <nav aria-label="Contenuti correlati" className="mt-10">
          <div className="flex flex-wrap gap-2">
            {pillar.correlati.map((c) => (
              <Link key={c.href} href={c.href} className="chip hover:bg-secondary transition-colors">
                {c.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}

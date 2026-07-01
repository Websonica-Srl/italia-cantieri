import { BellRing, Gift, Network, ArrowRight } from 'lucide-react';
import { hubRegisterUrl } from '@/lib/utils';

interface Scope {
  comune?: string;
  provincia?: string;
  regione?: string;
  intervento?: string;
}

interface Props {
  scope: Scope;
}

/**
 * LEVA A (avviso nuovi cantieri) + LEVA B (bridge co-branding verso HUB).
 * Il satellite e' zero-PII/zero-stato: la CTA punta sempre a hubRegisterUrl,
 * mai a un signup locale.
 */
export default function AlertCantieriCTA({ scope }: Props) {
  const hubUrl = hubRegisterUrl({
    intent: 'alert',
    campaign: 'alert_zona',
    comune: scope.comune,
    provincia: scope.provincia,
    regione: scope.regione,
    intervento: scope.intervento,
  });

  const zonaLabel = scope.comune || scope.provincia || scope.regione || 'questa zona';

  return (
    <section
      aria-labelledby="alert-cantieri-heading"
      className="card-zen shadow-diffusion relative overflow-hidden p-6 md:p-8"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-construction/70 to-transparent"
      />

      {/* LEVA A: value prop avviso */}
      <div className="flex items-center gap-3 mb-2">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground text-background shadow-sm">
          <BellRing className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </div>
        <div>
          <p className="eyebrow eyebrow-construction mb-1.5">
            <span>Avviso nuovi cantieri</span>
          </p>
          <h2 id="alert-cantieri-heading" className="text-base md:text-lg font-bold leading-tight">
            Ricevi i nuovi cantieri di {zonaLabel} appena aprono
          </h2>
        </div>
      </div>
      <p className="text-sm text-secondary-text mb-4 leading-relaxed">
        Niente pubblicita': sai prima degli altri dove c&apos;e' lavoro.
      </p>
      <div className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-construction/25 bg-construction-soft px-4 py-2.5">
        <Gift className="h-4 w-4 text-construction flex-shrink-0" strokeWidth={2} aria-hidden="true" />
        <span className="text-sm font-medium text-foreground">
          1 cantiere completo gratis + digest avvisi sul perimetro che scegli
        </span>
      </div>

      {/* LEVA B: bridge co-branding verso il HUB */}
      <div className="rounded-2xl border border-border bg-secondary/40 px-4 py-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Network className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" strokeWidth={2} aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Network ItaliaProgettisti
          </span>
        </div>
        <p className="text-sm text-secondary-text leading-relaxed mb-2">
          italiacantieri.it fa parte del network ItaliaProgettisti.
        </p>
        <p className="text-sm text-secondary-text leading-relaxed">
          Il tuo accesso ai cantieri di tutta Italia e' gestito da ItaliaProgettisti, la piattaforma
          del network. Completi qui la registrazione gratuita e ricevi subito il tuo cantiere piu'
          gli avvisi.
        </p>
      </div>

      <div className="flex justify-start">
        <a
          href={hubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-sm font-semibold transition-all duration-200 hover:scale-[1.03] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`Attiva gli avvisi gratuiti per i cantieri di ${zonaLabel}`}
        >
          Attiva l&apos;avviso gratis
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
        </a>
      </div>
    </section>
  );
}

import { Hash, TrendingUp, FileDown, BellRing, ArrowRight, ShieldCheck } from 'lucide-react';
import type { CantiereScheda } from '@/lib/supabase/queries/cantieri-scheda';
import { hubRegisterUrl, prepA } from '@/lib/utils';
import { maskCivico } from '@/lib/cantieri/mask';
import { formatValoreRange } from '@websonica/cantieri-core';

interface Props {
  c: CantiereScheda;
}

/**
 * R7: teaser premium conforme. Impacchetta SOLO dati già pubblici in forma
 * più comoda/precisa (civico esatto, forbice di valore stretta, export,
 * alert di zona). Nessun contatto privato (niente titolare/progettista/
 * telefono): sostituisce concettualmente il vecchio DatiPremiumLocked.
 * Il crawler vede la stessa pagina pubblica: zero cloaking.
 */
export default function TeaserPremiumR7({ c }: Props) {
  const hubUrl = hubRegisterUrl({
    intent: 'unlock',
    cantiere: c.slug,
    comune: c.comune,
    provincia: c.provincia,
    campaign: 'unlock_flow',
  });

  const civicoPagina = maskCivico(c.civico) || 'non disponibile';
  const rangeLargo = formatValoreRange(c.valore_min, c.valore_max, c.valore_metodo);
  const rangeInPagina = rangeLargo || 'non stimato';

  const righe = [
    {
      icon: Hash,
      label: 'Civico esatto',
      inPagina: civicoPagina,
      conAccount: 'civico completo',
    },
    {
      icon: TrendingUp,
      label: 'Range di valore',
      inPagina: rangeInPagina,
      conAccount: 'forbice ridotta, più precisa',
    },
    {
      icon: FileDown,
      label: 'Export scheda (PDF/CSV)',
      inPagina: 'non disponibile',
      conAccount: 'scarica in un click',
    },
    {
      icon: BellRing,
      label: 'Alert zona + cantieri simili vicini',
      inPagina: 'non disponibile',
      conAccount: 'avviso automatico + raggio scelto',
    },
  ];

  return (
    <section
      aria-labelledby="teaser-premium-heading"
      className="card-zen shadow-diffusion relative overflow-hidden p-6 md:p-8"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-construction/70 to-transparent"
      />

      <div className="flex items-center gap-3 mb-2">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground text-background shadow-sm">
          <TrendingUp className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </div>
        <div>
          <p className="eyebrow eyebrow-construction mb-1.5">
            <span>Network ItaliaProgettisti</span>
          </p>
          <h2 id="teaser-premium-heading" className="text-base md:text-lg font-bold leading-tight">
            Questi dati pubblici, in versione completa per la tua impresa
          </h2>
        </div>
      </div>
      <p className="text-sm text-secondary-text mb-6 leading-relaxed">
        Sono tutti dati già pubblici (fonte: albo pretorio/PA), qui li trovi in versione ridotta.
        Con un account gratuito li ricevi in forma completa e comoda: utile se cerchi lavori nella
        tua zona come impresa esecutrice, serramentista o impiantista.
      </p>

      <ul className="space-y-3">
        {righe.map((r) => {
          const Icon = r.icon;
          return (
            <li
              key={r.label}
              className="flex flex-col gap-2 rounded-2xl border border-border bg-secondary/40 px-4 py-3 sm:flex-row sm:items-center sm:gap-3 transition-all duration-200 hover:bg-secondary/60"
            >
              <div className="flex items-center gap-3 sm:w-52 flex-shrink-0">
                <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" strokeWidth={1.5} />
                <span className="text-xs md:text-sm text-muted-foreground">{r.label}</span>
              </div>
              <div className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <span className="text-muted-foreground">in pagina: </span>
                <span className="font-medium text-foreground/80">{r.inPagina}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/70 mx-0.5" strokeWidth={2} aria-hidden="true" />
                <span className="text-muted-foreground">con account: </span>
                <span className="font-semibold text-foreground">{r.conAccount}</span>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] text-muted-foreground leading-relaxed max-w-md">
          Nessun contatto privato: qui trovi solo dati pubblici del cantiere, impacchettati in forma
          più precisa e scaricabile. Conformità GDPR garantita.
        </p>
        <a
          href={hubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-sm font-semibold transition-all duration-200 hover:scale-[1.03] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`Registrati gratis per sbloccare i dati completi del cantiere ${prepA(c.comune)}`}
        >
          <ShieldCheck className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          Sblocca gratis
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
        </a>
      </div>
    </section>
  );
}

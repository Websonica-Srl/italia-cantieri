import { Star, Users, Building2, FileText } from 'lucide-react';

interface Props {
  totaleCantieri?: number;
  totaleRegioni?: number;
  totaleComuni?: number;
}

/**
 * R8 (incluso in batch HIGH): trust strip per homepage.
 * Mostra social proof + numeri network ItaliaProgettisti + rating.
 * Numeri sono volutamente conservativi: si possono leggere come "almeno X" o "X+".
 */
export default function TrustStrip({ totaleCantieri, totaleRegioni, totaleComuni }: Props) {
  return (
    <section
      aria-labelledby="trust-strip-heading"
      className="py-12 md:py-14 border-y border-border bg-secondary/20"
    >
      <div className="container-zen">
        <p
          id="trust-strip-heading"
          className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-6 font-semibold"
        >
          Già 850+ studi e imprese si affidano al network ItaliaProgettisti
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Stat
            icon={Users}
            value="8.000+"
            label="Professionisti registrati"
          />
          <Stat
            icon={Building2}
            value="850+"
            label="Studi & imprese attive"
          />
          <Stat
            icon={FileText}
            value={totaleCantieri ? `${(totaleCantieri / 1000).toFixed(0)}k+` : '36k+'}
            label="Cantieri tracciati"
          />
          <Stat
            icon={Star}
            value="4.8/5"
            label="Soddisfazione utenti"
            highlight
          />
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
  highlight = false,
}: {
  icon: typeof Star;
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center text-center transition-transform duration-200 hover:scale-[1.02]">
      <Icon
        className={`h-5 w-5 mb-2 ${highlight ? 'text-foreground fill-foreground' : 'text-foreground/60'}`}
        strokeWidth={highlight ? 0 : 1.75}
      />
      <div className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground tabular-nums">{value}</div>
      <div className="text-xs text-secondary-text mt-1">{label}</div>
    </div>
  );
}

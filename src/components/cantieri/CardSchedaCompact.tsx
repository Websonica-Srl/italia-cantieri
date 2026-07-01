import Link from 'next/link';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import {
  displayInterventoLabel, formatValoreRange, mestiereLabel,
  TITOLO_LABELS, type TipoTitolo,
  type Mestiere,
} from '@websonica/cantieri-core';
import type { CantiereScheda } from '@/lib/supabase/queries/cantieri-scheda';
import { formatDateShort } from '@/lib/utils';

const MAX_MESTIERI = 3;

/** Versione compatta della scheda cantiere per liste/pagine esplora. Nessun civico/indirizzo esatto. */
export default function CardSchedaCompact({ c }: { c: CantiereScheda }) {
  // Etichetta: intervento (scheda) → tipo titolo (SCIA/CILA/PDC…) → generico.
  const interventoLabel = c.intervento_categoria
    ? displayInterventoLabel(c.intervento_categoria)
    : c.tipo_titolo && c.tipo_titolo in TITOLO_LABELS
      ? TITOLO_LABELS[c.tipo_titolo as TipoTitolo]
      : null;
  const data = c.data_rilascio || c.data_pubblicazione;
  const valoreLabel = formatValoreRange(c.valore_min, c.valore_max, c.valore_metodo);
  const mestieri = (c.mestieri as Mestiere[] | null) ?? [];
  const mestieriVisibili = mestieri.slice(0, MAX_MESTIERI);
  const mestieriExtra = mestieri.length - mestieriVisibili.length;

  return (
    <Link href={`/cantiere/${c.slug}`} className="group block card-zen card-hover p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="eyebrow eyebrow-construction">
          {interventoLabel ?? 'Cantiere edilizio'}
        </span>
        {data && (
          <span className="text-xs text-muted-foreground inline-flex items-center gap-1 flex-shrink-0">
            <Calendar className="h-3 w-3" />
            {formatDateShort(data)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="font-medium text-foreground">{c.comune}</span>
        <span>({c.provincia})</span>
      </div>

      {mestieriVisibili.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {mestieriVisibili.map((m) => (
            <span key={m} className="chip">
              {mestiereLabel(m)}
            </span>
          ))}
          {mestieriExtra > 0 && <span className="chip">+{mestieriExtra}</span>}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-xs font-semibold text-foreground">
          {valoreLabel ?? ''}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          Dettagli <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

import Link from 'next/link';
import { MapPin, Radio, type LucideIcon } from 'lucide-react';
import {
  INTERVENTO_META, DESTINAZIONE_META, SCALA_META, TIPOLOGIA_META, SEGNALE_META,
  VALORE_METODO_LABELS, TITOLO_LABELS, TITOLO_GUIDA_SLUG,
  isMeaningful, formatValoreRange,
  type DestinazioneUso, type TipoTitolo,
} from '@websonica/cantieri-core';
import type { CantiereScheda } from '@/lib/supabase/queries/cantieri-scheda';
import { unitaOf, mqOf } from '@/lib/supabase/queries/cantieri-scheda';
import { resolveLucideIcon } from '@/lib/cantieri/resolveLucideIcon';
import { maskCivico } from '@/lib/cantieri/mask';
import { formatDateShort } from '@/lib/utils';

const NF = new Intl.NumberFormat('it-IT');

/** Chiave valida di DESTINAZIONE_META, se la stringa combacia con un enum noto. */
function destinazioneMetaOf(value: string | null | undefined) {
  if (!value) return null;
  return value in DESTINAZIONE_META ? DESTINAZIONE_META[value as DestinazioneUso] : null;
}

/** Chiave valida di TITOLO_LABELS/TITOLO_GUIDA_SLUG, se tipo_titolo combacia con l'enum tipizzato. */
function titoloMetaOf(value: string | null | undefined) {
  if (!value) return null;
  return value in TITOLO_LABELS ? (value as TipoTitolo) : null;
}

interface FactCardProps {
  icon: LucideIcon;
  color?: string;
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  href?: string;
}

function FactCard({ icon: Icon, color, label, value, sub, href }: FactCardProps) {
  const content = (
    <>
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl flex-shrink-0"
          style={{ backgroundColor: color ? `${color}1a` : undefined }}
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} style={color ? { color } : undefined} />
        </span>
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="text-sm font-semibold text-foreground leading-snug">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </>
  );

  const className = 'card-zen p-4' + (href ? ' card-hover' : '');

  if (href) {
    return (
      <Link href={href} className={className + ' block group'}>
        {content}
      </Link>
    );
  }
  return <div className={className}>{content}</div>;
}

/**
 * Griglia di fact-card della scheda cantiere, con degradazione graceful:
 * ogni card compare solo se il dato sottostante è meaningful/non-null.
 * R7: il civico non compare mai in chiaro (vedi maskCivico).
 */
export default function CardScheda({ c }: { c: CantiereScheda }) {
  const cards: React.ReactNode[] = [];

  // Tipo intervento
  if (isMeaningful(c.intervento_categoria)) {
    const meta = INTERVENTO_META[c.intervento_categoria!];
    cards.push(
      <FactCard
        key="intervento"
        icon={resolveLucideIcon(meta.icon)}
        color={meta.color}
        label="Tipo intervento"
        value={meta.label}
      />,
    );
  }

  // Destinazione (con "da X a Y" per cambio destinazione d'uso)
  if (c.intervento_categoria === 'cambio_destinazione' && isMeaningful(c.destinazione_uso_origine)) {
    const origineMeta = destinazioneMetaOf(c.destinazione_uso_origine);
    const destMeta = destinazioneMetaOf(c.destinazione_uso);
    const origineLabel = origineMeta?.label ?? c.destinazione_uso_origine!;
    const destLabel = destMeta?.label ?? c.destinazione_uso ?? '';
    const meta = destMeta ?? origineMeta;
    cards.push(
      <FactCard
        key="destinazione"
        icon={meta ? resolveLucideIcon(meta.icon) : resolveLucideIcon('Repeat')}
        color={meta?.color}
        label="Cambio di destinazione"
        value={destLabel ? `Da ${origineLabel} a ${destLabel}` : `Da ${origineLabel}`}
      />,
    );
  } else if (isMeaningful(c.destinazione_uso)) {
    const meta = DESTINAZIONE_META[c.destinazione_uso as DestinazioneUso];
    cards.push(
      <FactCard
        key="destinazione"
        icon={resolveLucideIcon(meta.icon)}
        color={meta.color}
        label="Destinazione d'uso"
        value={meta.label}
      />,
    );
  }

  // Scala
  if (isMeaningful(c.scala)) {
    const meta = SCALA_META[c.scala as keyof typeof SCALA_META];
    cards.push(
      <FactCard
        key="scala"
        icon={resolveLucideIcon(meta.icon)}
        color={meta.color}
        label="Scala intervento"
        value={meta.label}
      />,
    );
  }

  // Unità abitative
  const unita = unitaOf(c);
  if (unita != null) {
    cards.push(
      <FactCard
        key="unita"
        icon={resolveLucideIcon('Home')}
        label="Unità abitative"
        value={NF.format(unita)}
      />,
    );
  }

  // Superficie
  const mq = mqOf(c);
  if (mq != null) {
    cards.push(
      <FactCard
        key="superficie"
        icon={resolveLucideIcon('Maximize2')}
        label="Superficie"
        value={`${NF.format(mq)} m²`}
      />,
    );
  }

  // Tipologia edilizia
  if (isMeaningful(c.tipologia_edilizia)) {
    const meta = TIPOLOGIA_META[c.tipologia_edilizia as keyof typeof TIPOLOGIA_META];
    cards.push(
      <FactCard
        key="tipologia"
        icon={resolveLucideIcon(meta.icon)}
        color={meta.color}
        label="Tipologia edilizia"
        value={meta.label}
      />,
    );
  }

  // Valore stimato
  const valoreLabel = formatValoreRange(c.valore_min, c.valore_max, c.valore_metodo);
  if (valoreLabel) {
    const metodoLabel = c.valore_metodo ? VALORE_METODO_LABELS[c.valore_metodo] : undefined;
    cards.push(
      <FactCard
        key="valore"
        icon={resolveLucideIcon('BarChart3')}
        label="Valore stimato"
        value={valoreLabel}
        sub={metodoLabel}
      />,
    );
  }

  // Titolo edilizio (link a guida se disponibile)
  const titolo = titoloMetaOf(c.tipo_titolo);
  if (titolo) {
    const guidaSlug = TITOLO_GUIDA_SLUG[titolo];
    cards.push(
      <FactCard
        key="titolo"
        icon={resolveLucideIcon('FileText')}
        label="Titolo edilizio"
        value={
          guidaSlug ? (
            <span className="inline-flex items-center gap-1 group-hover:underline">
              {TITOLO_LABELS[titolo]}
            </span>
          ) : (
            TITOLO_LABELS[titolo]
          )
        }
        sub={guidaSlug ? 'Guida normativa →' : undefined}
        href={guidaSlug ? `/guide/${guidaSlug}` : undefined}
      />,
    );
  }

  // Segnale + forza
  if (isMeaningful(c.segnale_tipo)) {
    const meta = SEGNALE_META[c.segnale_tipo as keyof typeof SEGNALE_META];
    cards.push(
      <FactCard
        key="segnale"
        icon={resolveLucideIcon(meta.icon)}
        color={meta.color}
        label="Segnale"
        value={meta.label}
        sub={
          c.segnale_forza != null ? (
            <span className="inline-flex items-center gap-1.5">
              <Radio className="h-3 w-3" strokeWidth={1.75} />
              Affidabilità {NF.format(c.segnale_forza)}%
            </span>
          ) : undefined
        }
      />,
    );
  }

  // Data (pubblicazione o rilascio)
  const data = c.data_rilascio || c.data_pubblicazione;
  if (data) {
    cards.push(
      <FactCard
        key="data"
        icon={resolveLucideIcon('FileCheck2')}
        label="Data"
        value={formatDateShort(data)}
      />,
    );
  }

  // Localizzazione (civico SEMPRE mascherato, R7)
  const civicoMasked = maskCivico(c.civico_norm);
  const indirizzoParte = c.indirizzo_norm
    ? `${c.indirizzo_norm}${civicoMasked ? `, ${civicoMasked}` : ''} — `
    : '';
  cards.push(
    <FactCard
      key="localizzazione"
      icon={MapPin}
      label="Localizzazione"
      value={`${indirizzoParte}${c.comune} (${c.provincia})`}
    />,
  );

  if (cards.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {cards}
    </div>
  );
}

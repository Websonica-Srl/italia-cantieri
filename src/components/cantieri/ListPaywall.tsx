// Server Component: nessuna interattivita' client (blur = CSS, CTA = link).
// NON marcare 'use client': la pagina server /esplora passa renderCard/keyOf
// (funzioni) come props, cosa vietata verso i Client Component.
import { Lock, ArrowRight } from 'lucide-react';
import { formatNumber, hubRegisterUrl } from '@/lib/utils';

interface Props<T> {
  /** Elementi della pagina/sezione corrente (gia' impaginati a monte). */
  items: T[];
  /**
   * Numero TOTALE di elementi disponibili per il contesto (per la copy della
   * CTA "vedi tutti i {N}"). Se omesso usa la lunghezza della lista.
   */
  total?: number;
  /** Card nitide leggibili in testa (default 6). */
  previewCount?: number;
  /** Cap massimo di card sfocate mostrate sotto la preview (default 6). */
  blurCount?: number;
  /** Classi della griglia che avvolge le card (deve combaciare col layout host). */
  gridClassName?: string;
  /** URL della CTA di sblocco. Default: registrazione HUB con intent 'esplora'. */
  unlockHref?: string;
  /** Testo del link CTA. */
  unlockLabel?: string;
  /** Render-prop per la singola card. */
  renderCard: (item: T) => React.ReactNode;
  /** Chiave React univoca per elemento. */
  keyOf: (item: T) => string;
}

/**
 * Soft-paywall generico per LISTE (griglie di card, non tabelle), parametrizzato
 * per tipo via `renderCard`/`keyOf`. Generalizzazione di BandiListPaywall
 * (gemello italia-bandi) per essere riusabile su /esplora con CardSchedaCompact.
 *
 * Le prime `previewCount` card sono nitide e navigabili; le successive (fino a
 * `blurCount`) restano nell'HTML per l'indicizzazione SEO ma sono sfocate
 * (blur + select-none + pointer-events-none + aria-hidden) con un overlay CTA
 * che porta alla registrazione gratuita sull'HUB. Se gli elementi totali sono
 * <= previewCount, nessun blur/overlay: mostra tutto.
 *
 * Accessibilita': la zona sfocata e' aria-hidden e non contiene link cliccabili
 * (avvolta in pointer-events-none); la CTA dell'overlay e' un vero link focusabile.
 */
export default function ListPaywall<T>({
  items,
  total,
  previewCount = 6,
  blurCount = 6,
  gridClassName = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5',
  unlockHref,
  unlockLabel = 'Iscriviti gratis e sblocca tutti i cantieri',
  renderCard,
  keyOf,
}: Props<T>) {
  if (items.length === 0) return null;

  const clearItems = items.slice(0, previewCount);
  const lockedItems = items.slice(previewCount, previewCount + blurCount);
  const hasLocked = lockedItems.length > 0;

  // Conteggio mostrato nella CTA: il totale del contesto se noto, altrimenti la
  // lunghezza della lista corrente.
  const totalCount = typeof total === 'number' ? total : items.length;

  const href = unlockHref || hubRegisterUrl({ intent: 'esplora', campaign: 'unlock_lista' });

  return (
    <div>
      {/* Zona NITIDA: prime card leggibili e navigabili */}
      <div className={gridClassName}>
        {clearItems.map((item) => (
          <div key={keyOf(item)}>{renderCard(item)}</div>
        ))}
      </div>

      {/* Zona SFOCATA: card reali nell'HTML (SEO) ma offuscate + overlay CTA */}
      {hasLocked && (
        <div className="relative mt-4 md:mt-5">
          <div
            aria-hidden="true"
            className={`${gridClassName} select-none pointer-events-none blur-[4px]`}
          >
            {lockedItems.map((item) => (
              <div key={`locked-${keyOf(item)}`}>{renderCard(item)}</div>
            ))}
          </div>

          {/* Overlay CTA: vero link focusabile, sopra la zona sfocata */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-background/30 via-background/80 to-background px-6 text-center">
            <p className="max-w-md text-sm md:text-base font-medium text-foreground text-pretty">
              <Lock className="inline h-4 w-4 mr-1.5 -mt-0.5 text-construction" strokeWidth={2} aria-hidden="true" />
              Iscriviti gratis per vedere tutti i {formatNumber(totalCount)} cantieri
            </p>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-semibold transition-all hover:scale-[1.03] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {unlockLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

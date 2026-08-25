/**
 * SINGLE SOURCE OF TRUTH dell'indicizzazione selettiva cantieri.
 * Foglia: index solo se scheda arricchita e di qualità (scheda_pubblicabile = true).
 * Aggregate: index solo sopra soglia inventario (cantieri-core).
 * La versione SQL vive in getIndexableCantieriSlugs() (queries/cantieri-scheda.ts)
 * e DEVE restare allineata: index-gate = scheda_pubblicabile = true.
 */
import { passesIndexGate, hasInventory } from '@websonica/cantieri-core';

// Decisione 26/08/2026: schede cantiere e liste comune fuori dall'indice (17 impression
// in 90 giorni, 81% della CPU del DB). Spec: docs/superpowers/specs/2026-08-26-cantieri-bandi-fuori-indice-contenuti-verticali.md
// (repo italia-progettisti). Restano navigabili (noindex, follow), non cancellate.
export const SCHEDE_PUBBLICHE_INDICIZZABILI = false;

export function isCantiereIndexable(c: { scheda_pubblicabile: boolean | null }): boolean {
  if (!SCHEDE_PUBBLICHE_INDICIZZABILI) return false;
  // La view garantisce visibilita_pubblica=true; qui basta il gate qualità.
  return passesIndexGate({ visibilita_pubblica: true, scheda_pubblicabile: c.scheda_pubblicabile });
}

export function isComuneIndexable(): boolean {
  return SCHEDE_PUBBLICHE_INDICIZZABILI;
}

export function isAggregateIndexable(count: number, kind: 'default' | 'mestiere_provincia' = 'default'): boolean {
  return hasInventory(count, kind);
}

/**
 * SINGLE SOURCE OF TRUTH dell'indicizzazione selettiva cantieri.
 * Foglia: index solo se scheda arricchita e di qualità (scheda_pubblicabile = true).
 * Aggregate: index solo sopra soglia inventario (cantieri-core).
 * La versione SQL vive in getIndexableCantieriSlugs() (queries/cantieri-scheda.ts)
 * e DEVE restare allineata: index-gate = scheda_pubblicabile = true.
 */
import { passesIndexGate, hasInventory } from '@websonica/cantieri-core';

export function isCantiereIndexable(c: { scheda_pubblicabile: boolean | null }): boolean {
  // La view garantisce visibilita_pubblica=true; qui basta il gate qualità.
  return passesIndexGate({ visibilita_pubblica: true, scheda_pubblicabile: c.scheda_pubblicabile });
}

export function isAggregateIndexable(count: number, kind: 'default' | 'mestiere_provincia' = 'default'): boolean {
  return hasInventory(count, kind);
}

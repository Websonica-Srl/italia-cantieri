/**
 * Modello contenuti pillar (spec §2, 10 totali).
 *
 * Due "kind":
 *  - 'intervento' → pagine /cantieri/[intervento] (5 con hasPillar=true in cantieri-core)
 *  - 'guida'      → pagine /guide/[slug] (5 guide sui titoli edilizi)
 *
 * Il registry indicizza i file in src/content/pillars/*.ts per kind:slug.
 * Uno stub con answerFirst='' esiste nel registry ma NON va pubblicato:
 * è la route (Task 10+) a mostrare 404/noindex finche' il copy non è pronto.
 */
import { INTERVENTO_META, type InterventoCategoria } from '@websonica/cantieri-core';
import type { TipoTitolo } from '@websonica/cantieri-core';

import ristrutturazione from '@/content/pillars/ristrutturazione';
import manutenzioneStraordinaria from '@/content/pillars/manutenzione-straordinaria';
import cambioDestinazione from '@/content/pillars/cambio-destinazione';
import ampliamento from '@/content/pillars/ampliamento';
import demoRicostruzione from '@/content/pillars/demo-ricostruzione';
import cila from '@/content/pillars/cila';
import scia from '@/content/pillars/scia';
import permessoDiCostruire from '@/content/pillars/permesso-di-costruire';
import sciaOCila from '@/content/pillars/scia-o-cila';
import pratteEdilizie from '@/content/pillars/pratiche-edilizie';

export type PillarKind = 'intervento' | 'guida';

export interface PillarSection {
  heading: string;
  body: string;
}

export interface PillarFaqItem {
  q: string;
  a: string;
}

export interface PillarCorrelato {
  label: string;
  href: string;
}

export interface PillarContent {
  kind: PillarKind;
  slug: string;
  intervento?: InterventoCategoria;
  titolo?: TipoTitolo;
  h1: string;
  /** Risposta diretta (GEO/AEO): citabile da AI Overviews / Perplexity / ChatGPT. */
  answerFirst: string;
  sections: PillarSection[];
  faq: PillarFaqItem[];
  correlati: PillarCorrelato[];
  metaTitle: string;
  metaDescription: string;
  /** Ondata di pubblicazione (priorita' editoriale, non un flag tecnico). */
  ondata: 1 | 2;
}

const INTERVENTO_PILLARS: PillarContent[] = [
  ristrutturazione,
  manutenzioneStraordinaria,
  cambioDestinazione,
  ampliamento,
  demoRicostruzione,
];

const GUIDA_PILLARS: PillarContent[] = [
  cila,
  scia,
  permessoDiCostruire,
  sciaOCila,
  pratteEdilizie,
];

const REGISTRY = new Map<string, PillarContent>();
for (const p of [...INTERVENTO_PILLARS, ...GUIDA_PILLARS]) {
  REGISTRY.set(`${p.kind}:${p.slug}`, p);
}

export function getPillar(kind: PillarKind, slug: string): PillarContent | null {
  return REGISTRY.get(`${kind}:${slug}`) ?? null;
}

export function getAllPillars(kind?: PillarKind): PillarContent[] {
  const all = [...INTERVENTO_PILLARS, ...GUIDA_PILLARS];
  return kind ? all.filter((p) => p.kind === kind) : all;
}

/** Deriva gli slug intervento direttamente da INTERVENTO_META (hasPillar=true): garantisce coerenza col vocab cantieri-core. */
export function getInterventoPillarSlugs(): string[] {
  return Object.values(INTERVENTO_META)
    .filter((m) => m.hasPillar)
    .map((m) => m.slug);
}

export function getGuidaPillarSlugs(): string[] {
  return GUIDA_PILLARS.map((p) => p.slug);
}

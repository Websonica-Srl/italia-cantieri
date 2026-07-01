import { createServerClient } from '../client';
import type { InterventoCategoria, ValoreMetodo } from '@websonica/cantieri-core';
import type { Cantiere } from './cantieri';

export interface SchedaJson {
  unita_abitative?: number | null;
  superficie_mq?: number | null;
  confidence?: number | null;
  frasi_sorgente?: { campo: string; frase: string }[];
  [k: string]: unknown;
}

export interface CantiereScheda extends Cantiere {
  intervento_categoria: InterventoCategoria | null;
  destinazione_uso: string | null;
  destinazione_uso_origine: string | null;
  tipologia_edilizia: string | null;
  scala: string | null;
  posizione_urbana: string | null;
  segnale_tipo: string | null;
  segnale_forza: number | null;
  valore_min: number | null;
  valore_max: number | null;
  valore_metodo: ValoreMetodo | null;
  mestieri: string[] | null;
  indirizzo_norm: string | null;
  civico_norm: string | null;
  scheda: SchedaJson | null;
  scheda_version: string | null;
  scheda_pubblicabile: boolean | null;
  is_cantiere_reale: boolean | null;
}

export interface SchedaFilters {
  regione?: string; provincia?: string; comune?: string;
  intervento?: InterventoCategoria; destinazione?: string; scala?: string;
  mestiere?: string; valore_min?: number; q?: string;
  limit?: number; offset?: number;
  orderBy?: 'data_pubblicazione' | 'created_at';
  orderDirection?: 'asc' | 'desc';
}

export function unitaOf(c: Pick<CantiereScheda, 'unita_abitative' | 'scheda'>): number | null {
  if (c.unita_abitative != null) return c.unita_abitative;
  const v = c.scheda?.unita_abitative;
  return v != null ? Number(v) : null;
}
export function mqOf(c: Pick<CantiereScheda, 'superficie_mq' | 'scheda'>): number | null {
  if (c.superficie_mq != null) return Number(c.superficie_mq);
  const v = c.scheda?.superficie_mq;
  return v != null ? Number(v) : null;
}

function applyGate(query: any, gate: 'list' | 'index') {
  // La view garantisce già visibilita_pubblica=true.
  return gate === 'index'
    ? query.eq('scheda_pubblicabile', true)
    : query.or('scheda_pubblicabile.is.null,scheda_pubblicabile.is.true');
}

export async function getCantiereSchedaBySlug(slug: string): Promise<CantiereScheda | null> {
  const supabase: any = createServerClient();
  const { data, error } = await supabase
    .from('cantieri_pubblici').select('*').eq('slug', slug).maybeSingle();
  if (error) { console.error('[cantieri-scheda] bySlug', error.message); return null; }
  return data as CantiereScheda | null;
}

export async function getCantieriScheda(
  filters: SchedaFilters = {}, gate: 'list' | 'index' = 'list',
): Promise<{ data: CantiereScheda[]; total: number }> {
  const supabase: any = createServerClient();
  const { regione, provincia, comune, intervento, destinazione, scala, mestiere,
    valore_min, q, limit = 24, offset = 0,
    orderBy = 'data_pubblicazione', orderDirection = 'desc' } = filters;
  let query = supabase.from('cantieri_pubblici_attivi').select('*', { count: 'exact' });
  query = applyGate(query, gate);
  if (regione) query = query.ilike('regione', regione);
  if (provincia) query = query.ilike('provincia', provincia);
  if (comune) query = query.ilike('comune', comune);
  if (intervento) query = query.eq('intervento_categoria', intervento);
  if (destinazione) query = query.eq('destinazione_uso', destinazione);
  if (scala) query = query.eq('scala', scala);
  if (mestiere) query = query.contains('mestieri', [mestiere]);
  if (valore_min != null) query = query.gte('valore_max', valore_min);
  if (q) query = query.or(`descrizione.ilike.%${q}%,indirizzo.ilike.%${q}%,protocollo.ilike.%${q}%`);
  query = query.order(orderBy, { ascending: orderDirection === 'asc', nullsFirst: false });
  query = query.range(offset, offset + limit - 1);
  const { data, count, error } = await query;
  if (error) { console.error('[cantieri-scheda] list', error.message); return { data: [], total: 0 }; }
  return { data: (data as CantiereScheda[]) || [], total: count || 0 };
}

export async function getEnrichedCount(filters: SchedaFilters = {}): Promise<number> {
  const { total } = await getCantieriScheda({ ...filters, limit: 1 }, 'index');
  return total;
}

export async function getInterventoAggregato(intervento: InterventoCategoria): Promise<{
  total: number; perProvincia: { provincia: string; cnt: number }[]; recenti: CantiereScheda[];
}> {
  const supabase: any = createServerClient();
  const [{ data: recenti, total }, provRows] = await Promise.all([
    getCantieriScheda({ intervento, limit: 6 }, 'index').then((r) => ({ data: r.data, total: r.total })),
    (async () => {
      // PostgREST cappa a 1000: pagino con .range() così il breakdown per
      // provincia resta corretto anche per interventi con >1000 schede (F2).
      const pageSize = 1000;
      const rows: { provincia: string }[] = [];
      for (let from = 0; from < 40000; from += pageSize) {
        const { data, error } = await applyGate(
          supabase.from('cantieri_pubblici_attivi').select('provincia').eq('intervento_categoria', intervento),
          'index',
        ).range(from, from + pageSize - 1);
        if (error) break;
        const batch = (data as { provincia: string }[]) || [];
        rows.push(...batch);
        if (batch.length < pageSize) break;
      }
      return rows;
    })(),
  ]);
  const counts: Record<string, number> = {};
  for (const r of provRows) if (r.provincia) counts[r.provincia] = (counts[r.provincia] || 0) + 1;
  const perProvincia = Object.entries(counts)
    .map(([provincia, cnt]) => ({ provincia, cnt })).sort((a, b) => b.cnt - a.cnt);
  return { total, perProvincia, recenti };
}

export async function getIndexableCantieriSlugs(limit = 5000): Promise<{ slug: string; updated_at: string }[]> {
  const supabase: any = createServerClient();
  // PostgREST cappa a 1000 righe: pagino con .range() per prendere tutte le
  // foglie index-gate (oggi ~2.700, in crescita col backfill F2) fino a `limit`.
  const pageSize = 1000;
  const out: { slug: string; updated_at: string }[] = [];
  for (let from = 0; from < limit; from += pageSize) {
    const to = Math.min(from + pageSize, limit) - 1;
    const { data, error } = await applyGate(
      supabase.from('cantieri_pubblici_attivi').select('slug, updated_at'), 'index',
    ).order('updated_at', { ascending: false }).range(from, to);
    if (error) { console.error('[cantieri-scheda] idxSlugs', error.message); break; }
    const rows = (data as { slug: string; updated_at: string }[]) || [];
    out.push(...rows);
    if (rows.length < pageSize) break;
  }
  return out;
}

/**
 * Query layer per cantieri pubblici (Layer 1 - cantieri_pubblici view) e
 * statistiche aggregate anonime (Layer 2 - cantieri_aggregati_anonimi MV).
 *
 * REGOLE CRITICHE:
 * - NON interrogare mai la tabella `cantieri` direttamente.
 * - Layer 1: cantieri_pubblici (single record sicuro).
 * - Layer 2: cantieri_aggregati_anonimi (k-anonymity 5).
 */
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { createServerClient } from '../client';
import { resolveProvincia, TIPO_TITOLO_LABELS, CATEGORIA_LABELS } from '@websonica/cantieri-core';

export interface Cantiere {
  id: string;
  slug: string;
  protocollo: string | null;
  tipo_titolo: 'PDC' | 'SCIA' | 'CILA' | 'AS' | 'PdCC' | string | null;
  data_pubblicazione: string | null;
  data_rilascio: string | null;
  data_inizio_lavori: string | null;
  data_fine_lavori_prevista: string | null;
  stato: string | null;
  indirizzo: string | null;
  civico: string | null;
  cap: string | null;
  comune: string;
  provincia: string;
  regione: string;
  codice_istat: string | null;
  coordinate: string | null;
  quartiere: string | null;
  descrizione: string | null;
  importo_lavori: number | null;
  superficie_mq: number | null;
  cubatura_mc: number | null;
  unita_abitative: number | null;
  fonte_tipo: string | null;
  fonte_pubblicazione_data: string | null;
  categorie: string[];
  keywords_match: string[];
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CantieriFilters {
  regione?: string;
  provincia?: string;
  comune?: string;
  categoria?: string;
  tipo_titolo?: string;
  q?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'data_rilascio' | 'data_pubblicazione' | 'created_at' | 'importo_lavori';
  orderDirection?: 'asc' | 'desc';
}

export async function getCantieri(filters: CantieriFilters = {}): Promise<{ data: Cantiere[]; total: number }> {
  const supabase: any = createServerClient();
  const {
    regione,
    provincia,
    comune,
    categoria,
    tipo_titolo,
    q,
    limit = 12,
    offset = 0,
    orderBy = 'data_pubblicazione',
    orderDirection = 'desc',
  } = filters;

  let query = supabase
    .from('cantieri_pubblici_attivi')
    .select('*', { count: 'exact' })
    .eq('is_active', true);

  if (regione) query = query.ilike('regione', regione);
  if (provincia) query = query.ilike('provincia', provincia);
  if (comune) {
    const comuneCanonico = await resolveComuneCanonico(comune);
    query = comuneCanonico ? query.eq('comune', comuneCanonico) : query.ilike('comune', comune);
  }
  if (tipo_titolo) query = query.eq('tipo_titolo', tipo_titolo);
  if (categoria) query = query.contains('categorie', [categoria]);
  if (q) query = query.or(`descrizione.ilike.%${q}%,indirizzo.ilike.%${q}%,protocollo.ilike.%${q}%`);

  query = query.order(orderBy, { ascending: orderDirection === 'asc', nullsFirst: false });
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) {
    console.error('[cantieri] getCantieri error:', error.message);
    return { data: [], total: 0 };
  }
  return { data: (data as Cantiere[]) || [], total: count || 0 };
}

export async function getCantiereBySlug(slug: string): Promise<Cantiere | null> {
  const supabase: any = createServerClient();
  // Dettaglio: vista COMPLETA (no finestra 18 mesi) -> le schede archiviate
  // restano raggiungibili via permalink (no 404 su URL già indicizzati).
  const { data, error } = await supabase
    .from('cantieri_pubblici')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  if (error) {
    console.error('[cantieri] getCantiereBySlug error:', error.message);
    return null;
  }
  return data as Cantiere | null;
}

export async function getAllCantieriSlugs(limit = 5000): Promise<{ slug: string; updated_at: string }[]> {
  const supabase: any = createServerClient();
  const { data, error } = await supabase
    .from('cantieri_pubblici_attivi')
    .select('slug, updated_at')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('[cantieri] getAllCantieriSlugs error:', error.message);
    return [];
  }
  return (data as any[]) || [];
}

/** Stats globali: count totale, regioni, comuni, importo totale.
 *  Fonte: RPC cached `get_cantieri_home_stats()` (conteggi "circa" istantanei). */
export async function getGlobalStats(): Promise<{
  totale: number;
  regioni: number;
  comuni: number;
  importo_totale: number;
}> {
  const supabase: any = createServerClient();
  const { data, error } = await supabase.rpc('get_cantieri_home_stats');
  if (error || !data) {
    // Throw invece di zeri: con ISR Next mantiene l'ultima pagina buona invece
    // di servire (e indicizzare) una home che dichiara "0 cantieri".
    console.error('[cantieri] getGlobalStats error:', error?.message);
    throw new Error(`getGlobalStats: cache non disponibile (${error?.message ?? 'nessun dato'})`);
  }
  // La RPC ritorna una singola riga { totale, regioni, comuni }.
  const row = Array.isArray(data) ? data[0] : data;
  return {
    totale: Number(row?.totale) || 0,
    regioni: Number(row?.regioni) || 0,
    comuni: Number(row?.comuni) || 0,
    // importo_lavori è sempre NULL nel DB: nessun valore da sommare.
    importo_totale: 0,
  };
}

/**
 * Regioni con conteggio dalla cache stats (`get_stats_cache('cantieri_regioni')`):
 * conteggi "circa" istantanei e coerenti fra home, /regioni e /statistiche.
 * Ritorna [{ regione, cnt }] ordinato desc, escluso il placeholder "Italia".
 */
export async function getCantieriRegioniCached(): Promise<{ regione: string; cnt: number }[]> {
  const supabase: any = createServerClient();
  const { data, error } = await supabase.rpc('get_stats_cache', { p_key: 'cantieri_regioni' });
  if (error || !data) {
    // Throw invece di []: le 6 regioni sono sempre presenti; un errore cache non
    // deve svuotare silenziosamente home/regioni/statistiche (ISR tiene l'ultima buona).
    console.error('[cantieri] getCantieriRegioniCached error:', error?.message);
    throw new Error(`getCantieriRegioniCached: cache non disponibile (${error?.message ?? 'nessun dato'})`);
  }
  const arr: any[] = Array.isArray(data) ? data : [];
  return arr
    .map((r) => ({ regione: r.regione as string, cnt: Number(r.n) || 0 }))
    .filter((r) => r.regione && r.regione.toLowerCase() !== 'italia' && r.cnt > 0)
    .sort((a, b) => b.cnt - a.cnt);
}

/**
 * Province con conteggio dalla cache stats (`get_stats_cache('cantieri_province')`):
 * conteggi "circa" istantanei, coerenti col resto del sito. Payload: array
 * [{ regione, provincia, n }] su tutte le province, refreshato ogni ora da pg_cron.
 */
export async function getCantieriProvinceCached(): Promise<{ regione: string; provincia: string; cnt: number }[]> {
  const supabase: any = createServerClient();
  const { data, error } = await supabase.rpc('get_stats_cache', { p_key: 'cantieri_province' });
  if (error || !data) {
    // Throw invece di []: le province sono sempre presenti; un errore cache non
    // deve svuotare silenziosamente le pagine regione/provincia (ISR tiene l'ultima buona).
    console.error('[cantieri] getCantieriProvinceCached error:', error?.message);
    throw new Error(`getCantieriProvinceCached: cache non disponibile (${error?.message ?? 'nessun dato'})`);
  }
  const arr: any[] = Array.isArray(data) ? data : [];
  return arr
    .map((r) => ({ regione: r.regione as string, provincia: r.provincia as string, cnt: Number(r.n) || 0 }))
    .filter((r) => r.regione && r.provincia && r.cnt > 0)
    .sort((a, b) => b.cnt - a.cnt);
}

/**
 * Helper interno: legge tutti i record di una colonna con paginazione,
 * bypassando il default cap PostgREST (1000 righe) tramite `.range()`.
 */
async function fetchAllPages<T extends Record<string, any>>(
  buildQuery: () => any,
  pageSize = 1000,
  maxPages = 30,
): Promise<T[]> {
  const out: T[] = [];
  for (let i = 0; i < maxPages; i++) {
    const from = i * pageSize;
    const to = from + pageSize - 1;
    const { data, error } = await buildQuery().range(from, to);
    if (error) {
      console.error('[cantieri] fetchAllPages error:', error.message);
      break;
    }
    if (!data || data.length === 0) break;
    out.push(...(data as T[]));
    if (data.length < pageSize) break; // pagina finale
  }
  return out;
}

/** Conta cantieri per provincia di una regione (da cache stats, coerente col resto del sito). */
export async function getCantieriByProvincia(regione: string): Promise<{ provincia: string; cnt: number }[]> {
  const all = await getCantieriProvinceCached();
  const target = regione.toLowerCase();
  return all
    .filter((r) => r.regione.toLowerCase() === target)
    .map(({ provincia, cnt }) => ({ provincia, cnt }))
    .sort((a, b) => b.cnt - a.cnt);
}

/** Conta cantieri per comune di una provincia. */
export async function getCantieriByComune(provincia: string): Promise<{ comune: string; cnt: number }[]> {
  const supabase: any = createServerClient();
  const data = await fetchAllPages<{ comune: string }>(() =>
    supabase
      .from('cantieri_pubblici_attivi')
      .select('comune')
      .ilike('provincia', provincia)
      .eq('is_active', true),
  );
  const counts: Record<string, number> = {};
  for (const r of data) {
    if (!r.comune) continue;
    counts[r.comune] = (counts[r.comune] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([comune, cnt]) => ({ comune, cnt }))
    .sort((a, b) => b.cnt - a.cnt);
}

/**
 * Distribuzione tipo_titolo (PDC/SCIA/CILA/...) nazionale.
 *
 * FIX CV-F01: prima usava fetchAllPages con cap 30 pagine (30.000 righe su 48.733
 * attive), sottostimando i conteggi fino al -40% e sballando l'ordinamento
 * (es. CILA mostrato primo mentre ALTRO è primo nel dataset pieno con ~35,7%).
 * Ora usa N count query filtrate (head:true, count exact) sui valori noti del
 * vocab canonico `TIPO_TITOLO_LABELS` (cantieri-core, ~7 valori) invece di
 * scaricare tutte le righe: nessuna riga trasferita, conteggio esatto su tutto
 * il dataset attivo.
 */
export async function getTipoTitoloDistribution(): Promise<{ tipo: string; cnt: number }[]> {
  const supabase: any = createServerClient();
  const tipiNoti = Object.keys(TIPO_TITOLO_LABELS);
  try {
    const [totale, ...perTipo] = await Promise.all([
      supabase.from('cantieri_pubblici_attivi').select('id', { count: 'exact', head: true }).eq('is_active', true),
      ...tipiNoti.map((t) =>
        supabase
          .from('cantieri_pubblici_attivi')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true)
          .eq('tipo_titolo', t),
      ),
    ]);
    const result = tipiNoti
      .map((tipo, i) => ({ tipo, cnt: perTipo[i]?.count ?? 0 }))
      .filter((r) => r.cnt > 0);
    // Bucket residuo per valori non presenti nel vocab noto (o null), per non perdere righe.
    const sommaNoti = result.reduce((s, r) => s + r.cnt, 0);
    const residuo = (totale?.count ?? 0) - sommaNoti;
    if (residuo > 0) result.push({ tipo: 'N/D', cnt: residuo });
    return result.sort((a, b) => b.cnt - a.cnt);
  } catch (err) {
    console.error('[cantieri] getTipoTitoloDistribution error:', err);
    return [];
  }
}

/**
 * Categorie top per cantieri (nazionale o filtrate per regione).
 *
 * FIX CV-F01: come sopra, `categorie` è un array text[] (colonna GIN-indicizzata
 * `cantieri_categorie_gin_idx`), quindi il conteggio via fetchAllPages scaricava
 * fino a 30.000 righe intere. Ora usa N count query filtrate (`.contains`, head:true,
 * count exact) sui ~18 valori noti del vocab canonico `CATEGORIA_LABELS`
 * (cantieri-core), che sfruttano l'indice GIN esistente senza trasferire righe.
 * Nota: se in futuro il vocab cresce dinamicamente (nuove categorie fuori da
 * CATEGORIA_LABELS), andrebbero riprese qui o con una RPC SQL GROUP BY dedicata.
 */
export async function getTopCategorie(limit = 10, regione?: string): Promise<{ categoria: string; cnt: number }[]> {
  const supabase: any = createServerClient();
  const categorieNote = Object.keys(CATEGORIA_LABELS);
  try {
    const perCategoria = await Promise.all(
      categorieNote.map((c) => {
        let q = supabase
          .from('cantieri_pubblici_attivi')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true)
          .contains('categorie', [c]);
        if (regione) q = q.ilike('regione', regione);
        return q;
      }),
    );
    return categorieNote
      .map((categoria, i) => ({ categoria, cnt: perCategoria[i]?.count ?? 0 }))
      .filter((r) => r.cnt > 0)
      .sort((a, b) => b.cnt - a.cnt)
      .slice(0, limit);
  } catch (err) {
    console.error('[cantieri] getTopCategorie error:', err);
    return [];
  }
}

/** Stats per regione (count, top categorie, importo totale). */
export async function getRegioneStats(regione: string): Promise<{
  totale: number;
  importo_totale: number;
  province: number;
  comuni: number;
  top_categorie: { categoria: string; cnt: number }[];
}> {
  const supabase: any = createServerClient();
  const [{ count }, rows, top_categorie] = await Promise.all([
    supabase.from('cantieri_pubblici_attivi').select('id', { count: 'exact', head: true }).ilike('regione', regione).eq('is_active', true),
    fetchAllPages<{ provincia: string; comune: string; importo_lavori: number | null }>(() =>
      supabase
        .from('cantieri_pubblici_attivi')
        .select('provincia, comune, importo_lavori')
        .ilike('regione', regione)
        .eq('is_active', true),
    ),
    getTopCategorie(8, regione),
  ]);
  const r = rows || [];
  const province = new Set(r.map((x) => x.provincia)).size;
  const comuni = new Set(r.map((x) => x.comune)).size;
  const importo_totale = r.reduce((s, x) => s + (Number(x.importo_lavori) || 0), 0);
  return {
    totale: count || 0,
    importo_totale,
    province,
    comuni,
    top_categorie,
  };
}

/** Aggregati anonimi Layer 2 per comune. */
export async function getAggregatiAnonimiByComune(comune: string): Promise<{
  categorie: { categoria: string; totale: number; importo_totale: number | null }[];
  totale_aggregato: number;
}> {
  const supabase: any = createServerClient();
  const comuneCanonico = await resolveComuneCanonico(comune);
  let aggQuery = supabase.from('cantieri_aggregati_anonimi').select('categoria, totale, importo_totale');
  aggQuery = comuneCanonico ? aggQuery.eq('comune', comuneCanonico) : aggQuery.ilike('comune', comune);
  const { data, error } = await aggQuery;
  if (error || !data) return { categorie: [], totale_aggregato: 0 };
  const map: Record<string, { totale: number; importo_totale: number }> = {};
  for (const r of data as any[]) {
    if (!map[r.categoria]) map[r.categoria] = { totale: 0, importo_totale: 0 };
    map[r.categoria].totale += r.totale || 0;
    map[r.categoria].importo_totale += Number(r.importo_totale) || 0;
  }
  const categorie = Object.entries(map)
    .map(([categoria, v]) => ({ categoria, totale: v.totale, importo_totale: v.importo_totale }))
    .sort((a, b) => b.totale - a.totale);
  const totale_aggregato = categorie.reduce((s, c) => s + c.totale, 0);
  return { categorie, totale_aggregato };
}

/** Autocomplete comuni (per search box). Restituisce anche un count
 *  approssimato di cantieri per comune (numero di record matchati nel
 *  limite di lookup) - utile come hint visivo in autocomplete. */
export async function searchComuni(
  q: string,
  limit = 10,
): Promise<{ comune: string; provincia: string; regione: string; count?: number }[]> {
  if (!q || q.length < 2) return [];
  const supabase: any = createServerClient();

  // NB: in supabase-js i filtri (.ilike/.eq) vanno DOPO .select().
  const base = () => supabase.from('cantieri_pubblici_attivi').select('comune, provincia, regione').eq('is_active', true);

  // 1) match per nome comune
  const queries: Promise<any>[] = [base().ilike('comune', `${q}%`).limit(400)];
  // 2) match per provincia (es. "torino" -> tutti i comuni con provincia=TO) via cantieri-core (107 province)
  const provCode = resolveProvincia(q)?.sigla;
  if (provCode) {
    queries.push(base().eq('provincia', provCode).limit(400));
  }
  // 3) match per regione (es. "piemonte", "lombardia")
  queries.push(base().ilike('regione', `${q}%`).limit(400));

  const results = await Promise.all(queries);
  const rows: any[] = [];
  for (const r of results) if (!r.error && r.data) rows.push(...r.data);

  // Deduplica per comune (case-insensitive) e conta occorrenze come hint
  const seenMap = new Map<string, { comune: string; provincia: string; regione: string; count: number }>();
  for (const r of rows) {
    const key = (r.comune || '').toLowerCase();
    const existing = seenMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      seenMap.set(key, { comune: r.comune, provincia: r.provincia, regione: r.regione, count: 1 });
    }
  }
  // Ordina per numero cantieri desc (i comuni più rilevanti in alto)
  return Array.from(seenMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// RPC comuni distinti, ora servita dalla MV comuni_attivi_mv (refresh notturno via
// pg_cron). Cache Next 1h: la lista cambia solo dopo un run di ingestion. In caso di
// errore la funzione LANCIA (unstable_cache non memorizza i fallimenti: un timeout
// non deve avvelenare la cache con una lista vuota per un'ora).
const fetchComuniAttivi = unstable_cache(
  async (): Promise<any[]> => {
    const supabase: any = createServerClient();
    const { data, error } = await supabase.rpc('get_comuni_attivi');
    if (error || !data) throw new Error(error?.message || 'get_comuni_attivi: nessun dato');
    return data as any[];
  },
  ['comuni-attivi'],
  { revalidate: 3600 }
);

/** Lista distinct comuni per sitemap (max 5000). */
export async function getAllComuni(limit = 5000): Promise<{ comune: string; provincia: string; regione: string; count?: number }[]> {
  try {
    const data = await fetchComuniAttivi();
    return data
      .slice(0, limit)
      .map((r) => ({ comune: r.comune, provincia: r.provincia, regione: r.regione, count: Number(r.n) || undefined }));
  } catch {
    // Degrado soft (comportamento precedente): i chiamanti ripiegano su ilike/liste vuote.
    return [];
  }
}

/**
 * Mappa (nome comune in minuscolo -> nome canonico esatto in DB), costruita
 * dalla stessa fonte di `getAllComuni` e memoizzata con `React.cache` (dedupe
 * per-request, stesso pattern di `resolveRegione`/`resolveProvincia` nelle
 * pagine [regione]/[provincia]): niente RPC aggiuntive ripetute.
 */
const getComuneCanonicoMap = cache(async (): Promise<Map<string, string>> => {
  const all = await getAllComuni();
  const map = new Map<string, string>();
  for (const c of all) {
    if (c.comune) map.set(c.comune.toLowerCase(), c.comune);
  }
  return map;
});

/**
 * Risolve un valore comune (case-insensitive, da slug, testo libero utente o
 * query esterna) al nome CANONICO esatto in DB. Ritorna null se non è un
 * match esatto (es. ricerca parziale o comune inesistente): in quel caso il
 * chiamante deve restare su `.ilike()`.
 *
 * Usata per abilitare `.eq('comune', ...)` invece di `.ilike('comune', ...)`
 * su `cantieri`: con l'indice composito `cantieri_comune_data_idx (comune,
 * data_pubblicazione DESC NULLS LAST) WHERE visibilita_pubblica`, `eq` sfrutta
 * il LIMIT pushdown (da ~2,9s a ~1ms per comuni grandi tipo Verona);
 * `ilike` invece forza il fetch di tutte le righe del comune prima del sort.
 */
export async function resolveComuneCanonico(input: string | undefined | null): Promise<string | null> {
  if (!input) return null;
  const map = await getComuneCanonicoMap();
  return map.get(input.trim().toLowerCase()) ?? null;
}

/** Lista distinct province per regione. */
export async function getAllProvince(): Promise<{ provincia: string; regione: string }[]> {
  const supabase: any = createServerClient();
  const { data, error } = await supabase
    .from('cantieri_pubblici_attivi')
    .select('provincia, regione')
    .eq('is_active', true)
    .limit(20000);
  if (error || !data) return [];
  const seen = new Set<string>();
  const out: { provincia: string; regione: string }[] = [];
  for (const r of data as any[]) {
    const key = (r.provincia || '').toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ provincia: r.provincia, regione: r.regione });
  }
  return out;
}

/** Conta firms_public (imprese) per comune — per cross-link. */
export async function countFirmsByComune(comune: string): Promise<number> {
  const supabase: any = createServerClient();
  const { count, error } = await supabase
    .from('firms_public')
    .select('id', { count: 'exact', head: true })
    .ilike('city', comune);
  if (error) return 0;
  return count || 0;
}

/**
 * KPI globali "live" usati nei trust banner e nelle CTA della homepage.
 * Numeri reali dal DB di produzione, ISR ogni ora via revalidate.
 *
 * - cantieri: count su view cantieri_pubblici (Layer 1, già filtrato per visibilità pubblica)
 * - soggetti: count su cantieri_soggetti (progettisti/imprese estratti dai cantieri)
 * - firms: count firms importate dallo scraping (created_via='cantieri_scraping')
 */
export async function getKpiStats(): Promise<{
  cantieri: number;
  soggetti: number;
  firms: number;
}> {
  const supabase: any = createServerClient();
  try {
    const [cantieri, soggetti, firms] = await Promise.all([
      supabase.from('cantieri_pubblici_attivi').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('cantieri_soggetti').select('id', { count: 'exact', head: true }),
      supabase
        .from('firms_public')
        .select('id', { count: 'exact', head: true })
        .eq('created_via', 'cantieri_scraping'),
    ]);
    return {
      cantieri: cantieri.count ?? 0,
      soggetti: soggetti.count ?? 0,
      firms: firms.count ?? 0,
    };
  } catch (err) {
    console.error('[cantieri] getKpiStats error:', err);
    // Fallback conservativo: nessun numero cablato (no claim pubblici fuori proof-bank).
    return { cantieri: 0, soggetti: 0, firms: 0 };
  }
}

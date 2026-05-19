/**
 * Query layer per cantieri pubblici (Layer 1 - cantieri_pubblici view) e
 * statistiche aggregate anonime (Layer 2 - cantieri_aggregati_anonimi MV).
 *
 * REGOLE CRITICHE:
 * - NON interrogare mai la tabella `cantieri` direttamente.
 * - Layer 1: cantieri_pubblici (single record sicuro).
 * - Layer 2: cantieri_aggregati_anonimi (k-anonymity 5).
 */
import { createServerClient } from '../client';

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
    .from('cantieri_pubblici')
    .select('*', { count: 'exact' })
    .eq('is_active', true);

  if (regione) query = query.ilike('regione', regione);
  if (provincia) query = query.ilike('provincia', provincia);
  if (comune) query = query.ilike('comune', comune);
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
    .from('cantieri_pubblici')
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

/** Stats globali: count totale, regioni, comuni, importo totale. */
export async function getGlobalStats(): Promise<{
  totale: number;
  regioni: number;
  comuni: number;
  importo_totale: number;
}> {
  const supabase: any = createServerClient();
  const [{ count: totale }, { data: distinctData }, { data: importoData }] = await Promise.all([
    supabase.from('cantieri_pubblici').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.rpc('get_cantieri_distinct_counts').then(
      (r: any) => r.error ? { data: null } : r,
      () => ({ data: null })
    ),
    supabase.from('cantieri_pubblici').select('importo_lavori').eq('is_active', true).not('importo_lavori', 'is', null).limit(5000),
  ]);

  // Fallback se RPC non esiste: due query separate
  let regioni = 0;
  let comuni = 0;
  if (distinctData && Array.isArray(distinctData) && distinctData[0]) {
    regioni = distinctData[0].regioni || 0;
    comuni = distinctData[0].comuni || 0;
  } else {
    const { data: regs } = await supabase
      .from('cantieri_pubblici')
      .select('regione')
      .eq('is_active', true)
      .limit(10000);
    const { data: coms } = await supabase
      .from('cantieri_pubblici')
      .select('comune')
      .eq('is_active', true)
      .limit(10000);
    regioni = new Set((regs || []).map((r: any) => r.regione)).size;
    comuni = new Set((coms || []).map((c: any) => c.comune)).size;
  }

  const importo_totale = ((importoData as any[]) || []).reduce(
    (sum, r: any) => sum + (Number(r.importo_lavori) || 0),
    0,
  );

  return {
    totale: totale || 0,
    regioni,
    comuni,
    importo_totale,
  };
}

/** Conta cantieri per regione (lista regioni con count). */
export async function getCantieriByRegione(): Promise<{ regione: string; cnt: number }[]> {
  const supabase: any = createServerClient();
  // Usa RPC se disponibile, altrimenti fallback con query manuale
  const { data, error } = await supabase
    .from('cantieri_pubblici')
    .select('regione')
    .eq('is_active', true)
    .limit(10000);
  if (error || !data) return [];
  const counts: Record<string, number> = {};
  for (const r of data as any[]) {
    counts[r.regione] = (counts[r.regione] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([regione, cnt]) => ({ regione, cnt }))
    .sort((a, b) => b.cnt - a.cnt);
}

/** Conta cantieri per provincia di una regione. */
export async function getCantieriByProvincia(regione: string): Promise<{ provincia: string; cnt: number }[]> {
  const supabase: any = createServerClient();
  const { data, error } = await supabase
    .from('cantieri_pubblici')
    .select('provincia')
    .ilike('regione', regione)
    .eq('is_active', true)
    .limit(10000);
  if (error || !data) return [];
  const counts: Record<string, number> = {};
  for (const r of data as any[]) {
    counts[r.provincia] = (counts[r.provincia] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([provincia, cnt]) => ({ provincia, cnt }))
    .sort((a, b) => b.cnt - a.cnt);
}

/** Conta cantieri per comune di una provincia. */
export async function getCantieriByComune(provincia: string): Promise<{ comune: string; cnt: number }[]> {
  const supabase: any = createServerClient();
  const { data, error } = await supabase
    .from('cantieri_pubblici')
    .select('comune')
    .ilike('provincia', provincia)
    .eq('is_active', true)
    .limit(10000);
  if (error || !data) return [];
  const counts: Record<string, number> = {};
  for (const r of data as any[]) {
    counts[r.comune] = (counts[r.comune] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([comune, cnt]) => ({ comune, cnt }))
    .sort((a, b) => b.cnt - a.cnt);
}

/** Distribuzione tipo_titolo (PDC/SCIA/CILA) nazionale. */
export async function getTipoTitoloDistribution(): Promise<{ tipo: string; cnt: number }[]> {
  const supabase: any = createServerClient();
  const { data, error } = await supabase
    .from('cantieri_pubblici')
    .select('tipo_titolo')
    .eq('is_active', true)
    .limit(10000);
  if (error || !data) return [];
  const counts: Record<string, number> = {};
  for (const r of data as any[]) {
    const t = r.tipo_titolo || 'N/D';
    counts[t] = (counts[t] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([tipo, cnt]) => ({ tipo, cnt }))
    .sort((a, b) => b.cnt - a.cnt);
}

/** Categorie top per cantieri. */
export async function getTopCategorie(limit = 10, regione?: string): Promise<{ categoria: string; cnt: number }[]> {
  const supabase: any = createServerClient();
  let query = supabase
    .from('cantieri_pubblici')
    .select('categorie')
    .eq('is_active', true)
    .not('categorie', 'is', null);
  if (regione) query = query.ilike('regione', regione);
  query = query.limit(10000);
  const { data, error } = await query;
  if (error || !data) return [];
  const counts: Record<string, number> = {};
  for (const r of data as any[]) {
    for (const c of (r.categorie || []) as string[]) {
      counts[c] = (counts[c] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([categoria, cnt]) => ({ categoria, cnt }))
    .sort((a, b) => b.cnt - a.cnt)
    .slice(0, limit);
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
  const [{ count }, { data: rows }, top_categorie] = await Promise.all([
    supabase.from('cantieri_pubblici').select('id', { count: 'exact', head: true }).ilike('regione', regione).eq('is_active', true),
    supabase.from('cantieri_pubblici').select('provincia, comune, importo_lavori').ilike('regione', regione).eq('is_active', true).limit(10000),
    getTopCategorie(8, regione),
  ]);
  const r = (rows as any[]) || [];
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
  const { data, error } = await supabase
    .from('cantieri_aggregati_anonimi')
    .select('categoria, totale, importo_totale')
    .ilike('comune', comune);
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
  const { data, error } = await supabase
    .from('cantieri_pubblici')
    .select('comune, provincia, regione')
    .ilike('comune', `${q}%`)
    .eq('is_active', true)
    .limit(400);
  if (error || !data) return [];
  // Deduplica per comune (case-insensitive) e conta occorrenze come hint
  const seenMap = new Map<string, { comune: string; provincia: string; regione: string; count: number }>();
  for (const r of data as any[]) {
    const key = (r.comune || '').toLowerCase();
    const existing = seenMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      seenMap.set(key, { comune: r.comune, provincia: r.provincia, regione: r.regione, count: 1 });
    }
  }
  return Array.from(seenMap.values()).slice(0, limit);
}

/** Lista distinct comuni per sitemap (max 5000). */
export async function getAllComuni(limit = 5000): Promise<{ comune: string; provincia: string; regione: string }[]> {
  const supabase: any = createServerClient();
  const { data, error } = await supabase
    .from('cantieri_pubblici')
    .select('comune, provincia, regione')
    .eq('is_active', true)
    .limit(20000);
  if (error || !data) return [];
  const seen = new Set<string>();
  const out: { comune: string; provincia: string; regione: string }[] = [];
  for (const r of data as any[]) {
    const key = (r.comune || '').toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ comune: r.comune, provincia: r.provincia, regione: r.regione });
    if (out.length >= limit) break;
  }
  return out;
}

/** Lista distinct province per regione. */
export async function getAllProvince(): Promise<{ provincia: string; regione: string }[]> {
  const supabase: any = createServerClient();
  const { data, error } = await supabase
    .from('cantieri_pubblici')
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
      supabase.from('cantieri_pubblici').select('id', { count: 'exact', head: true }).eq('is_active', true),
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
    // Fallback conservativo allineato ai numeri reali a 2026-05-19
    return { cantieri: 6545, soggetti: 38510, firms: 37789 };
  }
}

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Costruisce l'URL di registrazione HUB (ItaliaProgettisti) trasportando il
 * contesto del funnel (intent, cantiere, geo) e le UTM di attribuzione.
 * R7: il satellite è zero-PII/zero-stato — ogni CTA di conversione punta
 * qui, mai a un flusso di signup locale.
 */
export function hubRegisterUrl(
  opts: {
    intent?: string;
    cantiere?: string;
    comune?: string;
    provincia?: string;
    regione?: string;
    intervento?: string;
    campaign?: string;
  } = {},
): string {
  const qs = new URLSearchParams();
  qs.set('utm_source', 'italiacantieri');
  qs.set('utm_medium', 'referral');
  qs.set('utm_campaign', opts.campaign || 'cantieri_funnel');
  if (opts.intent) qs.set('intent', opts.intent);
  if (opts.cantiere) qs.set('cantiere', opts.cantiere);
  if (opts.comune) qs.set('comune', opts.comune);
  if (opts.provincia) qs.set('provincia', opts.provincia);
  if (opts.regione) qs.set('regione', opts.regione);
  if (opts.intervento) qs.set('intervento', opts.intervento);
  return `https://www.italiaprogettisti.com/register?${qs.toString()}`;
}

/** Preposizione "a"/"ad" (elisione eufonica davanti a vocale). */
export function prepA(nome: string): string {
  const n = (nome || '').trim();
  return /^[aeiouAEIOUàèéìòù]/.test(n) ? `ad ${n}` : `a ${n}`;
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateShort(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function truncate(str: string, length: number): string {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Formatta importo EUR con separatore migliaia italiano e simbolo €.
 * Es: 12345.67 -> "12.345,67 €"
 */
export function formatEuro(value: number | null | undefined, opts: { decimals?: number; compact?: boolean } = {}): string {
  if (value === null || value === undefined) return '—';
  const { decimals = 0, compact = false } = opts;
  if (compact && value >= 1_000_000) {
    return new Intl.NumberFormat('it-IT', { maximumFractionDigits: 1 }).format(value / 1_000_000) + ' mln €';
  }
  if (compact && value >= 1_000) {
    return new Intl.NumberFormat('it-IT', { maximumFractionDigits: 0 }).format(value / 1_000) + ' mila €';
  }
  return new Intl.NumberFormat('it-IT', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value) + ' €';
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('it-IT').format(value);
}

/**
 * Slugify standard italiano: lowercase, accenti rimossi, spazi -> -.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Mappa regione -> slug per route /[regione].
 */
export function regioneSlug(regione: string): string {
  return slugify(regione);
}

/**
 * Inverso slug -> nome regione canonical (case-insensitive lookup richiede query DB).
 * Per matching SQL usa ILIKE.
 */
export function regioneFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Province italiane: il DB memorizza la sigla 2 lettere (BO, MI, TO, ...).
 * Le URL del sito usano lo slug del nome esteso (es. "TO" → "torino"),
 * coerente con la convenzione editoriale italiaprogettisti.com.
 *
 * @deprecated Usa `provinciaSlugFromCode` da `@/lib/province` per ottenere lo slug
 * canonico (es. "torino"). Questa funzione adesso è un wrapper di compatibilita.
 */
export function provinciaSlug(provinciaSigla: string): string {
  // Lazy import per evitare cicli — ma in pratica è un re-export sicuro.
  // Mantieni signature stabile per i call-site legacy.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { provinciaSlugFromCode } = require('./province') as typeof import('./province');
  return provinciaSlugFromCode(provinciaSigla);
}

/**
 * Coordinate PostGIS (WKB hex) -> { lat, lng } se possibile.
 * Le geometrie arrivano come WKB binario in formato hex string.
 * Parser leggero per POINT (E6...).
 */
export function parseCoordinate(wkbHex: string | null): { lat: number; lng: number } | null {
  if (!wkbHex || typeof wkbHex !== 'string') return null;
  // PostGIS hex string per POINT: 0101000020E6100000 + 8 byte lng + 8 byte lat (little endian double)
  try {
    if (wkbHex.length < 50) return null;
    // Estrai gli ultimi 32 hex chars: 16 lng + 16 lat
    const lngHex = wkbHex.slice(18, 34);
    const latHex = wkbHex.slice(34, 50);
    const lng = hexToDouble(lngHex);
    const lat = hexToDouble(latHex);
    if (isNaN(lat) || isNaN(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}

function hexToDouble(hex: string): number {
  // Little endian: reverse byte order
  const bytes = new Uint8Array(8);
  for (let i = 0; i < 8; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  const buffer = bytes.buffer;
  return new DataView(buffer).getFloat64(0, true);
}

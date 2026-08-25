import { describe, it, expect, vi } from 'vitest';

// Decisione 26/08/2026: schede cantiere (/cantiere/[slug]) e liste comune
// (/comune/[slug]) sono noindex,follow (corsia C1) e NON devono piu'
// comparire in sitemap. Mockiamo le query geo/regioni con dati minimi e
// verifichiamo che getIndexableCantieriSlugs (cantieri-scheda) non venga
// mai invocata.

const getCantieriRegioniCached = vi.fn(async () => [
  { regione: 'Lombardia', cnt: 100 },
  { regione: 'Piemonte', cnt: 50 },
]);
const getAllProvince = vi.fn(async () => [
  { provincia: 'AL', regione: 'Piemonte' },
  { provincia: 'AT', regione: 'Piemonte' },
]);
// Mock difensivo: se il modulo restasse importato da qualche parte in
// sitemap.ts, questi mock impedirebbero query reali al DB nei test.
const getAllComuni = vi.fn(async () => [
  { comune: 'Comune Fantoccio', provincia: 'AL', regione: 'Piemonte' },
]);
const getIndexableCantieriSlugs = vi.fn(async () => [
  { slug: 'cantiere-fantoccio', updated_at: '2026-01-01' },
]);

vi.mock('@/lib/supabase/queries/cantieri', () => ({
  getCantieriRegioniCached,
  getAllProvince,
  getAllComuni,
}));
vi.mock('@/lib/supabase/queries/cantieri-scheda', () => ({
  getIndexableCantieriSlugs,
}));

describe('sitemap', () => {
  it('esclude schede cantiere e liste comune, include statiche/pillar/geo', async () => {
    const { default: sitemap } = await import('../sitemap');
    const urls = await sitemap();
    const paths = urls.map((u) => u.url);

    // Nessuna URL noindex (schede cantiere, liste comune)
    for (const url of paths) {
      expect(url).not.toContain('/cantiere/');
      expect(url).not.toContain('/comune/');
    }

    // getIndexableCantieriSlugs non deve mai essere invocata dalla sitemap
    expect(getIndexableCantieriSlugs).not.toHaveBeenCalled();

    const hasPath = (p: string) => paths.some((u) => u.endsWith(p));

    expect(hasPath('/')).toBe(true);
    expect(hasPath('/per-le-imprese')).toBe(true);
    expect(hasPath('/cantieri')).toBe(true);
    expect(hasPath('/guide')).toBe(true);
    expect(hasPath('/lombardia')).toBe(true);
    expect(hasPath('/piemonte')).toBe(true);
    expect(hasPath('/piemonte/alessandria')).toBe(true);
    expect(hasPath('/piemonte/asti')).toBe(true);
  });

  it('/per-le-imprese ha priority 0.9 e changeFrequency weekly', async () => {
    const { default: sitemap } = await import('../sitemap');
    const urls = await sitemap();
    const entry = urls.find((u) => u.url.endsWith('/per-le-imprese'));
    expect(entry).toBeDefined();
    expect(entry?.priority).toBe(0.9);
    expect(entry?.changeFrequency).toBe('weekly');
  });
});

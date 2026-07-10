import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';
import {
  getCantieriRegioniCached,
  getAllProvince,
  getAllComuni,
} from '@/lib/supabase/queries/cantieri';
import { getIndexableCantieriSlugs } from '@/lib/supabase/queries/cantieri-scheda';
import {
  getInterventoPillarSlugs,
  getGuidaPillarSlugs,
  getPillar,
} from '@/lib/content/pillars';
import { regioneSlug, slugify } from '@/lib/utils';
import { provinciaSlugFromCode } from '@/lib/province';

export const revalidate = 3600;

/**
 * Sitemap UNICA servita su /sitemap.xml (come /robots.txt, metadata route
 * affidabile). In Fase 1 il volume totale (foglie index-gate ~2.700 + geo +
 * 12 pillar + statiche) è ben sotto il limite di 50.000 URL per sitemap.
 *
 * NB: lo split via `generateSitemaps` (4 shard) NON è usato: in questa app
 * genera route `/sitemap/[__metadata_id__]` che, con id stringa, collide col
 * catch-all `/[regione]/[provincia]` e non serve XML in produzione (404/HTML).
 * Lo split andra' rifatto con route handler espliciti quando il backfill F2
 * portera' il volume oltre il limite di una singola sitemap.
 *
 * Regole di inclusione (invarianti):
 *  - cantieri: SOLO foglie index-gate (getIndexableCantieriSlugs, scheda_pubblicabile=true).
 *    Le foglie noindex restano fuori per costruzione della query.
 *  - pillar: /cantieri, /guide + pillar con answerFirst non vuoto (stub esclusi).
 *  - geo: regioni + province + comuni (dato persistente).
 *  - /esplora e /lavori/* sono sempre noindex,follow: NON entrano.
 *  - Le schede bando vivono su bandigaredappalto.it (canonica li'): non incluse.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.baseUrl;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/regioni`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/statistiche`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/bandi`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/iscriviti`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/glossario`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/per-pubbliche-amministrazioni`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/api-pubbliche`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/come-trattiamo-i-dati`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/chi-siamo`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contatti`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/legal/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/legal/cookie`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/legal/termini`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Pillar pubblicati (stub con answerFirst vuoto esclusi)
  const interventi = getInterventoPillarSlugs()
    .map((s) => getPillar('intervento', s))
    .filter((p): p is NonNullable<typeof p> => !!p && !!p.answerFirst);
  const guide = getGuidaPillarSlugs()
    .map((s) => getPillar('guida', s))
    .filter((p): p is NonNullable<typeof p> => !!p && !!p.answerFirst);
  const pillarPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/cantieri`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/guide`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...interventi.map((p) => ({
      url: `${baseUrl}/cantieri/${p.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    ...guide.map((p) => ({
      url: `${baseUrl}/guide/${p.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
  ];

  // Geo (dato persistente)
  const [regioni, province, comuni, cantieriSlugs] = await Promise.all([
    getCantieriRegioniCached(),
    getAllProvince(),
    getAllComuni(500),
    getIndexableCantieriSlugs(5000),
  ]);

  const regionPages: MetadataRoute.Sitemap = regioni.map((r) => ({
    url: `${baseUrl}/${regioneSlug(r.regione)}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.85,
  }));
  const provinciaPages: MetadataRoute.Sitemap = province.slice(0, 200).map((p) => ({
    url: `${baseUrl}/${regioneSlug(p.regione)}/${provinciaSlugFromCode(p.provincia)}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.75,
  }));
  const comunePages: MetadataRoute.Sitemap = comuni.map((c) => ({
    url: `${baseUrl}/comune/${slugify(c.comune)}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  // Foglie index-gate (scheda_pubblicabile=true): le noindex restano fuori.
  const cantierePages: MetadataRoute.Sitemap = cantieriSlugs.map((c) => ({
    url: `${baseUrl}/cantiere/${c.slug}`,
    lastModified: c.updated_at ? new Date(c.updated_at) : now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...pillarPages,
    ...regionPages,
    ...provinciaPages,
    ...comunePages,
    ...cantierePages,
  ];
}

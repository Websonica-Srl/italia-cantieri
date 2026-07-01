import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';
import {
  getCantieriByRegione,
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
 * Sitemap split (Next.js generateSitemaps) in 4 shard, ognuno servito su
 * /sitemap/{id}.xml (indice automatico in /sitemap.xml/{id}, vedi Next.js docs):
 *  - static:   pagine statiche del sito
 *  - geo:      regioni + province + comuni (dato persistente)
 *  - pillar:   /cantieri, /guide + pillar intervento/guida con answerFirst non vuoto (no stub)
 *  - cantieri: SOLO foglie index-gate (getIndexableCantieriSlugs, scheda_pubblicabile=true)
 *
 * /esplora e /lavori/* sono sempre noindex,follow: non entrano in nessuno shard.
 *
 * Le schede bando vivono sul portale dedicato bandigaredappalto.it (canonica lì):
 * non le elenchiamo qui per evitare contenuto duplicato. La pagina /bandi resta
 * come teaser editoriale (inclusa nello shard static).
 */
export async function generateSitemaps() {
  return [{ id: 'static' }, { id: 'geo' }, { id: 'pillar' }, { id: 'cantieri' }];
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.baseUrl;
  const now = new Date();

  if (id === 'cantieri') {
    // Solo foglie che hanno superato il gate index (scheda_pubblicabile=true): le
    // foglie noindex restano fuori dalla sitemap per costruzione della query.
    const slugs = await getIndexableCantieriSlugs(5000);
    return slugs.map((c) => ({
      url: `${baseUrl}/cantiere/${c.slug}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : now,
      changeFrequency: 'monthly',
      priority: 0.5,
    }));
  }

  if (id === 'pillar') {
    const interventi = getInterventoPillarSlugs()
      .map((s) => getPillar('intervento', s))
      .filter((p): p is NonNullable<typeof p> => !!p && !!p.answerFirst);
    const guide = getGuidaPillarSlugs()
      .map((s) => getPillar('guida', s))
      .filter((p): p is NonNullable<typeof p> => !!p && !!p.answerFirst);

    return [
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
  }

  if (id === 'geo') {
    // Regioni
    const regioni = await getCantieriByRegione();
    const regionPages: MetadataRoute.Sitemap = regioni.map((r) => ({
      url: `${baseUrl}/${regioneSlug(r.regione)}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    }));

    // Province (per ogni regione)
    const province = await getAllProvince();
    const provinciaPages: MetadataRoute.Sitemap = province.slice(0, 200).map((p) => ({
      url: `${baseUrl}/${regioneSlug(p.regione)}/${provinciaSlugFromCode(p.provincia)}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.75,
    }));

    // Comuni (max 500 dedup)
    const comuni = await getAllComuni(500);
    const comunePages: MetadataRoute.Sitemap = comuni.map((c) => ({
      url: `${baseUrl}/comune/${slugify(c.comune)}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    }));

    return [...regionPages, ...provinciaPages, ...comunePages];
  }

  // id === 'static'
  return [
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
}

/**
 * Centralized Unsplash image registry.
 *
 * IMPORTANT: ogni foto è soggetta a Unsplash License (free for commercial use).
 * Le attribution sono renderizzate dove appropriato (es. cantiere dettaglio).
 *
 * Tutte le URL puntano direttamente al CDN `images.unsplash.com` (già whitelistato
 * in `next.config.js`), così Next.js può ottimizzarle via `next/image` senza
 * dover bundlerizzare i binari nel repo.
 */

type UnsplashImage = {
  id: string;
  src: string;
  blurDataURL?: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
  photoUrl: string;
};

const cdn = (photoId: string, w = 1920, h = 1080) =>
  `https://images.unsplash.com/${photoId}?w=${w}&h=${h}&fit=crop&q=80&fm=webp&auto=format`;

export const HERO_CONSTRUCTION: UnsplashImage = {
  id: 'iv4f6n6f944',
  src: cdn('photo-1778184665117-44eb2e20b2f4', 2400, 1350),
  alt:
    'Cantiere edilizio italiano con teli di sicurezza gialli e operai al lavoro, vista cinematica',
  photographer: 'Arno Senoner',
  photographerUrl: 'https://unsplash.com/@arnosenoner',
  photoUrl: 'https://unsplash.com/photos/iv4f6n6f944',
};

export const HERO_MILAN_SKYLINE: UnsplashImage = {
  id: 'xdseS1jekK8',
  src: cdn('photo-1742148186848-8b257455009b', 2400, 1350),
  alt: 'Skyline di Milano con grattacieli e luce solare, vista panoramica',
  photographer: 'Adriana Sas',
  photographerUrl: 'https://unsplash.com/@onnos',
  photoUrl: 'https://unsplash.com/photos/xdseS1jekK8',
};

export const URBAN_CRANE: UnsplashImage = {
  id: 'KFX20CyKzZc',
  src: cdn('photo-1618764889055-628b7adacfe1', 2400, 1350),
  alt: 'Gru rossa di cantiere accanto a grattacieli, vista urbana',
  photographer: 'Babak Habibi',
  photographerUrl: 'https://unsplash.com/@babak20',
  photoUrl: 'https://unsplash.com/photos/KFX20CyKzZc',
};

export const ARCHITECT_BLUEPRINT: UnsplashImage = {
  id: 'HtBlQdxfG9k',
  src: cdn('photo-1503387762-592deb58ef4e', 1600, 1000),
  alt: 'Architetto al lavoro su una tavola tecnica con matita e righello',
  photographer: 'Daniel McCullough',
  photographerUrl: 'https://unsplash.com/@d_mccullough',
  photoUrl: 'https://unsplash.com/photos/HtBlQdxfG9k',
};

export const URBAN_RENOVATION: UnsplashImage = {
  id: 'wrE2MS2VR9I',
  src: cdn('photo-1716641818730-377d944725c6', 1600, 1000),
  alt: 'Edificio storico europeo in ristrutturazione con ponteggi metallici',
  photographer: 'Artists Eyes',
  photographerUrl: 'https://unsplash.com/@artistseyes',
  photoUrl: 'https://unsplash.com/photos/wrE2MS2VR9I',
};

export const COASTAL_CONSTRUCTION: UnsplashImage = {
  id: '5EbSXvtlxuA',
  src: cdn('photo-1629916109642-30d675efeb5e', 1600, 1000),
  alt: 'Gru gialla di cantiere vicino ad uno specchio d acqua, costa italiana',
  photographer: 'Folco Masi',
  photographerUrl: 'https://unsplash.com/@folcomasi',
  photoUrl: 'https://unsplash.com/photos/5EbSXvtlxuA',
};

/**
 * Mappa regione italiana → immagine hero contestuale.
 * Fallback: HERO_CONSTRUCTION.
 */
export function getRegionHero(regione: string): UnsplashImage {
  const key = regione.toLowerCase().trim();
  if (key.includes('lombard')) return HERO_MILAN_SKYLINE;
  if (key.includes('piemont')) return URBAN_CRANE;
  if (key.includes('emilia')) return URBAN_RENOVATION;
  if (key.includes('liguri')) return COASTAL_CONSTRUCTION;
  if (key.includes('veneto')) return URBAN_RENOVATION;
  if (key.includes('lazio')) return URBAN_CRANE;
  if (key.includes('toscana')) return URBAN_RENOVATION;
  return HERO_CONSTRUCTION;
}

/**
 * HTML attribution per pagina (footer/aside legale).
 * Conforme alle linee guida Unsplash API.
 */
export function unsplashAttributionHtml(img: UnsplashImage): string {
  return `Foto di <a href="${img.photographerUrl}?utm_source=italiacantieri&utm_medium=referral" rel="noopener noreferrer" target="_blank">${img.photographer}</a> su <a href="https://unsplash.com/?utm_source=italiacantieri&utm_medium=referral" rel="noopener noreferrer" target="_blank">Unsplash</a>`;
}

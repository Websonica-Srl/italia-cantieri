/**
 * Generatori JSON-LD schema.org per italiacantieri.it.
 * Escape </script> per evitare injection.
 */
import { Cantiere } from '@/lib/supabase/queries/cantieri';
import { Bando } from '@/lib/supabase/queries/bandi';
import { siteConfig } from '@/lib/site-config';
import { parseCoordinate } from '@/lib/utils';

/** Escape sicuro per JSON-LD inline in HTML. */
export function safeJsonLd(obj: any): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

/** Organization base */
export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.baseUrl,
    description: siteConfig.description,
    sameAs: siteConfig.network.map((n) => n.url),
  };
}

/** WebSite con SearchAction */
export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.baseUrl}/comune/{search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Schema.org ConstructionProject (Project + additionalType).
 */
export function cantiereLd(c: Cantiere) {
  const coords = parseCoordinate(c.coordinate);
  return {
    '@context': 'https://schema.org',
    '@type': 'Project',
    additionalType: 'https://schema.org/ConstructionProject',
    name: c.descrizione || `${c.tipo_titolo || 'Cantiere'} – ${c.protocollo || c.comune}`,
    description: c.descrizione,
    identifier: c.protocollo || c.id,
    url: `${siteConfig.baseUrl}/cantiere/${c.slug}`,
    location: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: [c.indirizzo, c.civico].filter(Boolean).join(' ') || undefined,
        postalCode: c.cap || undefined,
        addressLocality: c.comune,
        addressRegion: c.regione,
        addressCountry: 'IT',
      },
      ...(coords ? { geo: { '@type': 'GeoCoordinates', latitude: coords.lat, longitude: coords.lng } } : {}),
    },
    ...(c.importo_lavori
      ? { estimatedCost: { '@type': 'MonetaryAmount', currency: 'EUR', value: c.importo_lavori } }
      : {}),
    ...(c.data_inizio_lavori ? { startDate: c.data_inizio_lavori } : {}),
    ...(c.data_fine_lavori_prevista ? { endDate: c.data_fine_lavori_prevista } : {}),
    ...(c.data_rilascio ? { dateCreated: c.data_rilascio } : {}),
    keywords: (c.categorie || []).join(', '),
    isBasedOn: {
      '@type': 'CreativeWork',
      name: `Fonte: ${c.fonte_tipo || 'open data PA'}`,
      dateCreated: c.fonte_pubblicazione_data || undefined,
    },
  };
}

/** GovernmentService / Bando di gara */
export function bandoLd(b: Bando) {
  return {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: b.oggetto,
    description: b.descrizione_completa,
    identifier: b.cig || b.numero_bando || b.id,
    url: `${siteConfig.baseUrl}/bando/${b.slug}`,
    serviceType: b.tipo_procedura,
    provider: {
      '@type': 'GovernmentOrganization',
      name: b.stazione_appaltante,
      ...(b.comune
        ? {
            address: {
              '@type': 'PostalAddress',
              addressLocality: b.comune,
              addressRegion: b.regione,
              addressCountry: 'IT',
            },
          }
        : {}),
    },
    ...(b.importo_base
      ? {
          offers: {
            '@type': 'Offer',
            price: b.importo_base,
            priceCurrency: 'EUR',
            availability: b.stato === 'pubblicato' ? 'https://schema.org/InStock' : 'https://schema.org/Discontinued',
            validThrough: b.scadenza_offerte,
          },
        }
      : {}),
  };
}

/** FAQ schema.org */
export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

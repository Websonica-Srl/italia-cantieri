import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, MapPin, FileText, Hash, Tag, Database, Building2 } from 'lucide-react';
import { getCantiereBySlug, countFirmsByComune } from '@/lib/supabase/queries/cantieri';
import { formatDate, formatEuro, formatNumber, regioneSlug, provinciaSlug, slugify } from '@/lib/utils';
import { cantiereLd, safeJsonLd } from '@/lib/seo/structured-data';
import { siteConfig } from '@/lib/site-config';
import BreadcrumbCantiere from '@/components/cantieri/BreadcrumbCantiere';
import MappaCantiereSingolo from '@/components/cantieri/MappaCantiereSingolo';
import RichiediRimozioneCTA from '@/components/cantieri/RichiediRimozioneCTA';
import CrossLinkCorrelati from '@/components/cantieri/CrossLinkCorrelati';

export const revalidate = 3600;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const c = await getCantiereBySlug(params.slug);
  if (!c) return { title: 'Cantiere non trovato' };
  const title = `${c.tipo_titolo || 'Cantiere'} a ${c.comune} — ${c.protocollo || 'Italia Cantieri'}`;
  const description =
    (c.descrizione || `Cantiere edilizio a ${c.comune} (${c.provincia}, ${c.regione}). Permesso di costruire pubblico.`).slice(0, 160);
  return {
    title,
    description,
    alternates: { canonical: `/cantiere/${c.slug}` },
    openGraph: { title, description, type: 'article' },
  };
}

export default async function CantierePage({ params }: PageProps) {
  const c = await getCantiereBySlug(params.slug);
  if (!c) notFound();

  const indirizzoCompleto = [c.indirizzo, c.civico].filter(Boolean).join(' ');
  const firmCount = await countFirmsByComune(c.comune);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(cantiereLd(c)) }}
      />
      <section className="py-12 md:py-16">
        <div className="container-zen max-w-5xl">
          <BreadcrumbCantiere
            steps={[
              { label: 'Regioni', href: '/regioni' },
              { label: c.regione, href: `/${regioneSlug(c.regione)}` },
              { label: `Provincia di ${c.provincia}`, href: `/${regioneSlug(c.regione)}/${provinciaSlug(c.provincia)}` },
              { label: c.comune, href: `/comune/${slugify(c.comune)}` },
              { label: c.protocollo || c.slug },
            ]}
          />

          {/* HEADER */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold">
                <FileText className="h-3 w-3" /> {c.tipo_titolo || 'Cantiere edilizio'}
              </span>
              {c.stato && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary text-foreground px-3 py-1 text-xs font-medium border border-border">
                  Stato: {c.stato}
                </span>
              )}
              {c.categorie?.map((cat) => (
                <span key={cat} className="inline-flex items-center gap-1.5 rounded-full bg-secondary text-foreground/80 px-3 py-1 text-xs">
                  <Tag className="h-3 w-3" /> {cat}
                </span>
              ))}
            </div>
            <h1 className="heading-section mb-3">
              {c.descrizione || `${c.tipo_titolo || 'Cantiere'} a ${c.comune}`}
            </h1>
            <p className="text-muted-foreground inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {indirizzoCompleto ? `${indirizzoCompleto}, ` : ''}
              <Link href={`/comune/${slugify(c.comune)}`} className="text-foreground hover:underline">
                {c.comune}
              </Link>{' '}
              ({c.provincia}, {c.regione})
            </p>
          </div>

          {/* MAPPA */}
          <div className="mb-10">
            <MappaCantiereSingolo coordinate={c.coordinate} indirizzo={indirizzoCompleto} comune={c.comune} />
          </div>

          {/* GRID DATI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="text-base font-semibold mb-4 inline-flex items-center gap-2">
                <FileText className="h-4 w-4" /> Dati amministrativi
              </h2>
              <dl className="space-y-3 text-sm">
                {c.protocollo && (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground inline-flex items-center gap-1"><Hash className="h-3 w-3" />Protocollo</dt><dd className="font-medium">{c.protocollo}</dd></div>
                )}
                {c.tipo_titolo && (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Tipo titolo</dt><dd className="font-medium">{c.tipo_titolo}</dd></div>
                )}
                {c.data_pubblicazione && (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground inline-flex items-center gap-1"><Calendar className="h-3 w-3" />Pubblicazione</dt><dd className="font-medium">{formatDate(c.data_pubblicazione)}</dd></div>
                )}
                {c.data_rilascio && (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Rilascio</dt><dd className="font-medium">{formatDate(c.data_rilascio)}</dd></div>
                )}
                {c.data_inizio_lavori && (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Inizio lavori</dt><dd className="font-medium">{formatDate(c.data_inizio_lavori)}</dd></div>
                )}
                {c.data_fine_lavori_prevista && (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Fine prevista</dt><dd className="font-medium">{formatDate(c.data_fine_lavori_prevista)}</dd></div>
                )}
                {c.cap && (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">CAP</dt><dd className="font-medium">{c.cap}</dd></div>
                )}
                {c.codice_istat && (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Codice ISTAT</dt><dd className="font-medium">{c.codice_istat}</dd></div>
                )}
              </dl>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="text-base font-semibold mb-4 inline-flex items-center gap-2">
                <Building2 className="h-4 w-4" /> Dati tecnici e economici
              </h2>
              <dl className="space-y-3 text-sm">
                {c.importo_lavori ? (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Importo lavori</dt><dd className="font-semibold text-lg">{formatEuro(c.importo_lavori)}</dd></div>
                ) : (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Importo lavori</dt><dd className="text-muted-foreground">non dichiarato</dd></div>
                )}
                {c.superficie_mq && (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Superficie</dt><dd className="font-medium">{formatNumber(c.superficie_mq)} m²</dd></div>
                )}
                {c.cubatura_mc && (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Cubatura</dt><dd className="font-medium">{formatNumber(c.cubatura_mc)} m³</dd></div>
                )}
                {c.unita_abitative !== null && c.unita_abitative !== undefined && (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Unità abitative</dt><dd className="font-medium">{c.unita_abitative}</dd></div>
                )}
                {c.quartiere && (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Quartiere</dt><dd className="font-medium">{c.quartiere}</dd></div>
                )}
              </dl>
            </div>
          </div>

          {/* FONTE */}
          <div className="rounded-2xl border border-border bg-secondary/50 p-5 mb-10">
            <h2 className="text-sm font-semibold mb-2 inline-flex items-center gap-2">
              <Database className="h-4 w-4" /> Trasparenza e fonte
            </h2>
            <div className="text-sm text-secondary-text space-y-1">
              <p>
                <strong>Tipo fonte:</strong> {c.fonte_tipo || 'open data PA'}
              </p>
              {c.fonte_pubblicazione_data && (
                <p>
                  <strong>Pubblicato dalla fonte il:</strong> {formatDate(c.fonte_pubblicazione_data)}
                </p>
              )}
              <p className="text-xs opacity-80 pt-2">
                Base legale: Art. 6.1.f GDPR (legittimo interesse) + Art. 14 GDPR (informativa). Maggiori dettagli alla{' '}
                <Link href="/come-trattiamo-i-dati" className="underline">pagina trasparenza dati</Link>.
              </p>
            </div>
          </div>

          {/* OPT-OUT */}
          <div className="mb-10">
            <RichiediRimozioneCTA cantiereId={c.id} protocollo={c.protocollo || undefined} comune={c.comune} />
          </div>

          {/* CROSS LINK */}
          <CrossLinkCorrelati comune={c.comune} countImprese={firmCount} />
        </div>
      </section>
    </>
  );
}

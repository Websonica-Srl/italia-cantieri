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
import FAQ from '@/components/cantieri/FAQ';
import UnlockPremiumCTA from '@/components/cantieri/UnlockPremiumCTA';
import DatiPremiumLocked from '@/components/cantieri/DatiPremiumLocked';
import CantieriSimiliVicini from '@/components/cantieri/CantieriSimiliVicini';

export const revalidate = 3600;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const c = await getCantiereBySlug(params.slug);
  if (!c) return { title: 'Cantiere non trovato' };
  const tipoTitolo = c.tipo_titolo || 'Cantiere edilizio';
  const title = `${tipoTitolo} a ${c.comune} (${c.provincia})${c.protocollo ? ` — Prot. ${c.protocollo}` : ''}`;
  const importo = c.importo_lavori ? ` Importo ${formatEuro(c.importo_lavori, { compact: true })}.` : '';
  const description = (
    c.descrizione
      ? `${c.descrizione}${importo} Dati ufficiali pubblicati dall'albo pretorio comunale.`
      : `${tipoTitolo} pubblicato a ${c.comune}, ${c.regione}.${importo} Scopri dettagli, mappa e contatti professionisti.`
  ).slice(0, 160);
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

  const cantiereFaq = [
    {
      q: 'Chi e il progettista o l\'impresa che lavora su questo cantiere?',
      a: `I dati di progettisti, studi e imprese collegati ai cantieri di ${c.comune} sono disponibili nel network ItaliaProgettisti. Iscriviti gratis per consultare i profili professionali della zona e attivare il contatto diretto.`,
    },
    {
      q: 'Cosa significa "tipo titolo" PDC, SCIA, CILA?',
      a: 'PDC = Permesso di Costruire (interventi rilevanti, autorizzazione preventiva). SCIA = Segnalazione Certificata di Inizio Attivita (interventi minori, comunicazione asseverata). CILA = Comunicazione Inizio Lavori Asseverata (manutenzione straordinaria con asseverazione tecnica).',
    },
    {
      q: 'I dati di questo cantiere sono verificati?',
      a: `Si. I dati provengono direttamente dall'albo pretorio del Comune di ${c.comune} o dal portale open data della Pubblica Amministrazione locale. La fonte e la data di pubblicazione originale sono dichiarate piu sopra nella scheda.`,
    },
    {
      q: 'Sono il titolare del cantiere. Come posso chiedere modifiche o rimozione?',
      a: 'Usa il pulsante "Richiedi rettifica o rimozione" qui sotto, oppure scrivi al nostro DPO. Le richieste vengono valutate entro 30 giorni come previsto dal GDPR (Art. 15-22).',
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(cantiereLd(c)) }}
      />
      <section className="py-10 md:py-14">
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
          <div className="mb-6 md:mb-8">
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
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary text-foreground/80 px-3 py-1 text-xs"
                >
                  <Tag className="h-3 w-3" /> {cat}
                </span>
              ))}
            </div>
            <h1 className="heading-section mb-3 tracking-tight">
              {c.descrizione || `${c.tipo_titolo || 'Cantiere edilizio'} a ${c.comune}`}
            </h1>
            <p className="text-muted-foreground inline-flex items-center gap-1.5 flex-wrap">
              <MapPin className="h-4 w-4" strokeWidth={1.5} />
              {indirizzoCompleto ? `${indirizzoCompleto}, ` : ''}
              <Link
                href={`/comune/${slugify(c.comune)}`}
                className="text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                {c.comune}
              </Link>{' '}
              ({c.provincia}, {c.regione})
            </p>
          </div>

          {/* R1 HIGH: CTA SBLOCCA - ABOVE-THE-FOLD */}
          <div className="mb-8 md:mb-10">
            <UnlockPremiumCTA slug={c.slug} comune={c.comune} />
          </div>

          {/* MAPPA */}
          <div className="mb-10">
            <MappaCantiereSingolo coordinate={c.coordinate} indirizzo={indirizzoCompleto} comune={c.comune} />
          </div>

          {/* GRID DATI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-10">
            <div className="rounded-3xl border border-border bg-white p-6 transition-shadow duration-200 hover:shadow-sm">
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

            <div className="rounded-3xl border border-border bg-white p-6 transition-shadow duration-200 hover:shadow-sm">
              <h2 className="text-base font-semibold mb-4 inline-flex items-center gap-2">
                <Building2 className="h-4 w-4" /> Dati tecnici ed economici
              </h2>
              <dl className="space-y-3 text-sm">
                {c.importo_lavori ? (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Importo lavori</dt><dd className="font-semibold text-lg tabular-nums">{formatEuro(c.importo_lavori)}</dd></div>
                ) : (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Importo lavori</dt><dd className="text-muted-foreground">non dichiarato</dd></div>
                )}
                {c.superficie_mq && (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Superficie</dt><dd className="font-medium tabular-nums">{formatNumber(c.superficie_mq)} m²</dd></div>
                )}
                {c.cubatura_mc && (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Cubatura</dt><dd className="font-medium tabular-nums">{formatNumber(c.cubatura_mc)} m³</dd></div>
                )}
                {c.unita_abitative !== null && c.unita_abitative !== undefined && (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Unita abitative</dt><dd className="font-medium">{c.unita_abitative}</dd></div>
                )}
                {c.quartiere && (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Quartiere</dt><dd className="font-medium">{c.quartiere}</dd></div>
                )}
              </dl>
            </div>
          </div>

          {/* R2 HIGH: DATI PREMIUM LOCKED PREVIEW */}
          <div className="mb-10">
            <DatiPremiumLocked slug={c.slug} comune={c.comune} />
          </div>

          {/* CANTIERI SIMILI VICINI (engagement + crosslink SEO) */}
          <div className="mb-10">
            <CantieriSimiliVicini currentSlug={c.slug} comune={c.comune} />
          </div>

          {/* FONTE */}
          <div className="rounded-3xl border border-border bg-secondary/50 p-5 mb-10">
            <h2 className="text-sm font-semibold mb-2 inline-flex items-center gap-2">
              <Database className="h-4 w-4" /> Trasparenza e fonte dei dati
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
                Base legale: Art. 6.1.f GDPR (legittimo interesse alla trasparenza pubblica) + Art. 14 GDPR (informativa
                per dati raccolti da terzi). Maggiori dettagli alla{' '}
                <Link
                  href="/come-trattiamo-i-dati"
                  className="underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  pagina trasparenza dati
                </Link>
                .
              </p>
            </div>
          </div>

          {/* OPT-OUT */}
          <div className="mb-10">
            <RichiediRimozioneCTA cantiereId={c.id} protocollo={c.protocollo || undefined} comune={c.comune} />
          </div>

          {/* CROSS LINK (R9 potenziato) */}
          <CrossLinkCorrelati comune={c.comune} countImprese={firmCount} cantiereSlug={c.slug} />

          <FAQ
            title="Domande frequenti su questo cantiere"
            items={cantiereFaq}
          />
        </div>
      </section>
    </>
  );
}

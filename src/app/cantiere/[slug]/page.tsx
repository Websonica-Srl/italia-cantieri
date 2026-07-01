import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Hash, MapPin, Quote } from 'lucide-react';
import {
  getCantiereSchedaBySlug,
  getCantieriScheda,
  unitaOf,
  mqOf,
} from '@/lib/supabase/queries/cantieri-scheda';
import { countFirmsByComune } from '@/lib/supabase/queries/cantieri';
import { isCantiereIndexable } from '@/lib/seo/indexable';
import {
  displayInterventoLabel,
  mestiereLabel,
  mestiereSlug,
  isMeaningful,
  formatValoreRange,
  type Mestiere,
} from '@websonica/cantieri-core';
import { formatDate, formatEuro, formatNumber, regioneSlug, slugify } from '@/lib/utils';
import { provinciaSlugFromCode, provinciaNameFromCode } from '@/lib/province';
import { cantiereLd, faqLd, safeJsonLd, ogImageUrl } from '@/lib/seo/structured-data';
import type { CantiereScheda } from '@/lib/supabase/queries/cantieri-scheda';
import BreadcrumbCantiere from '@/components/cantieri/BreadcrumbCantiere';
import RichiediRimozioneCTA from '@/components/cantieri/RichiediRimozioneCTA';
import CrossLinkCorrelati from '@/components/cantieri/CrossLinkCorrelati';
import FAQ from '@/components/cantieri/FAQ';
import CardScheda from '@/components/cantieri/CardScheda';
import CardSchedaCompact from '@/components/cantieri/CardSchedaCompact';
import TeaserPremiumR7 from '@/components/cantieri/TeaserPremiumR7';
import AlertCantieriCTA from '@/components/cantieri/AlertCantieriCTA';
import CantieriSimiliVicini from '@/components/cantieri/CantieriSimiliVicini';
import ScrollProgress from '@/components/cantieri/ScrollProgress';
import DividerOrnament from '@/components/cantieri/DividerOrnament';

export const revalidate = 3600;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const c = await getCantiereSchedaBySlug(params.slug);
  if (!c) return { title: 'Cantiere non trovato' };
  const indexable = isCantiereIndexable(c);
  const titolo = c.intervento_categoria ? displayInterventoLabel(c.intervento_categoria) : null;
  const tipoTitolo = titolo || c.tipo_titolo || 'Cantiere edilizio';
  const title = `${tipoTitolo} a ${c.comune} (${c.provincia})${c.protocollo ? ` — Prot. ${c.protocollo}` : ''}`;
  const importo = c.importo_lavori ? ` Importo lavori ${formatEuro(c.importo_lavori, { compact: true })}.` : '';
  const hasMeaningfulDesc =
    c.descrizione && c.descrizione.trim().toLowerCase() !== tipoTitolo.trim().toLowerCase();
  const description = (
    hasMeaningfulDesc
      ? `${c.descrizione} — ${tipoTitolo} a ${c.comune} (${c.provincia}, ${c.regione}).${importo} Dati ufficiali dall'albo pretorio comunale.`
      : `${tipoTitolo} pubblicato a ${c.comune} (${c.provincia}, ${c.regione}).${importo} Dati ufficiali dall'albo pretorio. Scopri dettagli, fonte e professionisti collegati.`
  ).slice(0, 160);
  const ogImage = ogImageUrl({
    title: `${tipoTitolo} a ${c.comune}`,
    subtitle: c.protocollo
      ? `Prot. ${c.protocollo} · ${c.provincia}, ${c.regione}`
      : `${c.provincia}, ${c.regione}`,
    kind: 'cantiere',
    ...(c.importo_lavori
      ? { count: formatEuro(c.importo_lavori, { compact: true }), label: 'importo lavori' }
      : {}),
  });
  return {
    title,
    description,
    alternates: { canonical: `/cantiere/${c.slug}` },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: `/cantiere/${c.slug}`,
      type: 'article',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

/** Compone la risposta-first citabile (2-3 frasi: intervento, destinazione, scala, stato). */
function buildRispostaFirst(c: CantiereScheda): string {
  const titolo = c.intervento_categoria ? displayInterventoLabel(c.intervento_categoria) : null;
  const frasi: string[] = [];

  const apertura = titolo
    ? `${titolo} a ${c.comune} (${c.provincia}), pubblicato tramite ${c.tipo_titolo || 'titolo edilizio'}.`
    : `Cantiere a ${c.comune} (${c.provincia}), pubblicato tramite ${c.tipo_titolo || 'titolo edilizio'}.`;
  frasi.push(apertura);

  if (isMeaningful(c.destinazione_uso)) {
    frasi.push(`Destinazione d'uso: ${c.destinazione_uso}.`);
  }
  if (isMeaningful(c.scala)) {
    const scalaLabel = c.scala === 'grande' ? 'grande scala' : c.scala === 'medio' ? 'media scala' : 'intervento puntuale';
    frasi.push(`Si tratta di un ${scalaLabel}.`);
  }
  if (c.stato) {
    frasi.push(`Stato attuale: ${c.stato}.`);
  }

  return frasi.slice(0, 3).join(' ');
}

export default async function CantierePage({ params }: PageProps) {
  const c = await getCantiereSchedaBySlug(params.slug);
  if (!c) notFound();

  const [firmCount, correlatiComune] = await Promise.all([
    countFirmsByComune(c.comune),
    getCantieriScheda({ comune: c.comune, limit: 4 }, 'list'),
  ]);
  const correlati = correlatiComune.data.filter((x) => x.slug !== c.slug).slice(0, 3);

  const titolo = c.intervento_categoria ? displayInterventoLabel(c.intervento_categoria) : null;
  const h1 = `${titolo ?? 'Cantiere'} a ${c.comune}`;
  const rispostaFirst = buildRispostaFirst(c);
  const mestieri = (c.mestieri as Mestiere[] | null) ?? [];
  const frasiSorgente = c.scheda?.frasi_sorgente ?? [];
  const unita = unitaOf(c);
  const mq = mqOf(c);
  const valoreLabel = formatValoreRange(c.valore_min, c.valore_max, c.valore_metodo);

  const cantiereFaq = [
    {
      q: `Sono un'impresa: come intercetto i nuovi cantieri a ${c.comune}?`,
      a: `Per tutela della privacy non pubblichiamo i dati personali di progettisti o titolari estratti dagli atti. Se sei un'impresa (edile, serramentista, impiantista) puoi registrarti gratis su ItaliaProgettisti e ricevere gli avvisi sui nuovi cantieri della zona di ${c.comune} appena vengono pubblicati, per proporti sui lavori prima degli altri.`,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLd(cantiereFaq)) }}
      />
      <ScrollProgress />
      <section className="pt-32 md:pt-40 pb-10 md:pb-14 relative isolate">
        {/* Soft gradient backdrop hero */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[420px] -z-10 bg-gradient-to-b from-secondary/60 via-background to-background"
        />
        <div
          aria-hidden="true"
          className="absolute right-[-10%] top-12 h-[320px] w-[520px] -z-10 rounded-full bg-construction/[0.05] blur-3xl pointer-events-none"
        />

        <div className="container-zen max-w-5xl">
          {/* 1. BREADCRUMB */}
          <BreadcrumbCantiere
            steps={[
              { label: 'Regioni', href: '/regioni' },
              { label: c.regione, href: `/${regioneSlug(c.regione)}` },
              { label: `Provincia di ${provinciaNameFromCode(c.provincia)}`, href: `/${regioneSlug(c.regione)}/${provinciaSlugFromCode(c.provincia)}` },
              { label: c.comune, href: `/comune/${slugify(c.comune)}` },
              { label: c.protocollo || c.slug },
            ]}
          />

          {/* 2. H1 deterministico */}
          <div className="mb-6 md:mb-8">
            <h1
              className="font-black tracking-[-0.035em] leading-[1.05] mb-4 text-foreground text-balance break-words"
              style={{ fontSize: 'clamp(1.65rem, 2.6vw + 0.8rem, 2.75rem)' }}
            >
              {h1}
            </h1>
            <p className="body-default text-muted-foreground inline-flex items-center gap-2 flex-wrap">
              <MapPin className="h-4 w-4" strokeWidth={1.75} />
              <Link
                href={`/comune/${slugify(c.comune)}`}
                className="text-foreground hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm font-semibold"
              >
                {c.comune}
              </Link>{' '}
              <span className="text-muted-foreground/80">({c.provincia}, {c.regione})</span>
            </p>
          </div>

          {/* 3. RISPOSTA-FIRST CITABILE */}
          <div className="mb-8 md:mb-10 rounded-3xl border border-border bg-card p-6 md:p-7">
            <p className="text-base md:text-lg leading-relaxed text-foreground">{rispostaFirst}</p>
          </div>

          {/* 4. TRASPARENZA + FONTE (con frasi_sorgente citate) */}
          <div className="mb-10">
            <p className="text-xs text-secondary-text mb-3">
              Fonte: {c.fonte_tipo || 'open data PA'}
              {c.fonte_pubblicazione_data ? ` · pubblicato il ${formatDate(c.fonte_pubblicazione_data)}` : ''}
              {' · '}dati pubblici trattati nel rispetto del GDPR.
            </p>
            {frasiSorgente.length > 0 && (
              <ul className="space-y-2">
                {frasiSorgente.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm text-secondary-text"
                  >
                    <Quote className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-muted-foreground" strokeWidth={1.75} />
                    <span>
                      <span className="font-medium text-foreground">{f.campo}: </span>
                      &laquo;{f.frase}&raquo;
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4">
              <RichiediRimozioneCTA cantiereId={c.id} protocollo={c.protocollo || undefined} comune={c.comune} />
            </div>
          </div>

          {/* 5. CARD SCHEDA */}
          <div className="mb-10">
            <CardScheda c={c} />
          </div>

          {/* 6. MESTIERI (navigazione interna) */}
          {mestieri.length > 0 && (
            <div className="mb-10">
              <h2 className="text-base font-bold mb-3 tracking-tight">Lavori collegati a questo cantiere</h2>
              <div className="flex flex-wrap gap-2">
                {mestieri.map((m) => (
                  <Link
                    key={m}
                    href={`/lavori/${mestiereSlug(m)}`}
                    className="chip hover:bg-foreground hover:text-background transition-colors"
                  >
                    {mestiereLabel(m)}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <DividerOrnament variant="line" spacing="tight" />

          {/* 7. TABELLA DATI GREZZI (legacy) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-10">
            <div className="rounded-3xl border border-border bg-card p-6 md:p-7 shadow-diffusion transition-all duration-300 hover:border-foreground/20">
              <h2 className="text-base font-bold mb-4 inline-flex items-center gap-2 tracking-tight">
                Dati amministrativi
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

            <div className="rounded-3xl border border-border bg-card p-6 md:p-7 shadow-diffusion transition-all duration-300 hover:border-foreground/20">
              <h2 className="text-base font-bold mb-4 inline-flex items-center gap-2 tracking-tight">
                Dati tecnici ed economici
              </h2>
              <dl className="space-y-3 text-sm">
                {c.importo_lavori ? (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Importo lavori</dt><dd className="font-semibold text-lg tabular-nums">{formatEuro(c.importo_lavori)}</dd></div>
                ) : valoreLabel ? (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Valore stimato</dt><dd className="font-semibold text-lg tabular-nums">{valoreLabel}</dd></div>
                ) : null}
                {mq != null && (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Superficie</dt><dd className="font-medium tabular-nums">{formatNumber(mq)} m²</dd></div>
                )}
                {c.cubatura_mc && (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Cubatura</dt><dd className="font-medium tabular-nums">{formatNumber(c.cubatura_mc)} m³</dd></div>
                )}
                {unita != null && (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Unita abitative</dt><dd className="font-medium">{unita}</dd></div>
                )}
                {c.quartiere && (
                  <div className="flex gap-3"><dt className="w-40 flex-shrink-0 text-muted-foreground">Quartiere</dt><dd className="font-medium">{c.quartiere}</dd></div>
                )}
              </dl>
            </div>
          </div>

          {/* 8. TEASER PREMIUM R7 (sostituisce UnlockPremiumCTA + DatiPremiumLocked) */}
          <div className="mb-10">
            <TeaserPremiumR7 c={c} />
          </div>

          {/* 9. CORRELATI: stesso comune (CantieriSimiliVicini) + stesso comune via scheda (CardSchedaCompact) */}
          <div className="mb-10">
            <CantieriSimiliVicini currentSlug={c.slug} comune={c.comune} />
          </div>

          {correlati.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg md:text-xl font-bold mb-4">Cantieri arricchiti a {c.comune}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {correlati.map((cc) => (
                  <CardSchedaCompact key={cc.id} c={cc} />
                ))}
              </div>
            </div>
          )}

          {/* CROSS LINK (R9 potenziato) */}
          <div className="mb-10">
            <CrossLinkCorrelati comune={c.comune} countImprese={firmCount} cantiereSlug={c.slug} />
          </div>

          {/* ALERT CANTIERI (prima della FAQ) */}
          <div className="mb-10">
            <AlertCantieriCTA scope={{ comune: c.comune, provincia: c.provincia, regione: c.regione }} />
          </div>

          {/* 10. FAQ */}
          <FAQ
            title="Domande frequenti su questo cantiere"
            items={cantiereFaq}
            skipJsonLd
          />
        </div>
      </section>
    </>
  );
}

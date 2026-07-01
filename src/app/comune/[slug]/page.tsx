import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Lock, Info } from 'lucide-react';
import {
  getAggregatiAnonimiByComune,
  countFirmsByComune,
  getAllComuni,
} from '@/lib/supabase/queries/cantieri';
import { getCantieriScheda, getEnrichedCount } from '@/lib/supabase/queries/cantieri-scheda';
import { isAggregateIndexable } from '@/lib/seo/indexable';
import { slugify, formatNumber, formatEuro, regioneSlug } from '@/lib/utils';
import { provinciaSlugFromCode, provinciaNameFromCode } from '@/lib/province';
import BreadcrumbCantiere from '@/components/cantieri/BreadcrumbCantiere';
import StatsBox from '@/components/cantieri/StatsBox';
import CardSchedaCompact from '@/components/cantieri/CardSchedaCompact';
import AlertCantieriCTA from '@/components/cantieri/AlertCantieriCTA';
import CrossLinkCorrelati from '@/components/cantieri/CrossLinkCorrelati';
import BarChart from '@/components/cantieri/BarChart';
import FAQ from '@/components/cantieri/FAQ';
import { ogImageUrl } from '@/lib/seo/structured-data';

export const revalidate = 3600;

interface PageProps {
  params: { slug: string };
}

async function resolveComune(slug: string): Promise<{ comune: string; provincia: string; regione: string } | null> {
  const all = await getAllComuni();
  const target = slug.toLowerCase();
  const hit = all.find((c) => slugify(c.comune) === target);
  return hit || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const comune = await resolveComune(params.slug);
  if (!comune) return { title: 'Comune non trovato' };
  const { total } = await getCantieriScheda({ comune: comune.comune, limit: 1 }, 'list');
  const enriched = await getEnrichedCount({ comune: comune.comune });
  const title = `Cantieri edilizi a ${comune.comune} (${comune.provincia}) — Permessi PDC, SCIA e CILA`;
  const description = `Tutti i cantieri attivi a ${comune.comune} (${comune.provincia}, ${comune.regione}): permessi di costruire, SCIA, CILA e bandi pubblici. Dati ufficiali aggiornati ogni giorno dall'albo pretorio comunale.`;
  const ogImage = ogImageUrl({
    title: `Cantieri edilizi a ${comune.comune}`,
    subtitle: `${comune.provincia}, ${comune.regione} · Dati dall'albo pretorio`,
    kind: 'comune',
    count: formatNumber(total),
    label: 'cantieri pubblicati',
  });
  return {
    title,
    description,
    alternates: { canonical: `/comune/${params.slug}` },
    robots: isAggregateIndexable(enriched) ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: `Cantieri edilizi a ${comune.comune} — Italia Cantieri`,
      description,
      url: `/comune/${params.slug}`,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `Cantieri edilizi a ${comune.comune}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Cantieri edilizi a ${comune.comune}`,
      description,
      images: [ogImage],
    },
  };
}

export default async function ComunePage({ params }: PageProps) {
  const meta = await resolveComune(params.slug);
  if (!meta) notFound();

  const [{ data: cantieriPubblici, total }, aggregati, firmCount] = await Promise.all([
    getCantieriScheda({ comune: meta.comune, limit: 12 }, 'list'),
    getAggregatiAnonimiByComune(meta.comune),
    countFirmsByComune(meta.comune),
  ]);

  const importoTotaleCampione = cantieriPubblici.reduce((s, c) => s + (Number(c.importo_lavori) || 0), 0);

  const comuneFaq = [
    {
      q: `Quanti cantieri sono attivi a ${meta.comune}?`,
      a: `Al momento tracciamo ${formatNumber(total)} cantieri pubblici a ${meta.comune}, piu un campione di ${formatNumber(aggregati.totale_aggregato)} cantieri privati visualizzati solo in forma aggregata anonima (k-anonymity 5) a tutela della privacy dei committenti.`,
    },
    {
      q: `Sono un'impresa: come intercetto i nuovi cantieri a ${meta.comune}?`,
      a: `Per tutela della privacy non pubblichiamo i dati personali di progettisti, titolari o imprese estratti dagli atti. Se sei un'impresa (edile, serramentista, impiantista) iscriviti gratis al network ItaliaProgettisti e ricevi gli avvisi sui nuovi cantieri di ${meta.comune} appena vengono pubblicati, per proporti sui lavori prima degli altri.`,
    },
    {
      q: `Posso ricevere alert sui nuovi cantieri a ${meta.comune}?`,
      a: `Si. Con la registrazione gratuita su ItaliaProgettisti puoi attivare notifiche email per ogni nuovo permesso pubblicato a ${meta.comune}, filtrabili per tipologia (PDC, SCIA, CILA) e fascia di importo.`,
    },
    {
      q: `Da dove arrivano i dati dei cantieri di ${meta.comune}?`,
      a: `Da fonti pubbliche ufficiali: albo pretorio del Comune di ${meta.comune}, portale open data della Pubblica Amministrazione e archivi regionali appalti. Ogni scheda dichiara la fonte e la data di pubblicazione originale.`,
    },
    {
      q: `Sono il proprietario di un cantiere e non voglio comparire. Cosa faccio?`,
      a: `Hai diritto di richiedere opt-out: scrivi al nostro DPO (privacy@italiaprogettisti.com) o usa il pulsante "Richiedi rimozione" presente in ogni scheda. Valutiamo la richiesta entro 30 giorni come previsto dal GDPR.`,
    },
  ];

  return (
    <section className="pt-32 md:pt-40 pb-12 md:pb-16">
      <div className="container-zen">
        <BreadcrumbCantiere
          steps={[
            { label: 'Regioni', href: '/regioni' },
            { label: meta.regione, href: `/${regioneSlug(meta.regione)}` },
            { label: `Provincia di ${provinciaNameFromCode(meta.provincia)}`, href: `/${regioneSlug(meta.regione)}/${provinciaSlugFromCode(meta.provincia)}` },
            { label: meta.comune },
          ]}
        />
        <h1 className="heading-section mb-3">Cantieri edilizi a {meta.comune}</h1>
        <p className="body-default text-muted-foreground mb-10 max-w-2xl">
          Tutti i permessi di costruire (PDC), SCIA e CILA tracciati a {meta.comune} ({meta.provincia}, {meta.regione}).
          Dati ufficiali aggregati da albo pretorio e open data della Pubblica Amministrazione.
        </p>

        <StatsBox
          items={[
            { label: 'Cantieri pubblici tracciati', value: total, format: 'number' },
            {
              label: 'Cantieri privati (statistica anonima)',
              value: aggregati.totale_aggregato,
              format: 'number',
              helper: 'aggregati con k-anonymity 5',
            },
            {
              label: 'Valore campione recente',
              value: importoTotaleCampione,
              format: 'euro',
              helper: 'somma importi cantieri mostrati',
            },
          ]}
          columns={3}
        />

        {/* SEZIONE PUBBLICA (LAYER 1) */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-1">Permessi e SCIA pubblicati a {meta.comune}</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Schede dettagliate dei cantieri con visibilita pubblica: PDC, SCIA e CILA dichiarati nell&apos;albo pretorio
            comunale.
          </p>
          {cantieriPubblici.length === 0 ? (
            <p className="text-sm text-muted-foreground rounded-2xl border border-dashed border-border p-6 text-center">
              Nessun cantiere pubblico attualmente disponibile per {meta.comune}. Stiamo lavorando per estendere la
              copertura: torna a trovarci presto.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cantieriPubblici.map((c) => (
                <CardSchedaCompact key={c.id} c={c} />
              ))}
            </div>
          )}
        </div>

        {/* SEZIONE AGGREGATI ANONIMI (LAYER 2) */}
        {aggregati.categorie.length > 0 && (
          <div className="mt-16">
            <div className="flex items-start gap-3 mb-6 rounded-2xl border border-border bg-secondary p-5">
              <Lock className="h-5 w-5 text-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-semibold mb-1">
                  Cantieri privati a {meta.comune}: statistiche anonime
                </h2>
                <p className="text-sm text-secondary-text leading-relaxed">
                  Aggregati con tecnica di <strong>k-anonymity 5</strong>: mostriamo solo gruppi con almeno 5 cantieri
                  privati simili per proteggere la privacy. Per ricevere il feed completo dei nuovi cantieri della zona e
                  gli avvisi personalizzati,{' '}
                  <a
                    href="https://www.italiaprogettisti.com/register?utm_source=italiacantieri&utm_medium=referral&utm_campaign=comune_aggregati&intent=alert"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    iscriviti al network ItaliaProgettisti
                  </a>
                  .
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-white p-6">
              <h3 className="font-semibold mb-4">Distribuzione cantieri privati per categoria</h3>
              <BarChart
                data={aggregati.categorie.map((c) => ({
                  label: c.categoria,
                  value: c.totale,
                }))}
              />
              <p className="mt-4 text-xs text-muted-foreground inline-flex items-center gap-1">
                <Info className="h-3 w-3" /> Valore complessivo opere stimato:{' '}
                {formatEuro(aggregati.categorie.reduce((s, c) => s + (c.importo_totale || 0), 0), { compact: true })}
              </p>
            </div>
          </div>
        )}

        {/* CTA ALERT */}
        <div className="mt-12">
          <AlertCantieriCTA
            scope={{ regione: meta.regione, provincia: provinciaNameFromCode(meta.provincia), comune: meta.comune }}
          />
        </div>

        {/* CROSS LINK */}
        <div className="mt-12">
          <CrossLinkCorrelati comune={meta.comune} countImprese={firmCount} />
        </div>

        <FAQ
          title={`Domande frequenti sui cantieri a ${meta.comune}`}
          items={comuneFaq}
        />
      </div>
    </section>
  );
}

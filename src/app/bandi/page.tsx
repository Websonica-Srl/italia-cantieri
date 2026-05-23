import type { Metadata } from 'next';
import Link from 'next/link';
import { Briefcase, Calendar, MapPin, EuroIcon, ArrowRight, ExternalLink } from 'lucide-react';
import { getBandi } from '@/lib/supabase/queries/bandi';
import { formatEuro, formatDate, truncate } from '@/lib/utils';
import BreadcrumbCantiere from '@/components/cantieri/BreadcrumbCantiere';
import { ogImageUrl } from '@/lib/seo/structured-data';

export const revalidate = 3600;

// Portale dedicato della rete per bandi e gare d'appalto. Questa pagina è un
// TEASER editoriale che rimanda lì (canonica) per non duplicare le schede bando.
const PORTALE_BANDI = 'https://www.bandigaredappalto.it';
const UTM = '?utm_source=italiacantieri&utm_medium=referral&utm_campaign=sezione_bandi';

const bandiOg = ogImageUrl({
  title: 'Bandi e gare d’appalto pubbliche',
  subtitle: 'Il portale della rete: bandigaredappalto.it',
  kind: 'bando',
});

export const metadata: Metadata = {
  title: 'Bandi e gare d’appalto pubbliche — la sezione della rete Italia Cantieri',
  description:
    'I bandi e le gare d’appalto pubbliche sono il complemento naturale dei cantieri edilizi: appalti di lavori (CPV 45*) e servizi di architettura e ingegneria (CPV 71*). Esplora il portale dedicato bandigaredappalto.it.',
  alternates: { canonical: '/bandi' },
  openGraph: {
    title: 'Bandi e gare d’appalto pubbliche — Italia Cantieri',
    description:
      'Appalti di lavori e servizi di ingegneria/architettura: esplora il portale dedicato bandigaredappalto.it.',
    url: '/bandi',
    type: 'website',
    images: [{ url: bandiOg, width: 1200, height: 630, alt: 'Bandi e gare d’appalto pubbliche' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bandi e gare d’appalto pubbliche',
    description: 'Appalti di lavori e servizi di ingegneria/architettura: portale bandigaredappalto.it.',
    images: [bandiOg],
  },
};

export default async function BandiPage() {
  const { data: bandi, total } = await getBandi({ limit: 9 });

  return (
    <section className="pt-32 md:pt-40 pb-12 md:pb-16">
      <div className="container-zen">
        <BreadcrumbCantiere steps={[{ label: 'Bandi e gare d’appalto' }]} />

        <h1 className="heading-section mb-3">Bandi e gare d&rsquo;appalto pubbliche</h1>
        <p className="body-default text-muted-foreground mb-6 max-w-2xl">
          Dove c&rsquo;&egrave; un cantiere pubblico, prima c&rsquo;&egrave; stata una gara. I bandi di
          gara sono il complemento naturale dell&rsquo;edilizia pubblica: <strong>appalti di lavori</strong>{' '}
          (CPV 45*) e <strong>servizi di architettura e ingegneria</strong> (CPV 71*). La rete dedica a
          questo un portale verticale, <strong>bandigaredappalto.it</strong>, con schede, scadenze,
          categorie CPV e le aziende che vincono le gare.
        </p>

        {/* CTA principale verso il portale dedicato (canonica dei bandi) */}
        <Link
          href={`${PORTALE_BANDI}${UTM}`}
          className="group mb-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/15 bg-primary/5 p-6"
        >
          <div className="min-w-0">
            <p className="text-base font-semibold text-foreground">
              Vai al portale bandi e gare d&rsquo;appalto
            </p>
            <p className="text-sm text-muted-foreground">
              {total > 0
                ? `${total.toLocaleString('it-IT')} bandi pubblici aggregati · fonti pubbliche · in chiaro`
                : 'Bandi pubblici aggregati da fonti istituzionali · in chiaro'}
            </p>
          </div>
          <span className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            bandigaredappalto.it <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>

        {bandi.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-foreground mb-1">Ultimi bandi pubblicati</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Un&rsquo;anteprima. Le schede complete, i filtri per categoria e zona e le scadenze sono sul
              portale dedicato.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {bandi.map((b) => (
                <Link
                  key={b.id}
                  href={`${PORTALE_BANDI}/bandi/${b.slug}${UTM}`}
                  className="group block rounded-2xl border border-border bg-white p-5 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary border border-primary/10">
                      <Briefcase className="h-3 w-3" /> {b.tipo_procedura || 'Bando'}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-semibold text-foreground leading-snug mb-3 line-clamp-2 text-sm">
                    {truncate(b.oggetto || 'Bando di gara', 120)}
                  </h3>
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    {b.stazione_appaltante && (
                      <p className="inline-flex items-center gap-1.5 w-full">
                        <Briefcase className="h-3 w-3 flex-shrink-0" /> {truncate(b.stazione_appaltante, 48)}
                      </p>
                    )}
                    {b.comune && (
                      <p className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 flex-shrink-0" /> {b.comune}{b.provincia ? ` (${b.provincia})` : ''}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-1">
                      {b.importo_base ? (
                        <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                          <EuroIcon className="h-3 w-3" /> {formatEuro(b.importo_base, { compact: true })}
                        </span>
                      ) : <span />}
                      {b.scadenza_offerte && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {formatDate(b.scadenza_offerte)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="rounded-2xl border border-dashed border-border bg-secondary/40 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-4 max-w-xl mx-auto">
            Cerchi bandi per categoria (lavori, ingegneria, architettura), per scadenza o vuoi sapere
            quali aziende vincono le gare? Tutto questo &egrave; sul portale dedicato della rete.
          </p>
          <Link
            href={`${PORTALE_BANDI}${UTM}`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Esplora bandigaredappalto.it <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

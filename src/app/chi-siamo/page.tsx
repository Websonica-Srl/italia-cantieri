import type { Metadata } from 'next';
import Link from 'next/link';
import { Database, Globe, ShieldCheck, ExternalLink } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import BreadcrumbCantiere from '@/components/cantieri/BreadcrumbCantiere';

export const metadata: Metadata = {
  title: 'Chi siamo',
  description: `${siteConfig.name} è l'aggregatore pubblico cantieri edilizi italiani. Trasparenza, GDPR, open data.`,
  alternates: { canonical: '/chi-siamo' },
};

export default function ChiSiamoPage() {
  return (
    <section className="py-12 md:py-16">
      <div className="container-zen max-w-3xl">
        <BreadcrumbCantiere steps={[{ label: 'Chi siamo' }]} />
        <h1 className="heading-section mb-4">Chi siamo</h1>
        <p className="body-large text-muted-foreground mb-12">
          {siteConfig.name} è un servizio editoriale di {siteConfig.companyName} che aggrega e rende navigabili in modo
          trasparente i dati pubblici sui cantieri edilizi italiani.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="rounded-2xl border border-border bg-white p-6">
            <Database className="h-6 w-6 mb-3" />
            <h3 className="font-semibold mb-2">Open data</h3>
            <p className="text-sm text-secondary-text">
              Aggreghiamo dati esclusivamente da fonti pubbliche e open data della Pubblica Amministrazione.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-6">
            <ShieldCheck className="h-6 w-6 mb-3" />
            <h3 className="font-semibold mb-2">GDPR-first</h3>
            <p className="text-sm text-secondary-text">
              k-anonymity 5 per cantieri privati, opt-out semplice, DPO contattabile.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-6">
            <Globe className="h-6 w-6 mb-3" />
            <h3 className="font-semibold mb-2">Network</h3>
            <p className="text-sm text-secondary-text">
              Parte del network ItaliaProgettisti: professionisti, studi, imprese, satelliti verticali.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">La nostra missione</h2>
        <div className="prose prose-neutral max-w-none mb-12">
          <p>
            I dati sui cantieri edilizi italiani sono pubblici per legge, ma frammentati su centinaia di portali comunali
            con formati e interfacce diverse. Italia Cantieri li unifica in un&apos;unica base dati navigabile, ricercabile
            per regione, provincia, comune e categoria.
          </p>
          <p>
            Crediamo nella trasparenza pubblica come pilastro del settore edilizio: progettisti, imprese, committenti e
            cittadini hanno diritto a un accesso facile alle informazioni che già esistono nel dominio pubblico.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-4">Il network</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-12">
          {siteConfig.network.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                {s.name} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </li>
          ))}
        </ul>

        <div className="rounded-2xl border border-border bg-secondary p-6 text-sm">
          <p>
            <strong>{siteConfig.companyName}</strong> · {siteConfig.companyPiva}<br />
            Email generica: <a href={`mailto:${siteConfig.email}`} className="underline">{siteConfig.email}</a><br />
            DPO: <a href={`mailto:${siteConfig.dpoEmail}`} className="underline">{siteConfig.dpoEmail}</a><br />
            <Link href="/contatti" className="underline">Form contatti</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

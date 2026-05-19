import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import { Building2, Mail, Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background mt-24">
      <div className="container-zen py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-background text-foreground">
                <Building2 className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-extrabold">Italia Cantieri</h3>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              {siteConfig.tagline}. Tutti i dati provengono da fonti pubbliche, open data PA e albi pretori dei Comuni italiani.
            </p>
            <p className="text-xs opacity-60 flex items-center gap-1.5">
              <Database className="h-3 w-3" /> Fonte dati: open data PA + albi pretori
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-80">Esplora</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/regioni" className="opacity-80 hover:opacity-100 transition-opacity">Cantieri per regione</Link></li>
              <li><Link href="/bandi" className="opacity-80 hover:opacity-100 transition-opacity">Bandi pubblici</Link></li>
              <li><Link href="/statistiche" className="opacity-80 hover:opacity-100 transition-opacity">Statistiche nazionali</Link></li>
              <li><Link href="/chi-siamo" className="opacity-80 hover:opacity-100 transition-opacity">Chi siamo</Link></li>
              <li><Link href="/contatti" className="opacity-80 hover:opacity-100 transition-opacity">Contatti</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-80">Trasparenza & GDPR</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/come-trattiamo-i-dati" className="opacity-80 hover:opacity-100 transition-opacity">Come trattiamo i dati</Link></li>
              <li><Link href="/come-trattiamo-i-dati#opt-out" className="opacity-80 hover:opacity-100 transition-opacity">Richiesta opt-out / rimozione</Link></li>
              <li><Link href="/legal/privacy" className="opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</Link></li>
              <li><Link href="/legal/cookie" className="opacity-80 hover:opacity-100 transition-opacity">Cookie Policy</Link></li>
              <li><Link href="/legal/termini" className="opacity-80 hover:opacity-100 transition-opacity">Termini di servizio</Link></li>
              <li className="pt-1">
                <a href={`mailto:${siteConfig.dpoEmail}`} className="opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Contatta il DPO
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-80">Il Network</h4>
            <ul className="space-y-2.5 text-sm">
              {siteConfig.network.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs opacity-60">
            <p>
              &copy; {new Date().getFullYear()} {siteConfig.name} &mdash; Un servizio di {siteConfig.companyName} · {siteConfig.companyPiva}
            </p>
            <p>
              Dati aggregati a fini informativi · Base legale: Art. 6.1.f GDPR (legittimo interesse)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

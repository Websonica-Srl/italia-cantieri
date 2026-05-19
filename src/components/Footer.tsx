import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import { Mail, Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-zen py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-semibold mb-4">ItaliaCantieri</h3>
            <p className="text-sm opacity-80 mb-4 leading-relaxed">
              Sai prima dove si lavora in Italia. Cantieri edilizi pubblici e bandi di gara aggregati da fonti
              ufficiali, aggiornati ogni giorno.
            </p>
            <p className="text-xs opacity-60 flex items-center gap-1.5 mb-1.5">
              <Database className="h-3 w-3" /> Fonti: open data PA + albi pretori comunali
            </p>
            <p className="text-xs opacity-60">
              GDPR-compliant · k-anonymity 5 sui cantieri privati
            </p>
          </div>

          {/* Esplora */}
          <div>
            <h4 className="font-semibold mb-4">Esplora</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/regioni" className="opacity-80 hover:opacity-100 transition-opacity">
                  Cantieri per regione
                </Link>
              </li>
              <li>
                <Link href="/bandi" className="opacity-80 hover:opacity-100 transition-opacity">
                  Bandi pubblici
                </Link>
              </li>
              <li>
                <Link href="/statistiche" className="opacity-80 hover:opacity-100 transition-opacity">
                  Statistiche nazionali
                </Link>
              </li>
              <li>
                <Link href="/chi-siamo" className="opacity-80 hover:opacity-100 transition-opacity">
                  Chi siamo
                </Link>
              </li>
              <li>
                <Link href="/contatti" className="opacity-80 hover:opacity-100 transition-opacity">
                  Contatti
                </Link>
              </li>
            </ul>
          </div>

          {/* Trasparenza & GDPR */}
          <div>
            <h4 className="font-semibold mb-4">Trasparenza &amp; GDPR</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/come-trattiamo-i-dati" className="opacity-80 hover:opacity-100 transition-opacity">
                  Come trattiamo i dati
                </Link>
              </li>
              <li>
                <Link href="/come-trattiamo-i-dati#opt-out" className="opacity-80 hover:opacity-100 transition-opacity">
                  Opt-out / rimozione
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="opacity-80 hover:opacity-100 transition-opacity">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/cookie" className="opacity-80 hover:opacity-100 transition-opacity">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/termini" className="opacity-80 hover:opacity-100 transition-opacity">
                  Termini di servizio
                </Link>
              </li>
              <li className="pt-1">
                <a
                  href={`mailto:${siteConfig.dpoEmail}`}
                  className="opacity-80 hover:opacity-100 transition-opacity inline-flex items-center gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5" /> Contatta il DPO
                </a>
              </li>
            </ul>
          </div>

          {/* Network */}
          <div>
            <h4 className="font-semibold mb-4">Network</h4>
            <ul className="space-y-3 text-sm">
              {siteConfig.network.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-80 hover:opacity-100 hover:underline transition-all"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm opacity-60">
            <p>
              &copy; {new Date().getFullYear()} {siteConfig.name} &mdash; parte del Network ItaliaProgettisti
            </p>
            <div className="flex gap-6 text-xs">
              <Link href="/legal/privacy" className="hover:opacity-100 transition-opacity">
                Privacy
              </Link>
              <Link href="/legal/termini" className="hover:opacity-100 transition-opacity">
                Termini
              </Link>
              <Link href="/legal/cookie" className="hover:opacity-100 transition-opacity">
                Cookie
              </Link>
            </div>
          </div>
          <p className="mt-3 text-xs opacity-50">
            {siteConfig.companyName} · {siteConfig.companyPiva} · Dati aggregati a fini informativi · Base legale: Art. 6.1.f GDPR (legittimo interesse)
          </p>
        </div>
      </div>
    </footer>
  );
}

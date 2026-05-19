import Link from 'next/link';
import { ArrowRight, MapPin, FileText, BarChart3, ShieldCheck } from 'lucide-react';
import SearchComune from '@/components/cantieri/SearchComune';
import CantiereCard from '@/components/cantieri/CantiereCard';
import StatsBox from '@/components/cantieri/StatsBox';
import { getCantieri, getCantieriByRegione, getGlobalStats } from '@/lib/supabase/queries/cantieri';
import { regioneSlug } from '@/lib/utils';

export const revalidate = 3600; // ISR ogni ora

export default async function HomePage() {
  const [stats, recenti, regioni] = await Promise.all([
    getGlobalStats(),
    getCantieri({ limit: 12, orderBy: 'data_pubblicazione', orderDirection: 'desc' }),
    getCantieriByRegione(),
  ]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 md:pb-20 bg-gradient-to-b from-secondary/40 to-background">
        <div className="container-zen text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-white border border-border px-4 py-1.5 text-xs font-medium text-foreground/70 mb-6">
            <ShieldCheck className="h-3.5 w-3.5" /> Database pubblico · Open data PA · GDPR-compliant
          </p>
          <h1 className="heading-hero mb-6 max-w-4xl mx-auto">
            Tutti i cantieri edilizi d&apos;Italia, <span className="text-foreground/60">in un solo posto.</span>
          </h1>
          <p className="body-large text-foreground/70 max-w-2xl mx-auto mb-10">
            Permessi di costruire (PDC), SCIA, CILA e bandi di gara aggregati da fonti pubbliche: albi pretori comunali e
            open data della Pubblica Amministrazione.
          </p>

          <SearchComune />

          <div className="mt-6 text-sm text-muted-foreground">
            Esempi:{' '}
            <Link href="/comune/milano" className="underline hover:text-foreground">Milano</Link>{' · '}
            <Link href="/comune/bologna" className="underline hover:text-foreground">Bologna</Link>{' · '}
            <Link href="/comune/torino" className="underline hover:text-foreground">Torino</Link>{' · '}
            <Link href="/regioni" className="underline hover:text-foreground">vedi tutte le regioni</Link>
          </div>
        </div>
      </section>

      {/* STATS GLOBALI */}
      <section className="py-12 md:py-16">
        <div className="container-zen">
          <StatsBox
            items={[
              { label: 'Cantieri tracciati', value: stats.totale, format: 'number' },
              { label: 'Regioni coperte', value: stats.regioni, format: 'number' },
              { label: 'Comuni nel database', value: stats.comuni, format: 'number' },
              { label: 'Importo totale lavori', value: stats.importo_totale, format: 'euro', helper: 'su cantieri con importo dichiarato' },
            ]}
          />
        </div>
      </section>

      {/* RECENTI */}
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="container-zen">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <h2 className="heading-section">Cantieri recenti</h2>
              <p className="text-muted-foreground mt-1">
                Ultimi {recenti.data.length} permessi e SCIA aggregati dalle PA italiane.
              </p>
            </div>
            <Link href="/statistiche" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
              Statistiche complete <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recenti.data.map((c) => (
              <CantiereCard key={c.id} cantiere={c} />
            ))}
          </div>
        </div>
      </section>

      {/* REGIONI */}
      <section className="py-12 md:py-16">
        <div className="container-zen">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <h2 className="heading-section">Cantieri per regione</h2>
              <p className="text-muted-foreground mt-1">Esplora i cantieri attivi in ciascuna regione italiana.</p>
            </div>
            <Link href="/regioni" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
              Vedi tutte <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {regioni.slice(0, 12).map((r) => (
              <Link
                key={r.regione}
                href={`/${regioneSlug(r.regione)}`}
                className="rounded-xl border border-border bg-white p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-semibold">{r.regione}</span>
                </div>
                <div className="text-xs text-muted-foreground">{r.cnt.toLocaleString('it-IT')} cantieri</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA REGISTRAZIONE */}
      <section className="py-16 md:py-24 bg-foreground text-background">
        <div className="container-zen text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Sei un&apos;impresa edile o uno studio di progettazione?
          </h2>
          <p className="text-lg opacity-80 mb-8 leading-relaxed">
            Iscriviti al network ItaliaProgettisti per ricevere notifiche cantieri vicini, accedere ai bandi e farti
            trovare dai committenti.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://www.italiaprogettisti.com/register"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-background text-foreground px-6 py-3 font-medium hover:opacity-90 transition-opacity"
            >
              <FileText className="h-4 w-4" /> Registrati gratis
            </a>
            <a
              href="https://www.italiaprogettisti.com/abbonamenti"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-background/30 text-background px-6 py-3 font-medium hover:bg-background/10 transition-colors"
            >
              <BarChart3 className="h-4 w-4" /> Scopri i piani Premium
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

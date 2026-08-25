import type { Metadata } from 'next';
import {
  ArrowRight,
  MapPin,
  Calendar,
  FileText,
  Hammer,
  Building2,
  Wrench,
  Check,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import BreadcrumbCantiere from '@/components/cantieri/BreadcrumbCantiere';
import SectionWrapper from '@/components/cantieri/SectionWrapper';
import FAQ from '@/components/cantieri/FAQ';
import TrustBadges from '@/components/cantieri/TrustBadges';
import { ogImageUrl } from '@/lib/seo/structured-data';

export const revalidate = 86400; // pagina statica, nessuna query al DB

const HUB_FORM = 'https://www.italiaprogettisti.com/servizio-cantieri';
const HUB_ATTIVAZIONE = `${HUB_FORM}?utm_source=italiacantieri&utm_medium=per_le_imprese&utm_campaign=attivazione`;
const HUB_PREZZI = `${HUB_FORM}?utm_source=italiacantieri&utm_medium=per_le_imprese_prezzi&utm_campaign=attivazione`;

// Testi copiati alla lettera da COPY-home-per-le-imprese.md, Parte 2.
const COPY = {
  metaTitle: 'Feed cantieri per le imprese - Italia Cantieri',
  metaDescription:
    "Cosa arriva ogni lunedì nella tua email, cosa vedi dopo lo sblocco, cosa non diamo e quanto costa. Attivazione al telefono, solo imprese con partita IVA.",
  eyebrow: 'Il servizio per chi esegue i lavori',
  h1: 'Titoli edilizi nuovi ogni lunedì, nella provincia o regione che scegli',
  sottotitolo:
    "Ti arriva una email con fino a 10 pratiche depositate in comune, prima quelle del tuo comune. Leggi subito che lavoro è, dove, di che dimensione e quali mestieri servono. Indirizzo e soggetti dell'atto li apri con un credito, quando la segnalazione ti interessa.",
  ctaHeroPrimaria: 'Richiedi una richiamata',
  ctaHeroSecondaria: 'Abbonamenti',
  arrivaTitolo: 'Cosa contiene ogni segnalazione',
  arrivaRighe: [
    'Comune e tipo di pratica: PDC, SCIA o CILA',
    "Data di deposito dell'atto in comune",
    "Descrizione dell'intervento, presa dall'atto",
    'Nuova costruzione, ristrutturazione, ampliamento, manutenzione straordinaria',
    'Destinazione: residenziale, commerciale, ricettivo, produttivo',
    "Unità o mq quando l'atto li riporta, mestieri, stima dei lavori",
  ],
  sbloccoTitolo: 'Cosa apri con 1 credito',
  sbloccoRighe: [
    "L'indirizzo del cantiere",
    'Gli estremi della pratica edilizia',
    "I soggetti indicati nell'atto: studio o professionista che firma il progetto, impresa se presente",
    "Il link diretto all'atto pubblico. La scheda arriva anche via email e resta tua",
  ],
  nonFacciamoTitolo: 'Cosa non facciamo',
  nonFacciamoRighe: [
    'Non diamo telefono ed email dello studio o del committente. È un atto pubblico, non un contatto commerciale: il nome lo trovi, il contatto lo fai tu.',
    "Non copriamo tutta l'Italia. Al 26/08/2026 abbiamo atti in 42 province: se la tua zona è scoperta, te lo diciamo prima.",
    "Non ti attivi da solo online. L'abbonamento parte al telefono, dopo aver verificato la zona e spiegato le condizioni.",
  ],
  cremonaTitoloBlocco: 'Un cantiere vero, comune di Cremona',
  cremonaCampi: [
    { etichetta: 'Tipo di pratica', valore: 'Permesso di Costruire (PDC) del 06/11/2025' },
    { etichetta: 'Intervento', valore: "Ristrutturazione con cambio d'uso per la creazione di 8 unità immobiliari" },
    { etichetta: 'Destinazione', valore: 'Residenziale' },
    { etichetta: 'Unità e scala', valore: '8 unità, scala media' },
    { etichetta: 'Stima dei lavori (nostra, AI)', valore: '720.000 - 1.080.000 €' },
  ],
  cremonaMestieri: [
    'edili generali',
    'fondazioni e strutture',
    'impianti termoidraulici',
    'impianti di climatizzazione',
    'impianti elettrici',
    'serramenti e infissi',
    'pavimenti e rivestimenti',
    'pitture e decorazioni',
  ],
  cremonaDidascalia:
    "Atto pubblico del comune di Cremona del 06/11/2025. La stima è calcolata da noi con l'AI sui dati dell'atto, non è un importo dichiarato. Indirizzo e studio che firma il progetto si vedono dopo lo sblocco.",
  prezziEyebrow: 'Abbonamenti',
  prezziTitolo: 'Due formati: una provincia o una regione',
  prezziSottotitolo: 'Prezzi IVA esclusa, riservati alle imprese con partita IVA.',
  piani: [
    {
      nome: 'Cantieri Locali',
      badge: 'Più scelto',
      prezzoMese: '149 € al mese',
      prezzoAnno: "1.490 € all'anno (due mesi in omaggio)",
      righe: [
        'Una provincia a scelta, prima i cantieri del tuo comune',
        'Email ogni lunedì con fino a 10 titoli edilizi: PDC, SCIA, CILA',
        '30 crediti di sblocco al mese, 1 credito per cantiere',
        'Scheda sbloccata anche via email, resta tua',
      ],
      cta: 'Richiedi una richiamata',
    },
    {
      nome: 'Cantieri Regionale',
      badge: null,
      prezzoMese: '349 € al mese',
      prezzoAnno: "3.490 € all'anno (due mesi in omaggio)",
      righe: [
        'Una regione intera, prima i cantieri del tuo comune',
        'Email ogni lunedì con fino a 10 titoli edilizi: PDC, SCIA, CILA',
        '100 crediti di sblocco al mese, 1 credito per cantiere',
        'Scheda sbloccata anche via email, resta tua',
      ],
      cta: 'Richiedi una richiamata',
    },
  ],
  passi: [
    {
      titolo: 'Compili il form',
      testoPre: "Nome dell'impresa, provincia o regione che ti interessa, un numero dove richiamarti. Il form è su ",
      testoUrl: HUB_FORM,
    },
    {
      titolo: 'Ti richiamiamo noi',
      testo:
        'Verifichiamo la copertura della tua zona, ti spieghiamo crediti, prezzo e condizioni. Se la provincia è scoperta te lo diciamo in quella telefonata.',
    },
    {
      titolo: 'Prima email il lunedì dopo',
      testo:
        "Attivato l'abbonamento, la prima selezione parte il lunedì successivo, con i titoli più recenti della zona che hai scelto.",
    },
  ],
  faq: [
    {
      q: 'Da dove arrivano i dati?',
      a: "Da albi pretori comunali, portali SUE e open data della pubblica amministrazione. Sono atti pubblici: permessi di costruire, SCIA e CILA depositati in comune. Per ogni segnalazione dichiariamo la fonte, e dopo lo sblocco trovi il link diretto all'atto.",
    },
    {
      q: 'Mi date i contatti dello studio?',
      a: "No. Telefono ed email dello studio o del committente non li diamo: quello che pubblichiamo è un atto pubblico, non un contatto commerciale. Nell'atto c'è il nome dello studio o del professionista che firma il progetto, e l'impresa se è indicata. Il contatto lo fai tu.",
    },
    {
      q: 'La mia provincia è coperta?',
      a: "Dipende, la copertura non è nazionale. Al 26/08/2026 abbiamo atti in 42 province, e negli ultimi 90 giorni sono arrivati 6.171 titoli da 34 province e 62 comuni. Scrivi la tua provincia nel form: ti diciamo com'è messa prima di attivare qualsiasi cosa.",
    },
    {
      q: 'Cosa succede quando finisco i crediti?',
      a: "Puoi acquistarne altri. L'operatore ti spiega come, al telefono, prima di procedere. I crediti inclusi nell'abbonamento tornano disponibili ogni mese.",
    },
    {
      q: 'Posso disdire?',
      a: "È un contratto tra imprese. Durata, rinnovo e disdetta te li spiega l'operatore al telefono prima dell'attivazione: leggi le condizioni e decidi dopo, non prima.",
    },
  ],
  chiSiamoFrase1:
    'Italia Cantieri è un servizio di AZIENDA 365 SRL (P.IVA 02724340746) e fa parte del network Italia Progettisti, che dal 2024 collega progettisti, studi e imprese.',
  chiSiamoEmailInfo: 'info@italiacantieri.it',
  chiSiamoEmailCantieri: 'cantieri@italiaprogettisti.com',
  ctaFinaleTitolo: "Dicci la tua zona, ti diciamo cosa c'è in archivio",
  ctaFinaleTesto:
    'Lasci il numero nel form e ti richiamiamo noi. Prima di qualsiasi abbonamento verifichiamo se la tua provincia ha atti in archivio.',
  ctaFinaleCta: 'Richiedi una richiamata',
  notaLegale:
    "I dati provengono da atti pubblici della pubblica amministrazione e sono trattati per legittimo interesse ai sensi dell'art. 6.1.f del GDPR; il servizio è riservato alle imprese con partita IVA.",
};

const arrivaIcone = [MapPin, Calendar, FileText, Hammer, Building2, Wrench];

export const metadata: Metadata = {
  title: { absolute: COPY.metaTitle },
  description: COPY.metaDescription,
  alternates: { canonical: '/per-le-imprese' },
  robots: { index: true, follow: true },
  openGraph: {
    title: COPY.metaTitle,
    description: COPY.metaDescription,
    url: '/per-le-imprese',
    type: 'website',
    images: [
      {
        url: ogImageUrl({
          title: COPY.h1,
          subtitle: COPY.metaDescription,
          kind: 'generic',
        }),
        width: 1200,
        height: 630,
        alt: 'Italia Cantieri per le imprese — feed cantieri settimanale',
      },
    ],
  },
};

export default function PerLeImprese() {
  return (
    <>
      <section
        className="relative bg-background pt-32 pb-16 md:pt-40 md:pb-20"
        aria-labelledby="hero-heading"
      >
        <div className="container-zen max-w-4xl">
          <BreadcrumbCantiere steps={[{ label: 'Per le imprese' }]} />
          <p className="mb-6 inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <span aria-hidden="true" className="h-px w-8 bg-foreground/30" />
            {COPY.eyebrow}
          </p>
          <h1
            id="hero-heading"
            className="font-black tracking-[-0.045em] leading-[0.95] text-foreground text-balance"
            style={{ fontSize: 'clamp(2.25rem, 5vw + 1rem, 4.5rem)' }}
          >
            {COPY.h1}
          </h1>
          <p className="mt-8 text-lg md:text-xl font-light leading-relaxed text-secondary-text max-w-3xl text-pretty">
            {COPY.sottotitolo}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a
              href={HUB_ATTIVAZIONE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {COPY.ctaHeroPrimaria}
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
            <a
              href="#prezzi"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-transparent px-7 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:border-foreground/40 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {COPY.ctaHeroSecondaria}
            </a>
          </div>
        </div>
      </section>

      {/* Cosa contiene ogni segnalazione */}
      <SectionWrapper spacing="default" tone="muted" title={COPY.arrivaTitolo}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {COPY.arrivaRighe.map((riga, i) => {
            const Icon = arrivaIcone[i];
            return (
              <div
                key={riga}
                className="bg-white border border-border rounded-3xl p-6 flex items-start gap-3"
              >
                <Icon className="h-5 w-5 flex-shrink-0 text-foreground/70 mt-0.5" strokeWidth={1.5} />
                <p className="text-sm text-secondary-text leading-relaxed">{riga}</p>
              </div>
            );
          })}
        </div>
      </SectionWrapper>

      {/* Cosa apri con 1 credito / Cosa non facciamo */}
      <SectionWrapper spacing="default">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <div className="bg-white border border-border rounded-3xl p-7 md:p-8">
            <h3 className="font-black text-xl md:text-2xl tracking-[-0.025em] mb-6">
              {COPY.sbloccoTitolo}
            </h3>
            <ul className="space-y-4">
              {COPY.sbloccoRighe.map((riga) => (
                <li key={riga} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-foreground/70 mt-0.5" strokeWidth={1.5} />
                  <span className="text-sm text-secondary-text leading-relaxed">{riga}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-border rounded-3xl p-7 md:p-8">
            <h3 className="font-black text-xl md:text-2xl tracking-[-0.025em] mb-6">
              {COPY.nonFacciamoTitolo}
            </h3>
            <ul className="space-y-4">
              {COPY.nonFacciamoRighe.map((riga) => (
                <li key={riga} className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 flex-shrink-0 text-foreground/70 mt-0.5" strokeWidth={1.5} />
                  <span className="text-sm text-secondary-text leading-relaxed">{riga}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionWrapper>

      {/* Esempio reale, comune di Cremona */}
      <SectionWrapper spacing="default" tone="muted" title={COPY.cremonaTitoloBlocco}>
        <div className="bg-white border border-border rounded-3xl p-7 md:p-10 max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground mb-5">
            PDC
          </span>
          <h3 className="font-bold text-lg md:text-xl tracking-[-0.02em] text-foreground mb-6 text-pretty">
            {COPY.cremonaCampi[1].valore}
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 mb-7 pt-6 border-t border-border">
            {COPY.cremonaCampi.map((campo) => (
              <div key={campo.etichetta}>
                <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
                  {campo.etichetta}
                </dt>
                <dd className="text-sm font-medium text-foreground">{campo.valore}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap gap-2 mb-7">
            {COPY.cremonaMestieri.map((m) => (
              <span
                key={m}
                className="rounded-full border border-border text-xs px-3 py-1 text-secondary-text"
              >
                {m}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed pt-5 border-t border-border">
            {COPY.cremonaDidascalia}
          </p>
        </div>
      </SectionWrapper>

      {/* Prezzi */}
      <SectionWrapper
        id="prezzi"
        spacing="default"
        align="center"
        eyebrow={COPY.prezziEyebrow}
        title={COPY.prezziTitolo}
        subtitle={COPY.prezziSottotitolo}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {COPY.piani.map((piano) => (
            <div
              key={piano.nome}
              className="relative bg-white border border-border rounded-3xl p-7 md:p-8"
            >
              {piano.badge && (
                <span className="absolute top-6 right-6 inline-flex items-center rounded-full bg-foreground text-background px-3 py-1 text-[10px] font-bold uppercase tracking-wide">
                  {piano.badge}
                </span>
              )}
              <h3 className="font-black text-xl md:text-2xl tracking-[-0.025em] mb-6">{piano.nome}</h3>
              <div className="mb-1 font-black tracking-[-0.04em] tabular-nums text-foreground text-3xl md:text-4xl">
                {piano.prezzoMese}
              </div>
              <div className="mb-6 text-sm text-muted-foreground">{piano.prezzoAnno}</div>
              <ul className="space-y-3 mb-8">
                {piano.righe.map((riga) => (
                  <li key={riga} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 flex-shrink-0 text-foreground/70 mt-0.5" strokeWidth={2} />
                    <span className="text-sm text-secondary-text leading-relaxed">{riga}</span>
                  </li>
                ))}
              </ul>
              <a
                href={HUB_PREZZI}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {piano.cta}
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </a>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Come si attiva */}
      <SectionWrapper
        spacing="default"
        tone="muted"
        align="center"
        title="Come si attiva"
        headerMaxW="lg"
      >
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0">
          {COPY.passi.map((p, i) => (
            <div
              key={p.titolo}
              className={[
                'group relative p-8 md:p-12 transition-colors duration-500',
                i > 0 ? 'md:border-l border-t md:border-t-0 border-border' : '',
              ].join(' ')}
            >
              <div className="flex items-baseline gap-5 mb-8">
                <span className="ghost-number text-[5rem] md:text-[6.5rem]">{`0${i + 1}`}</span>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-border group-hover:bg-foreground/30 transition-colors duration-500"
                />
              </div>
              <h3 className="font-black mb-4 text-xl md:text-2xl tracking-[-0.025em]">{p.titolo}</h3>
              {p.testoUrl ? (
                <p className="text-[15px] text-secondary-text leading-relaxed text-pretty max-w-sm">
                  {p.testoPre}
                  <a
                    href={p.testoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline-offset-4 hover:underline"
                  >
                    {p.testoUrl}
                  </a>
                </p>
              ) : (
                <p className="text-[15px] text-secondary-text leading-relaxed text-pretty max-w-sm">
                  {p.testo}
                </p>
              )}
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="container-zen max-w-4xl">
          <FAQ items={COPY.faq} />
        </div>
      </section>

      {/* Chi siamo */}
      <SectionWrapper spacing="compact" title="Chi siamo">
        <p className="text-base text-secondary-text leading-relaxed max-w-3xl mb-4">
          {COPY.chiSiamoFrase1} Per informazioni scrivi a{' '}
          <a href={`mailto:${COPY.chiSiamoEmailInfo}`} className="underline underline-offset-4">
            {COPY.chiSiamoEmailInfo}
          </a>
          , per il servizio cantieri a{' '}
          <a href={`mailto:${COPY.chiSiamoEmailCantieri}`} className="underline underline-offset-4">
            {COPY.chiSiamoEmailCantieri}
          </a>
          .
        </p>
        <TrustBadges variant="row" className="mt-6" />
      </SectionWrapper>

      {/* CTA finale */}
      <section className="py-24 md:py-32 bg-secondary/30 border-t border-border">
        <div className="container-zen">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="font-black tracking-[-0.04em] leading-[0.95] text-foreground text-balance mb-8"
              style={{ fontSize: 'clamp(2rem, 4vw + 0.5rem, 4.5rem)' }}
            >
              {COPY.ctaFinaleTitolo}
            </h2>
            <p className="text-base md:text-lg text-secondary-text leading-relaxed max-w-2xl mx-auto mb-12">
              {COPY.ctaFinaleTesto}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href={HUB_ATTIVAZIONE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {COPY.ctaFinaleCta}
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </a>
            </div>
            <p className="mt-10 text-xs text-muted-foreground max-w-xl mx-auto">
              {COPY.notaLegale}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

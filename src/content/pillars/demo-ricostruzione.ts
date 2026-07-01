import type { PillarContent } from '@/lib/content/pillars';

/**
 * Pillar intervento: Demolizione e ricostruzione (ondata 2).
 * Target keyword: "demolizione e ricostruzione" (480/mese). Intent: proprietario che
 * valuta di abbattere un edificio esistente e ricostruirlo (spesso per accedere a
 * incentivi o per superare i limiti di una ristrutturazione). Copy definitivo (Task 17):
 * answer-first + 3 sezioni (quando serve/ristrutturazione ricostruttiva vs nuova
 * costruzione, quale titolo edilizio, quanto costa) + FAQ + correlati. Nessun dato di
 * piattaforma (numeri cantieri) qui: arriva dinamicamente dal blocco-dato della route.
 */
const pillar: PillarContent = {
  kind: 'intervento',
  slug: 'demo-ricostruzione',
  intervento: 'demo_ricostruzione',
  h1: 'Demolizione e ricostruzione: quando serve, titoli edilizi e costi',
  answerFirst:
    "La demolizione e ricostruzione e' l'intervento che abbatte completamente un edificio esistente e ne realizza uno nuovo al suo posto. Se il nuovo edificio ha la stessa volumetria di quello demolito (fatte salve le eccezioni previste dalla legge), rientra nella categoria della ristrutturazione edilizia \"ricostruttiva\" (art. 3, comma 1, lett. d, DPR 380/2001); se invece comporta un aumento di volumetria o una diversa collocazione non consentita dalla disciplina sulla ristrutturazione, si configura come nuova costruzione. La distinzione e' decisiva perche' incide sul titolo edilizio richiesto e sull'accesso a eventuali incentivi fiscali.",
  sections: [
    {
      heading: 'Ristrutturazione ricostruttiva o nuova costruzione: la differenza',
      body:
        "Il DPR 380/2001 (art. 3, comma 1, lettera d) include tra gli interventi di ristrutturazione edilizia anche quelli \"consistenti nella demolizione e ricostruzione di un edificio esistente\", a condizione che il nuovo edificio abbia sagoma, volumetria, area di sedime e caratteristiche planivolumetriche analoghe a quello demolito, con le eccezioni e le tolleranze introdotte nel tempo dal legislatore (ad esempio per incentivare l'adeguamento antisismico o l'efficientamento energetico, o nei centri storici dove le regole sono piu' stringenti). Quando questi limiti vengono superati, ad esempio con un aumento di volumetria non previsto dalla normativa applicabile o uno spostamento significativo del sedime, l'intervento non e' piu' qualificabile come ristrutturazione ricostruttiva ma come nuova costruzione, con un regime autorizzativo e fiscale diverso. La qualificazione corretta dipende da normativa nazionale, regionale e dal regolamento edilizio comunale, oltre che da eventuali vincoli paesaggistici o storici sull'immobile: va sempre verificata con un tecnico abilitato prima di avviare la pratica.",
    },
    {
      heading: 'Quale titolo edilizio serve',
      body:
        "Quando l'intervento rientra nella ristrutturazione edilizia ricostruttiva, il titolo richiesto e' generalmente il Permesso di Costruire, oppure la SCIA alternativa al Permesso di Costruire prevista dall'art. 23 del DPR 380/2001 per gli interventi di ristrutturazione (compresa quella ricostruttiva), quando il Comune e la normativa regionale la ammettono per il caso specifico. Quando invece l'intervento si configura come nuova costruzione (ad esempio per aumento di volumetria oltre le soglie consentite), serve sempre il Permesso di Costruire secondo la disciplina ordinaria delle nuove costruzioni, con verifica piena di distanze, altezze e indici urbanistici vigenti al momento della ricostruzione (che possono essere diversi da quelli in vigore quando l'edificio originario fu costruito). In entrambi i casi, prima di demolire va sempre verificato che l'edificio non sia sottoposto a vincoli storici, artistici o paesaggistici che impediscano la demolizione o impongano autorizzazioni aggiuntive.",
    },
    {
      heading: 'Quanto costa demolire e ricostruire',
      body:
        "Il costo di un intervento di demolizione e ricostruzione comprende due voci distinte, oltre agli oneri comunali: i numeri che seguono sono range indicativi, non un preventivo. La demolizione dell'edificio esistente, comprensiva di smaltimento dei materiali, si aggira orientativamente tra 50 e 150 euro al metro cubo demolito, in base alla tipologia costruttiva e alla presenza di materiali da smaltire con procedure specifiche (ad esempio amianto). La ricostruzione vera e propria segue costi simili a una nuova costruzione, orientativamente tra 1.200 e 2.000 euro al metro quadro per una finitura standard, con possibili aumenti significativi per finiture di pregio o soluzioni ad alta efficienza energetica. Quando il titolo e' il Permesso di Costruire, e' dovuto il contributo di costruzione calcolato dal Comune. La demolizione e ricostruzione con mantenimento della volumetria puo' in alcuni casi accedere a incentivi fiscali dedicati alla ristrutturazione o all'adeguamento sismico/energetico: le aliquote e i requisiti specifici vanno sempre verificati con un tecnico o commercialista prima di avviare i lavori.",
    },
  ],
  faq: [
    {
      q: "Demolire e ricostruire un edificio e' considerato ristrutturazione o nuova costruzione?",
      a: "Dipende dal risultato: se il nuovo edificio mantiene sagoma, volumetria e area di sedime analoghe a quello demolito (con le tolleranze previste dalla legge), rientra nella ristrutturazione edilizia ricostruttiva (art. 3, comma 1, lett. d, DPR 380/2001). Se supera questi limiti, ad esempio con aumento di volumetria, si configura come nuova costruzione.",
    },
    {
      q: 'Quale titolo edilizio serve per demolire e ricostruire?',
      a: "Generalmente il Permesso di Costruire, oppure la SCIA alternativa al Permesso di Costruire quando ammessa dal Comune per gli interventi di ristrutturazione ricostruttiva. Per gli interventi che si configurano come nuova costruzione serve sempre il Permesso di Costruire secondo la disciplina ordinaria.",
    },
    {
      q: 'Si puo\' aumentare la volumetria durante la ricostruzione?',
      a: "Solo entro i limiti e le eccezioni previste dalla normativa applicabile (nazionale, regionale, comunale), spesso legate a incentivi per adeguamento sismico o efficientamento energetico. Oltre queste soglie, l'intervento perde la qualifica di ristrutturazione ricostruttiva e diventa nuova costruzione, con un regime autorizzativo piu' stringente.",
    },
    {
      q: 'Quanto costa demolire e ricostruire una casa?',
      a: "Indicativamente 50-150 euro al metro cubo per la sola demolizione, a cui si sommano 1.200-2.000 euro al metro quadro per la ricostruzione con finitura standard. Il costo reale dipende da tipologia costruttiva, presenza di materiali da smaltire, zona e finiture scelte: serve sempre un preventivo su misura.",
    },
    {
      q: 'Serve verificare vincoli prima di demolire un edificio esistente?',
      a: "Si', sempre. Edifici sottoposti a vincoli storici, artistici o paesaggistici possono non essere demolibili o richiedere autorizzazioni aggiuntive (ad esempio l'autorizzazione paesaggistica) prima ancora del titolo edilizio per la ricostruzione.",
    },
  ],
  correlati: [
    { label: 'Permesso di Costruire', href: '/guide/permesso-di-costruire' },
    { label: 'Cantieri di ristrutturazione', href: '/cantieri/ristrutturazione' },
  ],
  metaTitle: 'Demolizione e ricostruzione: quando serve, titoli edilizi e costi',
  metaDescription:
    "Demolizione e ricostruzione: ristrutturazione ricostruttiva o nuova costruzione, quale titolo edilizio richiede e quanto costa indicativamente.",
  ondata: 2,
};

export default pillar;

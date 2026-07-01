import type { PillarContent } from '@/lib/content/pillars';

/**
 * Pillar intervento: Ristrutturazione (ondata 1).
 * Target keyword: "ristrutturazione casa" (14.800/mese) + "quanto costa ristrutturare casa"
 * (2.900/mese). Intent: proprietario che valuta un intervento di ristrutturazione.
 * Copy definitivo (Task 10): answer-first + 3 sezioni (quando serve/cosa comprende,
 * quale titolo edilizio, quanto costa) + FAQ + correlati. Nessun dato di piattaforma
 * (numeri cantieri) qui: quello arriva dinamicamente dal blocco-dato della route.
 */
const pillar: PillarContent = {
  kind: 'intervento',
  slug: 'ristrutturazione',
  intervento: 'ristrutturazione',
  h1: 'Ristrutturazione casa: quando serve, titoli edilizi e costi',
  answerFirst:
    'La ristrutturazione edilizia e\' l\'intervento che rinnova o trasforma un edificio esistente senza demolirlo: puo\' riguardare un solo appartamento o un intero immobile e va dal semplice rifacimento di impianti e finiture fino a interventi che modificano la distribuzione degli spazi. A seconda della portata dei lavori si autorizza con CILA, SCIA o, nei casi piu\' incisivi, con Permesso di Costruire.',
  sections: [
    {
      heading: 'Quando serve una ristrutturazione e cosa comprende',
      body:
        'Si parla di ristrutturazione quando l\'intervento va oltre la manutenzione ordinaria o straordinaria e tocca la struttura, la distribuzione interna o l\'aspetto dell\'edificio esistente. Rientrano qui: rifacimento completo di impianti elettrico e idraulico, apertura o chiusura di vani, consolidamento strutturale, rifacimento di facciate e coperture, ridistribuzione degli spazi interni. Serve tipicamente quando l\'immobile e\' datato, poco efficiente dal punto di vista energetico, oppure quando si vuole cambiare la disposizione di una casa acquistata o ereditata. A differenza della manutenzione straordinaria, che si limita a rinnovare senza alterare in modo sostanziale gli spazi, la ristrutturazione puo\' arrivare a modificare sagoma e volumi nei casi piu\' estesi (ristrutturazione "pesante").',
    },
    {
      heading: 'Quale titolo edilizio serve per ristrutturare casa',
      body:
        'Il titolo richiesto dipende dalla portata dei lavori. Le ristrutturazioni "leggere", che non alterano sagoma, volumi o prospetti, si autorizzano con CILA (Comunicazione di Inizio Lavori Asseverata) se non toccano le parti strutturali, oppure con SCIA (Segnalazione Certificata di Inizio Attivita\') quando riguardano anche elementi strutturali o l\'intera unita\' immobiliare. Le ristrutturazioni "pesanti", che modificano sagoma, volumi, prospetti o la destinazione d\'uso dell\'edificio, richiedono invece il Permesso di Costruire. La scelta corretta del titolo va sempre verificata con un tecnico abilitato (architetto, ingegnere o geometra), perche\' dipende anche dal regolamento edilizio comunale e dalla zona urbanistica.',
    },
    {
      heading: 'Quanto costa ristrutturare casa',
      body:
        'Il costo di una ristrutturazione varia molto in base alla zona, allo stato di partenza dell\'immobile, alle finiture scelte e all\'impresa incaricata: i numeri che seguono sono range indicativi, non un preventivo. Una ristrutturazione "leggera" (impianti, pavimenti, bagno, tinteggiatura) si aggira orientativamente tra 300 e 700 euro al metro quadro. Una ristrutturazione completa che include anche modifiche alla distribuzione interna arriva tipicamente tra 600 e 1.200 euro al metro quadro. Una ristrutturazione "pesante", con interventi strutturali o ampliamenti, puo\' superare i 1.000-2.000 euro al metro quadro. Sono spesso disponibili detrazioni fiscali per le ristrutturazioni edilizie: le aliquote e i requisiti cambiano nel tempo, quindi vanno verificati con un tecnico o commercialista e sul sito dell\'Agenzia delle Entrate prima di avviare i lavori. Per una stima affidabile serve sempre un preventivo scritto da un\'impresa o un tecnico dopo un sopralluogo.',
    },
  ],
  faq: [
    {
      q: 'Qual e\' la differenza tra ristrutturazione e manutenzione straordinaria?',
      a: 'La manutenzione straordinaria riguarda interventi di rinnovo che non alterano la distribuzione interna in modo sostanziale (es. rifacimento impianti, sostituzione infissi). La ristrutturazione puo\' invece modificare la distribuzione degli spazi, aprire o chiudere vani, e nei casi piu\' estesi anche la sagoma dell\'edificio.',
    },
    {
      q: 'Serve sempre il Permesso di Costruire per ristrutturare casa?',
      a: 'No. Serve solo per le ristrutturazioni che modificano sagoma, volume o prospetti dell\'edificio esistente (ristrutturazione "pesante"). Le ristrutturazioni "leggere", che non toccano questi elementi, si autorizzano con CILA o SCIA a seconda della portata dei lavori.',
    },
    {
      q: 'Quanto costa in media ristrutturare un appartamento?',
      a: 'Indicativamente da 300-700 euro al metro quadro per una ristrutturazione leggera fino a 600-1.200 euro al metro quadro per una ristrutturazione completa, con punte superiori per interventi strutturali o di pregio. Il costo reale dipende da zona, stato dell\'immobile, finiture e impresa: serve sempre un preventivo su misura.',
    },
    {
      q: 'Quanto dura in media un cantiere di ristrutturazione?',
      a: 'Dipende dalla dimensione e dalla tipologia: una ristrutturazione di un singolo appartamento puo\' durare 2-4 mesi, mentre la ristrutturazione di un intero edificio o condominio puo\' richiedere 6-18 mesi.',
    },
    {
      q: 'Chi puo\' presentare la pratica di ristrutturazione al Comune?',
      a: 'La pratica va presentata da un tecnico abilitato (architetto, ingegnere, geometra) tramite lo Sportello Unico Edilizia (SUE) del Comune competente, per conto del proprietario o dell\'avente titolo.',
    },
  ],
  correlati: [
    { label: 'Manutenzione straordinaria', href: '/cantieri/manutenzione-straordinaria' },
    { label: 'Cos\'e\' la CILA', href: '/guide/cila' },
    { label: 'Cos\'e\' la SCIA', href: '/guide/scia' },
    { label: 'Permesso di Costruire', href: '/guide/permesso-di-costruire' },
  ],
  metaTitle: 'Ristrutturazione casa: quando serve, titoli edilizi e costi',
  metaDescription:
    'Ristrutturazione casa: quando serve, quale titolo edilizio richiede (CILA, SCIA o Permesso di Costruire) e quanto costa indicativamente al metro quadro.',
  ondata: 1,
};

export default pillar;

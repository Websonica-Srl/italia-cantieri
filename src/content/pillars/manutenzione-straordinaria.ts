import type { PillarContent } from '@/lib/content/pillars';

/**
 * Pillar intervento: Manutenzione straordinaria (ondata 1).
 * Target keyword: "manutenzione straordinaria" (3.600/mese). Intent: proprietario/tecnico
 * che deve capire se un lavoro rientra nella manutenzione straordinaria e quale titolo
 * edilizio serve. Copy definitivo (Task 16): answer-first + 3 sezioni (quando serve/cosa
 * comprende, quale titolo edilizio, quanto costa) + FAQ + correlati. Nessun dato di
 * piattaforma (numeri cantieri) qui: arriva dinamicamente dal blocco-dato della route.
 */
const pillar: PillarContent = {
  kind: 'intervento',
  slug: 'manutenzione-straordinaria',
  intervento: 'manutenzione_straordinaria',
  h1: 'Manutenzione straordinaria: quando serve, titolo edilizio e costi',
  answerFirst:
    'La manutenzione straordinaria e\' l\'intervento edilizio che rinnova o sostituisce parti anche strutturali di un edificio, o ne modifica gli impianti, senza pero\' alterarne il volume complessivo, la sagoma, la destinazione d\'uso ne\' i prospetti in modo sostanziale. Rientrano qui, ad esempio, il rifacimento completo degli impianti, la sostituzione di infissi e serramenti, il consolidamento di elementi strutturali e lo spostamento di tramezzi interni. Di norma si autorizza con CILA; per gli interventi piu\' estesi, in particolare quelli che riguardano le parti strutturali dell\'intero edificio, puo\' essere richiesta la SCIA.',
  sections: [
    {
      heading: 'Quando serve la manutenzione straordinaria e cosa comprende',
      body:
        'Si parla di manutenzione straordinaria quando i lavori vanno oltre la semplice manutenzione ordinaria (tinteggiature, piccole riparazioni) ma non arrivano a modificare in modo sostanziale la distribuzione degli spazi o l\'aspetto dell\'edificio. Rientrano tipicamente in questa categoria: il rifacimento o l\'adeguamento degli impianti elettrico, idraulico, termico o di climatizzazione; la sostituzione di infissi, serramenti e persiane, anche con modifica di materiale o colore entro i limiti del regolamento edilizio comunale; il consolidamento o il rinnovo di elementi strutturali (travi, solai, murature portanti) senza alterare volumi e superfici; la realizzazione o l\'eliminazione di tramezzi interni non portanti; il rifacimento di bagni e cucine con spostamento di impianti. Serve in genere quando un immobile e\' datato, poco efficiente dal punto di vista energetico, oppure quando si vuole rinnovare senza intervenire sulla distribuzione generale degli spazi, che invece rientrerebbe nella ristrutturazione.',
    },
    {
      heading: 'Quale titolo edilizio serve per la manutenzione straordinaria',
      body:
        'Il titolo richiesto dipende dalla portata dei lavori. Per gli interventi di manutenzione straordinaria che non riguardano le parti strutturali dell\'edificio, di norma basta la CILA (Comunicazione di Inizio Lavori Asseverata): un tecnico abilitato assevera la conformita\' urbanistica e catastale e i lavori possono partire senza attesa. Quando l\'intervento riguarda invece le parti strutturali (ad esempio il rifacimento di solai o la modifica di murature portanti su un intero edificio) o comporta un frazionamento/accorpamento di unita\' immobiliari con variazione del carico urbanistico, puo\' essere richiesta la SCIA (Segnalazione Certificata di Inizio Attivita\'), che prevede termini di controllo comunale piu\' estesi. La scelta corretta tra CILA e SCIA va sempre verificata con un tecnico abilitato (architetto, ingegnere o geometra), perche\' dipende anche dal regolamento edilizio del Comune competente e da eventuali vincoli sull\'immobile (centro storico, tutela paesaggistica).',
    },
    {
      heading: 'Quanto costa la manutenzione straordinaria',
      body:
        'Il costo varia molto in base al tipo di intervento, alla zona, allo stato di partenza dell\'immobile e all\'impresa incaricata: i numeri che seguono sono range indicativi, non un preventivo. Il rifacimento di un impianto elettrico o idraulico in un appartamento si aggira orientativamente tra 80 e 150 euro al metro quadro. La sostituzione di infissi e serramenti va tipicamente da 300 a 800 euro a finestra, in base a materiale e prestazioni. Un intervento piu\' ampio che comprende piu\' impianti insieme a consolidamenti strutturali puo\' arrivare a diverse centinaia di euro al metro quadro. Sono spesso disponibili detrazioni fiscali per gli interventi di manutenzione straordinaria (ad esempio ristrutturazione edilizia o efficientamento energetico): le aliquote e i requisiti cambiano nel tempo, quindi vanno verificati con un tecnico o commercialista e sul sito dell\'Agenzia delle Entrate prima di avviare i lavori. Per una stima affidabile serve sempre un preventivo scritto da un\'impresa o un tecnico dopo un sopralluogo.',
    },
  ],
  faq: [
    {
      q: 'Qual e\' la differenza tra manutenzione ordinaria e straordinaria?',
      a: 'La manutenzione ordinaria comprende lavori di semplice mantenimento (tinteggiatura, piccole riparazioni) senza titolo edilizio. La manutenzione straordinaria rinnova o sostituisce parti anche strutturali e impianti, senza pero\' alterare volumi, sagoma o destinazione d\'uso: richiede di norma CILA o, nei casi piu\' estesi, SCIA.',
    },
    {
      q: 'Serve un tecnico per la manutenzione straordinaria?',
      a: 'Si\', nella maggior parte dei casi. Sia la CILA sia la SCIA richiedono l\'asseverazione di un tecnico abilitato (architetto, ingegnere o geometra), che certifica la conformita\' urbanistica, edilizia e catastale dell\'intervento.',
    },
    {
      q: 'Manutenzione straordinaria e ristrutturazione sono la stessa cosa?',
      a: 'No. La manutenzione straordinaria rinnova o sostituisce parti dell\'edificio senza alterarne in modo sostanziale la distribuzione interna. La ristrutturazione puo\' invece modificare la distribuzione degli spazi e, nei casi piu\' estesi, anche sagoma e volumi.',
    },
    {
      q: 'Cosa succede se faccio manutenzione straordinaria senza titolo edilizio?',
      a: 'I lavori eseguiti senza CILA o SCIA (a seconda di quale fosse richiesta) sono irregolari e soggetti a sanzioni pecuniarie previste dal Testo Unico Edilizia (DPR 380/2001), oltre all\'obbligo di regolarizzare la posizione con una comunicazione tardiva.',
    },
    {
      q: 'Quanto dura in media un cantiere di manutenzione straordinaria?',
      a: 'Dipende dall\'entita\' dei lavori: interventi su un singolo impianto o su infissi possono richiedere da pochi giorni a poche settimane, mentre interventi piu\' estesi con opere strutturali possono durare 1-3 mesi.',
    },
  ],
  correlati: [
    { label: 'Cos\'e\' la CILA', href: '/guide/cila' },
    { label: 'Cos\'e\' la SCIA', href: '/guide/scia' },
    { label: 'Cantieri di ristrutturazione', href: '/cantieri/ristrutturazione' },
  ],
  metaTitle: 'Manutenzione straordinaria: quando serve, titolo edilizio e costi',
  metaDescription:
    'Manutenzione straordinaria: cosa comprende, quale titolo edilizio richiede (CILA o SCIA) e quanto costa indicativamente. Guida pratica per proprietari e tecnici.',
  ondata: 1,
};

export default pillar;

import type { PillarContent } from '@/lib/content/pillars';

/**
 * Pillar intervento: Ristrutturazione (ondata 1).
 * Esemplare di copy per il registry (Task 9). Copy definitivo affinato nel Task 10/16.
 */
const pillar: PillarContent = {
  kind: 'intervento',
  slug: 'ristrutturazione',
  intervento: 'ristrutturazione',
  h1: 'Cantieri di ristrutturazione in Italia',
  answerFirst:
    'La ristrutturazione e\' l\'intervento edilizio che modifica parti strutturali o distributive di un edificio esistente senza demolirlo, tipicamente autorizzato con SCIA o CILA a seconda della portata dei lavori.',
  sections: [
    {
      heading: 'Cosa comprende un cantiere di ristrutturazione',
      body:
        'I cantieri di ristrutturazione riguardano interventi su edifici esistenti: rifacimento di impianti, apertura o chiusura di vani, consolidamento strutturale, rifacimento di facciate e coperture. A differenza della manutenzione straordinaria, la ristrutturazione puo\' comportare modifiche piu\' profonde alla distribuzione interna e, nei casi piu\' estesi, richiede il Permesso di Costruire.',
    },
    {
      heading: 'Titoli edilizi tipici',
      body:
        'La maggior parte delle ristrutturazioni "leggere" (senza variazione di sagoma o volume) si autorizza con CILA o SCIA. Le ristrutturazioni "pesanti", che alterano sagoma, volumi o prospetti, richiedono invece il Permesso di Costruire. Italia Cantieri segnala per ogni cantiere il tipo di titolo rilevato quando disponibile.',
    },
    {
      heading: 'Chi lavora su un cantiere di ristrutturazione',
      body:
        'Tipicamente coinvolge imprese edili generaliste, ma anche mestieri specializzati come impiantisti (elettrico, idraulico), serramentisti, e imprese di finiture. Il numero di soggetti coinvolti cresce con la dimensione dell\'intervento.',
    },
  ],
  faq: [
    {
      q: 'Qual e\' la differenza tra ristrutturazione e manutenzione straordinaria?',
      a: 'La manutenzione straordinaria riguarda interventi di rinnovo che non alterano la distribuzione interna in modo sostanziale (es. rifacimento impianti, sostituzione infissi). La ristrutturazione puo\' invece modificare la distribuzione degli spazi, aprire o chiudere vani, e in alcuni casi anche la sagoma dell\'edificio.',
    },
    {
      q: 'Serve sempre il Permesso di Costruire per ristrutturare?',
      a: 'No. Serve solo per le ristrutturazioni che modificano sagoma, volume o prospetti dell\'edificio esistente (ristrutturazione "pesante"). Le ristrutturazioni "leggere" si autorizzano con CILA o SCIA.',
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
  ],
  metaTitle: 'Cantieri di ristrutturazione in Italia — dati e statistiche | Italia Cantieri',
  metaDescription:
    'Tutti i cantieri di ristrutturazione monitorati in Italia: titoli edilizi, imprese coinvolte, dati aggiornati per comune e provincia.',
  ondata: 1,
};

export default pillar;

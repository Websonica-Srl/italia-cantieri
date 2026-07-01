import type { PillarContent } from '@/lib/content/pillars';

/**
 * Pillar guida: CILA (ondata 1).
 * Esemplare di copy per il registry (Task 9). Copy definitivo affinato nel Task 11/16.
 */
const pillar: PillarContent = {
  kind: 'guida',
  slug: 'cila',
  titolo: 'CILA',
  h1: 'CILA: Comunicazione di Inizio Lavori Asseverata',
  answerFirst:
    'La CILA e\' il titolo edilizio piu\' leggero previsto dal Testo Unico Edilizia: permette di iniziare subito lavori di manutenzione straordinaria che non toccano le parti strutturali, con la sola asseverazione di un tecnico abilitato.',
  sections: [
    {
      heading: 'Cosa e\' la CILA e quando si usa',
      body:
        'La CILA (Comunicazione di Inizio Lavori Asseverata) e\' disciplinata dall\'art. 6-bis del DPR 380/2001. Si usa per interventi di manutenzione straordinaria che non riguardano le parti strutturali dell\'edificio: spostamento di tramezzi non portanti, rifacimento di pavimentazioni, sostituzione di infissi, realizzazione di controsoffitti.',
    },
    {
      heading: 'Come funziona la procedura',
      body:
        'A differenza del Permesso di Costruire, la CILA non richiede attesa: i lavori possono iniziare il giorno stesso della presentazione al Comune. Serve pero\' l\'asseverazione di un tecnico abilitato (architetto, ingegnere, geometra) che certifichi la conformita\' urbanistica e la compatibilita\' con la normativa vigente.',
    },
  ],
  faq: [
    {
      q: 'Quanto tempo serve per ottenere una CILA?',
      a: 'Nessuna attesa: a differenza di SCIA e Permesso di Costruire, con la CILA i lavori possono iniziare lo stesso giorno della presentazione, perche\' non e\' soggetta a controllo preventivo del Comune.',
    },
    {
      q: 'Chi puo\' asseverare una CILA?',
      a: 'Solo un tecnico abilitato iscritto al relativo albo professionale: architetto, ingegnere, geometra o perito edile, che si assume la responsabilita\' della conformita\' urbanistica dell\'intervento.',
    },
    {
      q: 'Cosa succede se non presento la CILA prima dei lavori?',
      a: 'I lavori effettuati senza CILA sono considerati abusivi e soggetti a sanzione amministrativa fissa (attualmente 1.000 euro), oltre all\'obbligo di regolarizzazione tramite CILA in sanatoria.',
    },
    {
      q: 'CILA e SCIA sono la stessa cosa?',
      a: 'No. La CILA e\' per interventi piu\' semplici e non richiede il termine di 30 o 60 giorni per i controlli del Comune previsto invece dalla SCIA. La SCIA si usa per interventi piu\' incisivi come la ristrutturazione "leggera".',
    },
  ],
  correlati: [
    { label: 'Cos\'e\' la SCIA', href: '/guide/scia' },
    { label: 'SCIA o CILA: quale scegliere', href: '/guide/scia-o-cila' },
    { label: 'Cantieri di ristrutturazione', href: '/cantieri/ristrutturazione' },
  ],
  metaTitle: 'CILA: cos\'e\', quando serve e come funziona | Italia Cantieri',
  metaDescription:
    'Guida alla CILA (Comunicazione di Inizio Lavori Asseverata): quando si usa, chi la asseverare, differenze con SCIA e Permesso di Costruire.',
  ondata: 1,
};

export default pillar;

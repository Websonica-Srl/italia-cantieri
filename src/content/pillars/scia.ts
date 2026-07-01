import type { PillarContent } from '@/lib/content/pillars';

/**
 * Pillar guida: SCIA (ondata 1).
 * Target keyword: "scia edilizia" (3.600/mese) + "scia comune" (590/mese).
 * Intent: proprietario/tecnico. Copy definitivo (Task 16): answer-first + sezioni
 * (quando si usa/quando NON basta, differenza con CILA e Permesso di Costruire con
 * tabella, iter/tempi/costi/sanzioni) + FAQ + correlati.
 */
const pillar: PillarContent = {
  kind: 'guida',
  slug: 'scia',
  titolo: 'SCIA',
  h1: 'SCIA: Segnalazione Certificata di Inizio Attivita\'',
  answerFirst:
    'La SCIA (Segnalazione Certificata di Inizio Attivita\') e\' il titolo edilizio previsto dal Testo Unico Edilizia (art. 22 DPR 380/2001) per gli interventi piu\' rilevanti della manutenzione straordinaria minore ma che non arrivano a modificare sagoma, volume o destinazione d\'uso dell\'edificio in modo tale da richiedere il Permesso di Costruire. A differenza della CILA, la SCIA richiede l\'asseverazione di un tecnico abilitato ed e\' soggetta a un termine di controllo comunale prima o dopo l\'inizio dei lavori, a seconda del Comune e del tipo di intervento.',
  sections: [
    {
      heading: 'Quando si usa la SCIA e quando NON basta',
      body:
        'La SCIA si usa tipicamente per: ristrutturazioni edilizie "leggere" che non modificano sagoma, volumi o prospetti ma toccano le parti strutturali dell\'edificio; restauro e risanamento conservativo; frazionamento o accorpamento di unita\' immobiliari con variazione del carico urbanistico; interventi di manutenzione straordinaria che coinvolgono le parti strutturali dell\'intero edificio; opere che modificano i prospetti senza alterare la sagoma complessiva. La SCIA NON basta quando l\'intervento comporta un aumento di volumetria, una modifica della sagoma dell\'edificio esistente, la costruzione di un nuovo edificio o una ristrutturazione "pesante" con demolizione e ricostruzione: in questi casi serve il Permesso di Costruire. Al contrario, se l\'intervento e\' di manutenzione straordinaria che non tocca le parti strutturali, di norma basta la CILA, piu\' semplice e senza attesa.',
    },
    {
      heading: 'Differenza tra SCIA, CILA e Permesso di Costruire',
      body:
        'I tre titoli edilizi principali del Testo Unico Edilizia si differenziano soprattutto per la portata dell\'intervento e per il livello di controllo richiesto dal Comune.\n\n| Titolo | Interventi tipici | Asseverazione tecnica | Attesa prima dei lavori |\n|---|---|---|---|\n| CILA | Manutenzione straordinaria non strutturale (impianti, infissi, tramezzi) | Si\', del tecnico | Nessuna, si inizia subito |\n| SCIA | Ristrutturazione leggera, interventi su parti strutturali, restauro, frazionamenti | Si\', del tecnico | Di norma nessuna attesa per iniziare, ma il Comune ha un termine per i controlli (in genere 30-60 giorni) |\n| Permesso di Costruire | Nuova costruzione, ristrutturazione pesante, ampliamenti, aumento di volumetria | Progetto firmato dal tecnico, istruttoria comunale | Si\', autorizzazione preventiva del Comune prima di iniziare (di norma alcuni mesi) |\n\nLa differenza chiave e\' quindi: la CILA non richiede alcuna attesa e non altera la struttura; la SCIA riguarda interventi piu\' incisivi, spesso anche strutturali, ma senza aumento di volumetria; il Permesso di Costruire serve quando l\'edificio cambia in modo sostanziale (nuova costruzione, aumento di volume, modifica di sagoma) e richiede un\'autorizzazione preventiva del Comune prima di iniziare i lavori.',
    },
    {
      heading: 'Iter, tempi, costi e sanzioni della SCIA',
      body:
        'La SCIA si presenta allo Sportello Unico Edilizia (SUE) del Comune competente, di norma per via telematica, allegando la relazione tecnica asseverata, gli elaborati grafici di stato di fatto e di progetto e la documentazione richiesta dal regolamento edilizio locale. In molti Comuni i lavori possono iniziare dal giorno stesso della presentazione, ma il Comune mantiene un termine per effettuare i controlli e, se riscontra difformita\', puo\' intervenire entro il periodo previsto dalla normativa (in genere fino a 60 giorni, salvo diverse previsioni comunali). I costi tipici comprendono l\'onorario del tecnico per relazione, elaborati e asseverazione, oltre a eventuali oneri di urbanizzazione se dovuti in base al tipo di intervento: gli importi non sono fissati per legge e vanno richiesti al proprio tecnico di fiducia. Chi esegue lavori soggetti a SCIA senza averla presentata e\' soggetto a sanzioni pecuniarie e, nei casi piu\' gravi, all\'obbligo di ripristino dello stato dei luoghi, secondo quanto previsto dal DPR 380/2001; e\' comunque possibile regolarizzare con una SCIA in sanatoria, se l\'intervento e\' conforme alla normativa vigente.',
    },
  ],
  faq: [
    {
      q: 'Quanto tempo ci vuole per la SCIA?',
      a: 'In molti casi i lavori possono iniziare dal giorno stesso della presentazione, ma il Comune ha un termine di norma di 30-60 giorni per effettuare i controlli successivi. I tempi esatti dipendono dal regolamento edilizio comunale e dal tipo di intervento.',
    },
    {
      q: 'La SCIA scade?',
      a: 'La SCIA non ha una scadenza definita come il Permesso di Costruire, ma i lavori vanno eseguiti in un tempo ragionevole coerente con quanto dichiarato: e\' comunque opportuno verificare con il proprio tecnico eventuali termini specifici previsti dal Comune.',
    },
    {
      q: 'SCIA e CILA sono la stessa cosa?',
      a: 'No. La CILA copre interventi piu\' semplici di manutenzione straordinaria non strutturale e non richiede attesa. La SCIA riguarda interventi piu\' rilevanti, spesso su parti strutturali, ed e\' soggetta a un termine di controllo comunale.',
    },
    {
      q: 'Cosa succede se faccio lavori soggetti a SCIA senza presentarla?',
      a: 'I lavori sono irregolari e soggetti a sanzioni pecuniarie previste dal Testo Unico Edilizia, con possibile obbligo di ripristino dello stato dei luoghi nei casi piu\' gravi. E\' possibile regolarizzare con una SCIA in sanatoria se l\'intervento risulta conforme.',
    },
    {
      q: 'Chi puo\' presentare la SCIA?',
      a: 'La SCIA va presentata da un tecnico abilitato (architetto, ingegnere o geometra) tramite lo Sportello Unico Edilizia del Comune, per conto del proprietario o dell\'avente titolo sull\'immobile.',
    },
  ],
  correlati: [
    { label: 'Cos\'e\' la CILA', href: '/guide/cila' },
    { label: 'SCIA o CILA: quale scegliere', href: '/guide/scia-o-cila' },
    { label: 'Permesso di Costruire', href: '/guide/permesso-di-costruire' },
  ],
  metaTitle: 'SCIA edilizia: cos\'e\', quando serve e come funziona',
  metaDescription:
    'Cos\'e\' la SCIA (Segnalazione Certificata di Inizio Attivita\'): quando si usa, differenze con CILA e Permesso di Costruire, iter, tempi, costi e sanzioni.',
  ondata: 1,
};

export default pillar;

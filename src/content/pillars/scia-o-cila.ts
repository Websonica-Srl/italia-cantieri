import type { PillarContent } from '@/lib/content/pillars';

/**
 * Pillar guida: SCIA o CILA, quale scegliere (ondata 1).
 * Target keyword: "scia o cila" (2.400/mese). Formato confronto/tabella.
 * Nota: guida comparativa, non associata a un singolo TipoTitolo -> campo 'titolo' omesso.
 * Copy definitivo (Task 16): answer-first + tabella comparativa + quando serve invece il PdC + FAQ.
 */
const pillar: PillarContent = {
  kind: 'guida',
  slug: 'scia-o-cila',
  h1: 'SCIA o CILA: quale titolo edilizio serve',
  answerFirst:
    'La differenza chiave e\' che la CILA (Comunicazione di Inizio Lavori Asseverata) si usa per la manutenzione straordinaria che non tocca le parti strutturali dell\'edificio e non richiede attesa: i lavori iniziano il giorno stesso della presentazione. La SCIA (Segnalazione Certificata di Inizio Attivita\') si usa invece per interventi piu\' rilevanti, spesso anche sulle parti strutturali, come la ristrutturazione "leggera" o il restauro, ed e\' soggetta a un termine di controllo comunale. Entrambe richiedono l\'asseverazione di un tecnico abilitato, ma nessuna delle due basta se l\'intervento aumenta la volumetria o modifica la sagoma dell\'edificio: in quel caso serve il Permesso di Costruire.',
  sections: [
    {
      heading: 'SCIA o CILA: la tabella comparativa',
      body:
        'Il modo piu\' rapido per capire quale titolo serve e\' guardare cosa cambia nell\'edificio con l\'intervento previsto.\n\n| Aspetto | CILA | SCIA |\n|---|---|---|\n| Interventi tipici | Manutenzione straordinaria non strutturale: impianti, infissi, tramezzi non portanti, controsoffitti | Interventi piu\' rilevanti: ristrutturazione leggera, opere su parti strutturali, restauro e risanamento conservativo, frazionamenti |\n| Parti strutturali | Non coinvolte | Puo\' coinvolgerle, senza modificare sagoma o volume |\n| Asseverazione tecnica | Si\', obbligatoria | Si\', obbligatoria |\n| Attesa prima dei lavori | Nessuna, si inizia lo stesso giorno | Di norma nessuna attesa per iniziare, ma il Comune ha un termine di controllo successivo (in genere 30-60 giorni, salvo diverse previsioni comunali) |\n| Riferimento normativo | Art. 6-bis DPR 380/2001 | Art. 22 DPR 380/2001 |\n\nIn sintesi: se l\'intervento non tocca la struttura dell\'edificio, di norma basta la CILA. Se coinvolge le parti strutturali, oppure riguarda un restauro o un frazionamento, serve tipicamente la SCIA. In caso di dubbio, la scelta corretta va sempre verificata con un tecnico abilitato, perche\' dipende anche dal regolamento edilizio del Comune competente.',
    },
    {
      heading: 'Quando invece serve il Permesso di Costruire',
      body:
        'Ne\' la CILA ne\' la SCIA bastano quando l\'intervento comporta una nuova costruzione, un aumento della volumetria esistente, una modifica della sagoma dell\'edificio o una ristrutturazione "pesante" con demolizione e ricostruzione non fedele. In questi casi serve il Permesso di Costruire (PdC), che richiede un\'istruttoria tecnica preventiva del Comune: i lavori possono iniziare solo dopo il suo rilascio, a differenza di CILA e SCIA che di norma non richiedono questa attesa. Un segnale utile per capire se serve il PdC: se dopo l\'intervento l\'edificio occupa piu\' spazio, ha una forma diversa (sagoma) o cambia in modo rilevante la propria destinazione d\'uso, e\' probabile che serva il Permesso di Costruire e non SCIA o CILA.',
    },
    {
      heading: 'Come scegliere in pratica',
      body:
        'Prima di presentare la pratica, conviene farsi tre domande insieme al proprio tecnico. L\'intervento tocca elementi strutturali (muri portanti, solai, travi)? Se no, ed e\' manutenzione straordinaria, di norma basta la CILA. L\'intervento cambia la distribuzione interna in modo rilevante, oppure riguarda restauro, risanamento conservativo o frazionamento di unita\'? Se si\', ed e\' senza aumento di volumetria, tipicamente serve la SCIA. L\'intervento aumenta la superficie o il volume esistente, oppure modifica la sagoma o la destinazione d\'uso urbanistica? Se si\', ne\' SCIA ne\' CILA bastano: serve il Permesso di Costruire. In tutti i casi la classificazione finale spetta al tecnico abilitato, che verifica anche il regolamento edilizio del Comune competente.',
    },
  ],
  faq: [
    {
      q: 'Come faccio a sapere se mi serve la SCIA o la CILA?',
      a: 'Il criterio principale e\' se l\'intervento tocca le parti strutturali dell\'edificio: se non le tocca (es. rifacimento impianti, infissi, tramezzi), di norma basta la CILA; se le coinvolge, senza pero\' modificare sagoma o volume, serve tipicamente la SCIA. La verifica definitiva spetta a un tecnico abilitato.',
    },
    {
      q: 'Cosa succede se presento il titolo sbagliato?',
      a: 'Se l\'intervento richiedeva un titolo piu\' impegnativo di quello presentato, i lavori possono essere considerati irregolari e soggetti a sanzioni previste dal DPR 380/2001. Per questo la scelta tra CILA, SCIA e Permesso di Costruire va sempre valutata con un tecnico prima di iniziare.',
    },
    {
      q: 'CILA e SCIA hanno gli stessi costi?',
      a: 'Entrambe richiedono l\'onorario di un tecnico abilitato per relazione tecnica, asseverazione ed elaborati grafici: l\'importo dipende dalla complessita\' dell\'intervento, non dal tipo di titolo. La SCIA puo\' comportare oneri aggiuntivi se dovuti in base al tipo di intervento.',
    },
    {
      q: 'Posso iniziare subito i lavori con SCIA o CILA?',
      a: 'Con la CILA si\', i lavori iniziano il giorno stesso della presentazione. Con la SCIA, in molti Comuni si puo\' iniziare subito, ma il Comune mantiene un termine per i controlli successivi (in genere 30-60 giorni), a differenza del Permesso di Costruire che richiede autorizzazione preventiva.',
    },
    {
      q: 'Chi decide se serve la SCIA o la CILA?',
      a: 'La valutazione spetta al tecnico abilitato incaricato (architetto, ingegnere o geometra), che analizza il progetto rispetto al Testo Unico Edilizia e al regolamento edilizio del Comune competente prima di presentare la pratica allo Sportello Unico Edilizia.',
    },
  ],
  correlati: [
    { label: 'Cos\'e\' la SCIA', href: '/guide/scia' },
    { label: 'Cos\'e\' la CILA', href: '/guide/cila' },
    { label: 'Permesso di Costruire', href: '/guide/permesso-di-costruire' },
  ],
  metaTitle: 'SCIA o CILA: quale titolo edilizio serve',
  metaDescription:
    'SCIA o CILA: le differenze principali, tabella comparativa, quando serve invece il Permesso di Costruire. Guida pratica per proprietari e tecnici.',
  ondata: 1,
};

export default pillar;

import type { PillarContent } from '@/lib/content/pillars';

/**
 * Pillar guida: Permesso di Costruire (ondata 1).
 * Target keyword: "permesso di costruire" (3.600/mese). Intent: proprietario/tecnico che
 * deve capire quando serve il PdC. Copy definitivo (Task 16): answer-first + sezioni
 * (cos'e'/quando serve, differenza con SCIA/CILA, iter/tempi/costi/sanzioni) + FAQ + correlati.
 */
const pillar: PillarContent = {
  kind: 'guida',
  slug: 'permesso-di-costruire',
  titolo: 'PDC',
  h1: 'Permesso di Costruire: cos\'è e come funziona',
  answerFirst:
    'Il Permesso di Costruire (PdC) è il titolo edilizio previsto dal Testo Unico Edilizia (art. 10 DPR 380/2001) per gli interventi più rilevanti: nuove costruzioni, ristrutturazioni edilizie "pesanti" con demolizione e ricostruzione, ampliamenti volumetrici e interventi che modificano sagoma, volume o destinazione d\'uso urbanisticamente rilevante di un edificio esistente. È rilasciato dal Comune dopo un\'istruttoria tecnica sul progetto e i lavori possono iniziare solo dopo averlo ottenuto, a differenza di CILA e SCIA.',
  sections: [
    {
      heading: 'Cos\'è il Permesso di Costruire e quando serve',
      body:
        'Il Permesso di Costruire è l\'autorizzazione comunale richiesta per gli interventi che incidono in modo sostanziale sul territorio e sull\'edificio esistente. Serve tipicamente per: nuove costruzioni fuori terra o interrate; ristrutturazioni edilizie "pesanti", cioè che comportano demolizione e ricostruzione con modifica di sagoma, volumi, prospetti o area di sedime rispetto all\'edificio preesistente; ampliamenti che aumentano la volumetria esistente; interventi di ristrutturazione urbanistica; cambi di destinazione d\'uso che comportano un aumento del carico urbanistico (ad esempio da agricolo a residenziale). A differenza di CILA e SCIA, che riguardano interventi su un edificio già esistente senza alterarlo in modo sostanziale, il Permesso di Costruire è necessario quando l\'intervento cambia in modo significativo la consistenza edilizia o urbanistica dell\'immobile.',
    },
    {
      heading: 'Differenza tra Permesso di Costruire, SCIA e CILA',
      body:
        'Il criterio distintivo tra i tre titoli è la portata dell\'intervento sull\'edificio e sul contesto urbanistico. La CILA copre interventi di manutenzione straordinaria non strutturale, senza attesa per iniziare i lavori. La SCIA copre interventi più incisivi, spesso anche strutturali, ma che non modificano sagoma o volume dell\'edificio: in molti Comuni si può iniziare subito, salvo il termine di controllo comunale successivo. Il Permesso di Costruire, invece, richiede una vera e propria istruttoria tecnica preventiva da parte del Comune e i lavori possono iniziare solo dopo il suo rilascio: è il titolo corretto quando l\'intervento comporta nuova costruzione, aumento di volumetria o modifica sostanziale della sagoma esistente. In sintesi: CILA per il rinnovo senza attesa, SCIA per interventi più rilevanti ma senza aumento di volume, Permesso di Costruire per tutto ciò che trasforma in modo sostanziale l\'edificio o il terreno.',
    },
    {
      heading: 'Iter, tempi, costi e sanzioni del Permesso di Costruire',
      body:
        'La domanda di Permesso di Costruire si presenta allo Sportello Unico Edilizia (SUE) del Comune competente, con un progetto firmato da un tecnico abilitato (architetto o ingegnere), corredato di elaborati grafici, relazioni tecniche e, se richiesta, relazione paesaggistica o strutturale. Il Comune effettua un\'istruttoria e rilascia (o nega) il permesso entro termini previsti dalla normativa, di norma tra 60 e 90 giorni dalla presentazione della domanda completa, che possono arrivare fino a 180 giorni nei casi più complessi o quando servono pareri di altri enti (ad esempio Soprintendenza o Vigili del Fuoco): i tempi effettivi variano da Comune a Comune. Il rilascio del Permesso di Costruire comporta di norma il pagamento di un contributo di costruzione, composto da oneri di urbanizzazione e costo di costruzione, il cui importo varia in base al Comune, alla zona e alla tipologia di intervento: va sempre verificato con il tecnico incaricato e con l\'ufficio tecnico comunale. Costruire senza Permesso di Costruire quando è obbligatorio costituisce abuso edilizio, sanzionato dal DPR 380/2001 con misure che vanno dalla sanzione pecuniaria fino alla demolizione dell\'opera nei casi più gravi.',
    },
  ],
  faq: [
    {
      q: 'Quanto tempo ci vuole per ottenere il Permesso di Costruire?',
      a: 'Di norma tra 60 e 90 giorni dalla presentazione della domanda completa, con possibilità di arrivare fino a 180 giorni nei casi più complessi o quando sono richiesti pareri di altri enti. I tempi esatti dipendono dal Comune e dal tipo di intervento.',
    },
    {
      q: 'Quanto costa il Permesso di Costruire?',
      a: 'Oltre all\'onorario del tecnico per il progetto, è di norma dovuto un contributo di costruzione (oneri di urbanizzazione e costo di costruzione), il cui importo varia in base a Comune, zona e tipo di intervento: va verificato con l\'ufficio tecnico comunale.',
    },
    {
      q: 'Qual è la differenza tra Permesso di Costruire e SCIA?',
      a: 'Il Permesso di Costruire serve per nuove costruzioni, ampliamenti e ristrutturazioni "pesanti" che modificano sagoma o volume dell\'edificio, e richiede autorizzazione preventiva. La SCIA copre interventi più contenuti, senza aumento di volumetria, spesso con inizio lavori più rapido.',
    },
    {
      q: 'Cosa succede se costruisco senza Permesso di Costruire?',
      a: 'È un abuso edilizio, sanzionato dal Testo Unico Edilizia (DPR 380/2001) con misure che vanno dalla sanzione pecuniaria alla demolizione dell\'opera, a seconda della gravita\' e della conformità urbanistica dell\'intervento.',
    },
    {
      q: 'Il Permesso di Costruire ha una scadenza?',
      a: 'Sì. I lavori devono iniziare entro un termine dal rilascio (in genere 1 anno) e concludersi entro un altro termine successivo (in genere 3 anni), salvo proroghe previste dalla normativa e dal Comune: i termini esatti vanno verificati sul titolo rilasciato.',
    },
  ],
  correlati: [
    { label: 'Cos\'è la SCIA', href: '/guide/scia' },
    { label: 'Cos\'è la CILA', href: '/guide/cila' },
    { label: 'SCIA o CILA: quale scegliere', href: '/guide/scia-o-cila' },
  ],
  metaTitle: 'Permesso di Costruire: cos\'è, quando serve e come funziona',
  metaDescription:
    'Cos\'è il Permesso di Costruire: quando serve, differenze con SCIA e CILA, iter, tempi, costi e sanzioni per chi costruisce senza autorizzazione.',
  ondata: 1,
};

export default pillar;

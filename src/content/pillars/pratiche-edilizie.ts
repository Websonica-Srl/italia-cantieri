import type { PillarContent } from '@/lib/content/pillars';

/**
 * Pillar guida: Pratiche edilizie (ondata 2).
 * Target keyword: "pratiche edilizie" (880/mese). Intent: proprietario o tecnico che
 * cerca un orientamento generale tra i titoli abilitativi edilizi italiani, prima di
 * capire quale serve al proprio caso. Guida ombrello (angolo normativo puro, nessun
 * blocco-dato): panoramica dei titoli (edilizia libera, CILA, SCIA, Permesso di
 * Costruire), come scegliere, iter generale + FAQ + correlati verso tutte le altre guide.
 * Nota: guida di sintesi generale, non associata a un singolo TipoTitolo -> campo
 * 'titolo' omesso (Task 11).
 */
const pillar: PillarContent = {
  kind: 'guida',
  slug: 'pratiche-edilizie',
  h1: 'Pratiche edilizie: guida ai titoli abilitativi',
  answerFirst:
    "Le pratiche edilizie sono l'insieme delle procedure con cui un intervento su un immobile viene comunicato o autorizzato dal Comune prima di iniziare i lavori. Il Testo Unico Edilizia (DPR 380/2001) prevede quattro regimi principali, in ordine crescente di complessita': edilizia libera (nessun titolo, art. 6), CILA (Comunicazione di Inizio Lavori Asseverata, art. 6-bis), SCIA (Segnalazione Certificata di Inizio Attivita', art. 22-23) e Permesso di Costruire (art. 10). Il titolo corretto dipende dal tipo di intervento, dalla sua incidenza su struttura, sagoma, volumi e destinazione d'uso dell'edificio, e va sempre verificato con un tecnico abilitato prima di procedere.",
  sections: [
    {
      heading: 'I quattro titoli edilizi: panoramica',
      body:
        "L'edilizia libera (art. 6 DPR 380/2001) comprende gli interventi che non richiedono alcun titolo ne' comunicazione, come manutenzione ordinaria, piccole riparazioni, opere temporanee o alcuni interventi di efficientamento energetico specificamente individuati dalla legge: restano comunque soggetti al rispetto delle norme di sicurezza, antisismiche, igienico-sanitarie e dei regolamenti condominiali. La CILA (art. 6-bis) e' il titolo piu' leggero tra quelli che richiedono una comunicazione: si usa per manutenzione straordinaria che non tocca le parti strutturali, e permette di iniziare i lavori il giorno stesso della presentazione. La SCIA (art. 22-23) copre interventi piu' incisivi, come ristrutturazioni che toccano elementi strutturali o l'intera unita' immobiliare, e richiede un termine di attesa prima dell'avvio lavori. Il Permesso di Costruire (art. 10) e' il titolo piu' completo, necessario per nuove costruzioni, ampliamenti volumetrici, ristrutturazioni \"pesanti\" che modificano sagoma o volumi, e cambi di destinazione d'uso urbanisticamente rilevanti con impatto significativo.",
    },
    {
      heading: 'Come scegliere il titolo giusto',
      body:
        "La scelta del titolo dipende da tre fattori principali: cosa cambia fisicamente nell'edificio (finiture, impianti, struttura, sagoma, volumi), se cambia la destinazione d'uso rispetto a quella autorizzata, e se l'immobile e' soggetto a vincoli (paesaggistici, storici, condominiali) che possono richiedere autorizzazioni aggiuntive indipendentemente dal titolo edilizio di base. In generale: interventi che non toccano la struttura e non alterano gli spazi in modo sostanziale rientrano in edilizia libera o CILA; interventi che toccano elementi strutturali o l'intera unita' immobiliare, ma senza aumento di volumetria, rientrano nella SCIA; interventi che aumentano la volumetria, modificano sagoma o prospetti, o comportano un cambio di destinazione d'uso rilevante, richiedono il Permesso di Costruire. Questa e' una guida di orientamento generale: la qualificazione esatta dipende anche dal regolamento edilizio del Comune specifico e dalla normativa regionale, quindi va sempre confermata con un tecnico abilitato (architetto, ingegnere o geometra) prima di presentare la pratica.",
    },
    {
      heading: "L'iter generale delle pratiche edilizie",
      body:
        "Tutte le pratiche edilizie soggette a comunicazione o autorizzazione si presentano allo Sportello Unico Edilizia (SUE) del Comune competente, generalmente per via telematica, a cura di un tecnico abilitato che redige la relazione tecnica e gli elaborati di progetto. Le tempistiche cambiano molto in base al titolo: la CILA non ha termini di attesa (i lavori iniziano subito dopo la presentazione), la SCIA ha un termine di controllo di 30 giorni perentori (art. 19 comma 6-bis L. 241/1990), fermo restando che gli immobili vincolati richiedono un'autorizzazione paesaggistica o storica separata e preliminare, il Permesso di Costruire richiede tipicamente 60-90 giorni per il rilascio, salvo proroghe. A conclusione dei lavori, per tutti i titoli e' generalmente richiesta la presentazione della fine lavori e, se previsto, dell'agibilita', oltre all'eventuale aggiornamento catastale. Presentare la pratica sbagliata, o non presentarla affatto quando dovuta, espone a sanzioni che vanno da importi pecuniari fissi fino, nei casi piu' gravi, alla demolizione dell'opera abusiva.",
    },
  ],
  faq: [
    {
      q: 'Quali sono i principali titoli edilizi in Italia?',
      a: "Sono quattro: edilizia libera (nessun titolo, art. 6 DPR 380/2001), CILA (Comunicazione di Inizio Lavori Asseverata, art. 6-bis), SCIA (Segnalazione Certificata di Inizio Attivita', art. 22-23) e Permesso di Costruire (art. 10), in ordine crescente di complessita' e di incidenza dell'intervento sull'edificio.",
    },
    {
      q: 'Come faccio a sapere quale pratica edilizia serve per il mio intervento?',
      a: "Dipende da cosa cambia nell'edificio: finiture e impianti senza opere strutturali rientrano in edilizia libera o CILA, interventi strutturali o su un'intera unita' immobiliare in SCIA, aumenti di volumetria o modifiche di sagoma in Permesso di Costruire. La qualificazione esatta va sempre verificata con un tecnico abilitato, perche' dipende anche dal regolamento comunale.",
    },
    {
      q: 'Chi puo\' presentare una pratica edilizia?',
      a: "La pratica va presentata da un tecnico abilitato (architetto, ingegnere, geometra o perito edile) allo Sportello Unico Edilizia (SUE) del Comune competente, per conto del proprietario o dell'avente titolo sull'immobile.",
    },
    {
      q: 'Cosa succede se presento la pratica edilizia sbagliata o non la presento?',
      a: "Le conseguenze variano in base alla gravita': si va da sanzioni pecuniarie fisse (ad esempio per lavori CILA non comunicati) fino, nei casi piu' gravi di interventi eseguiti senza alcun titolo quando necessario, alla possibile demolizione dell'opera abusiva. E' sempre preferibile regolarizzare la posizione (ove possibile) prima che vengano contestati abusi edilizi.",
    },
    {
      q: 'Quanto tempo ci vuole per ottenere un titolo edilizio?',
      a: "Varia molto: la CILA non ha termini di attesa (si inizia subito), la SCIA prevede un termine di controllo di 30 giorni perentori (le eventuali autorizzazioni per immobili vincolati sono separate e preliminari), il Permesso di Costruire richiede tipicamente 60-90 giorni per il rilascio, salvo proroghe previste dalla normativa.",
    },
  ],
  correlati: [
    { label: "Cos'e' la CILA", href: '/guide/cila' },
    { label: "Cos'e' la SCIA", href: '/guide/scia' },
    { label: 'Permesso di Costruire', href: '/guide/permesso-di-costruire' },
    { label: 'SCIA o CILA: quale scegliere', href: '/guide/scia-o-cila' },
  ],
  metaTitle: 'Pratiche edilizie: guida ai titoli abilitativi',
  metaDescription:
    "Pratiche edilizie in Italia: edilizia libera, CILA, SCIA e Permesso di Costruire. Come scegliere il titolo giusto e come funziona l'iter in Comune.",
  ondata: 2,
};

export default pillar;

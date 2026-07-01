import type { PillarContent } from '@/lib/content/pillars';

/**
 * Pillar intervento: Ampliamento (ondata 2).
 * Target keyword: "ampliamento casa" (590/mese). Intent: proprietario che valuta di
 * aumentare la volumetria di un immobile esistente (sopraelevazione, veranda, corpo
 * aggiunto). Copy definitivo (Task 17): answer-first + 3 sezioni (quando serve/Piano Casa,
 * quale titolo edilizio, quanto costa) + FAQ + correlati. Nessun dato di piattaforma
 * (numeri cantieri) qui: arriva dinamicamente dal blocco-dato della route.
 */
const pillar: PillarContent = {
  kind: 'intervento',
  slug: 'ampliamento',
  intervento: 'ampliamento',
  h1: 'Ampliamento casa: quando serve, titoli edilizi e costi',
  answerFirst:
    "L'ampliamento e' l'intervento edilizio che aumenta la volumetria o la superficie di un edificio esistente, ad esempio con una sopraelevazione, un corpo aggiunto o la chiusura di una veranda che crea nuovo volume. A differenza della ristrutturazione, che rinnova l'esistente senza aumentarne la consistenza, l'ampliamento e' sempre un incremento reale di cubatura. Comportando nuova volumetria, richiede di norma il Permesso di Costruire, salvo i casi in cui leggi regionali sul cosiddetto Piano Casa consentano ampliamenti percentuali con titoli piu' snelli.",
  sections: [
    {
      heading: "Quando serve l'ampliamento e cosa comprende",
      body:
        "Si parla di ampliamento quando l'intervento aggiunge volumetria o superficie a un edificio gia' esistente, senza demolirlo. Rientrano qui: la sopraelevazione di un piano, la realizzazione di un corpo aggiunto (ad esempio un vano scala esterno o un locale accessorio), la chiusura di logge o balconi che genera nuovo volume, l'ampliamento del sedime con nuove fondazioni. Serve tipicamente quando la superficie disponibile non basta piu' alle esigenze della famiglia o dell'attivita', oppure quando le normative locali consentono un incremento volumetrico premiale (efficientamento energetico, Piano Casa regionale). L'ampliamento va sempre distinto dalla ristrutturazione: se i lavori restano dentro sagoma e volume esistenti non c'e' ampliamento, anche se l'intervento e' esteso.",
    },
    {
      heading: "Quale titolo edilizio serve per ampliare casa",
      body:
        "L'aumento di volumetria e' l'elemento che, secondo il DPR 380/2001, qualifica generalmente l'intervento come soggetto a Permesso di Costruire: e' il titolo di riferimento per gli ampliamenti che superano le soglie di semplice manutenzione o ristrutturazione senza incremento di cubatura. In alcune Regioni, le leggi sul cosiddetto Piano Casa consentono ampliamenti di limitata entita' (una percentuale della volumetria esistente, con soglie e finalita' che variano da Regione a Regione, spesso legate a efficientamento energetico o rigenerazione edilizia) autorizzabili con titoli piu' snelli come la SCIA, quando previsto dalla normativa regionale e dal regolamento comunale. La disciplina cambia sensibilmente da Regione a Regione e da Comune a Comune (distanze, altezze massime, indici di edificabilita', vincoli paesaggistici): il titolo corretto e la fattibilita' stessa dell'ampliamento vanno sempre verificati con un tecnico abilitato prima di procedere.",
    },
    {
      heading: "Quanto costa ampliare casa",
      body:
        "Il costo di un ampliamento varia in base alla tipologia di intervento, alla zona, alle finiture e alla complessita' strutturale: i numeri che seguono sono range indicativi, non un preventivo. Un ampliamento semplice (corpo aggiunto in muratura o struttura leggera, chiusura di una veranda) si aggira orientativamente tra 800 e 1.500 euro al metro quadro. Una sopraelevazione, che richiede opere strutturali piu' impegnative (fondazioni, consolidamento della struttura esistente), puo' arrivare a 1.200-2.000 euro al metro quadro o oltre. Quando il titolo e' il Permesso di Costruire, e' inoltre dovuto il contributo di costruzione (oneri di urbanizzazione e costo di costruzione), calcolato dal Comune in base alla nuova volumetria: l'importo esatto va richiesto allo Sportello Unico Edilizia. Sono spesso disponibili detrazioni fiscali anche per interventi di ampliamento in specifici casi: le aliquote e i requisiti cambiano nel tempo e vanno verificati con un tecnico o commercialista prima di avviare i lavori.",
    },
  ],
  faq: [
    {
      q: "Qual e' la differenza tra ampliamento e ristrutturazione?",
      a: "L'ampliamento aumenta la volumetria o la superficie esistente (nuova cubatura), mentre la ristrutturazione rinnova o trasforma l'edificio esistente senza necessariamente aumentarne la consistenza, salvo i casi di ristrutturazione \"pesante\" che possono comunque comportare ampliamento.",
    },
    {
      q: "Serve sempre il Permesso di Costruire per ampliare casa?",
      a: "Di norma si', perche' l'aumento di volumetria qualifica l'intervento come soggetto a PdC. Fanno eccezione gli ampliamenti di limitata entita' consentiti da leggi regionali sul Piano Casa, quando la normativa regionale e il regolamento comunale prevedono un titolo piu' snello come la SCIA.",
    },
    {
      q: "Cos'e' il Piano Casa e come influisce sull'ampliamento?",
      a: "E' l'insieme di leggi regionali che, in alcune Regioni, consentono ampliamenti volumetrici premiali entro percentuali limitate rispetto all'esistente, spesso condizionati a efficientamento energetico o rigenerazione edilizia. Le soglie, i requisiti e i titoli richiesti variano da Regione a Regione: vanno verificati con un tecnico sulla normativa vigente nel Comune specifico.",
    },
    {
      q: "Quanto costa in media un ampliamento della casa?",
      a: "Indicativamente da 800-1.500 euro al metro quadro per un corpo aggiunto semplice fino a 1.200-2.000 euro al metro quadro o oltre per una sopraelevazione con opere strutturali importanti. Il costo reale dipende da zona, complessita' strutturale e finiture: serve sempre un preventivo su misura.",
    },
    {
      q: "L'ampliamento comporta oneri di urbanizzazione da pagare al Comune?",
      a: "Si', quando il titolo e' il Permesso di Costruire e' dovuto il contributo di costruzione (oneri di urbanizzazione e costo di costruzione), calcolato dal Comune sulla nuova volumetria realizzata.",
    },
  ],
  correlati: [
    { label: 'Permesso di Costruire', href: '/guide/permesso-di-costruire' },
    { label: 'Cantieri di ristrutturazione', href: '/cantieri/ristrutturazione' },
  ],
  metaTitle: 'Ampliamento casa: quando serve, titoli edilizi e costi',
  metaDescription:
    "Ampliamento casa: quando serve, quale titolo edilizio richiede (Permesso di Costruire o SCIA con Piano Casa) e quanto costa indicativamente al metro quadro.",
  ondata: 2,
};

export default pillar;

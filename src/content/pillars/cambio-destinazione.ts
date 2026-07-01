import type { PillarContent } from '@/lib/content/pillars';

/**
 * Pillar intervento: Cambio di destinazione d'uso (ondata 2).
 * Target keyword: "cambio destinazione uso" (2.400/mese). Intent: proprietario o tecnico
 * che valuta di cambiare l'uso di un immobile (es. da ufficio ad abitazione, da magazzino
 * a commerciale). Copy definitivo (Task 17): answer-first + 3 sezioni (quando serve/categorie
 * funzionali, quale titolo edilizio, quanto costa) + FAQ + correlati. Nessun dato di
 * piattaforma (numeri cantieri) qui: arriva dinamicamente dal blocco-dato della route.
 */
const pillar: PillarContent = {
  kind: 'intervento',
  slug: 'cambio-destinazione',
  intervento: 'cambio_destinazione',
  h1: "Cambio di destinazione d'uso: quando serve, titoli edilizi e costi",
  answerFirst:
    "Il cambio di destinazione d'uso è la modifica dell'utilizzo funzionale di un immobile rispetto a quello risultante nei titoli edilizi o nel catasto, ad esempio da ufficio ad abitazione o da magazzino a locale commerciale. E' rilevante dal punto di vista urbanistico quando comporta il passaggio tra una categoria funzionale e un'altra tra quelle previste dall'art. 23-ter del DPR 380/2001 (residenziale, turistico-ricettiva, produttiva e direzionale, commerciale, rurale). A seconda che sia accompagnato o meno da opere edilizie e da un aumento del carico urbanistico, si autorizza con CILA, SCIA o, nei casi più rilevanti, con Permesso di Costruire.",
  sections: [
    {
      heading: "Quando serve e quali sono le categorie funzionali",
      body:
        "Il Testo Unico Edilizia (art. 23-ter DPR 380/2001) individua cinque categorie funzionali autonome dal punto di vista urbanistico: residenziale, turistico-ricettiva, produttiva e direzionale, commerciale, rurale. Il cambio di destinazione d'uso è urbanisticamente rilevante solo quando comporta il passaggio da una di queste categorie a un'altra, anche senza opere edilizie: ad esempio trasformare un fondo commerciale in abitazione, o un ufficio in struttura ricettiva. Non rientrano invece nel cambio d'uso rilevante gli spostamenti all'interno della stessa categoria funzionale (ad esempio da negozio di alimentari a negozio di abbigliamento, entrambi \"commerciale\"), che restano generalmente liberi salvo diverse previsioni comunali. Le Regioni e i Comuni possono introdurre condizioni aggiuntive nei propri regolamenti edilizi e nei piani urbanistici, quindi la classificazione va sempre verificata a livello locale con un tecnico abilitato prima di procedere.",
    },
    {
      heading: "Quale titolo edilizio serve per il cambio d'uso",
      body:
        "Il titolo richiesto dipende dalla combinazione tra rilevanza urbanistica del cambio e presenza o meno di opere edilizie. Il cambio di destinazione d'uso senza opere, quando è comunque rilevante ai fini urbanistici (passaggio tra categorie funzionali diverse), si autorizza generalmente con CILA o SCIA a seconda delle previsioni regionali e comunali: molte normative regionali lo hanno infatti semplificato rispetto al passato. Se il cambio d'uso è accompagnato da opere edilizie, il titolo segue la portata dei lavori: CILA per interventi leggeri senza opere strutturali, SCIA per interventi più incisivi. Il Permesso di Costruire diventa necessario quando il cambio di destinazione d'uso comporta un aumento del carico urbanistico rilevante (ad esempio verso destinazioni più impattanti come quella commerciale o turistico-ricettiva) o quando è accompagnato da opere che di per se' richiederebbero il PdC, come un aumento di volumetria. Data la varieta' di casistiche e la rilevanza delle normative comunali e regionali, la qualificazione corretta del titolo va sempre verificata con un tecnico abilitato (architetto, ingegnere o geometra) prima di avviare la pratica.",
    },
    {
      heading: "Quanto costa il cambio di destinazione d'uso",
      body:
        "Il costo del cambio di destinazione d'uso dipende molto dal fatto che sia accompagnato o meno da opere edilizie e dal titolo richiesto: i numeri che seguono sono indicativi, non un preventivo. Un cambio d'uso senza opere comporta principalmente l'onorario del tecnico per la pratica (relazione tecnica, asseverazioni, eventuale aggiornamento catastale), che si aggira orientativamente tra 500 e 1.500 euro a seconda della complessità. Se il cambio d'uso richiede opere edilizie, ai costi tecnici si sommano quelli dei lavori veri e propri, che seguono le stesse logiche di una ristrutturazione (variabili in base a estensione e finiture). Quando il titolo è il Permesso di Costruire, è inoltre dovuto il contributo di costruzione (oneri di urbanizzazione e costo di costruzione) calcolato dal Comune in base alla nuova destinazione e alla superficie coinvolta: l'importo va richiesto direttamente allo Sportello Unico Edilizia. Anche l'eventuale variazione catastale conseguente ha un costo a parte, legato all'aggiornamento della planimetria e della categoria catastale.",
    },
  ],
  faq: [
    {
      q: "Cosa si intende per cambio di destinazione d'uso rilevante?",
      a: "E' il passaggio tra le categorie funzionali autonome previste dall'art. 23-ter del DPR 380/2001 (residenziale, turistico-ricettiva, produttiva e direzionale, commerciale, rurale). Il passaggio da una categoria all'altra è rilevante ai fini urbanistici, anche senza opere edilizie; i cambi all'interno della stessa categoria sono generalmente liberi, salvo previsioni comunali diverse.",
    },
    {
      q: "Serve sempre il Permesso di Costruire per cambiare la destinazione d'uso?",
      a: "No. Nella maggior parte dei casi basta CILA o SCIA, soprattutto quando non ci sono opere o le opere sono di lieve entità. Il Permesso di Costruire serve tipicamente quando il cambio d'uso comporta un aumento significativo del carico urbanistico o è accompagnato da opere che richiedono di per se' il PdC (es. aumento di volumetria).",
    },
    {
      q: "Da magazzino ad abitazione: cosa serve?",
      a: "E' un cambio di destinazione d'uso rilevante (da produttivo a residenziale), quindi richiede sempre un titolo edilizio e la verifica dei requisiti igienico-sanitari e urbanistici per l'uso abitativo (altezze, aerazione, superfici minime). Il titolo esatto dipende dalla normativa regionale/comunale e dalla presenza di opere: va verificato con un tecnico.",
    },
    {
      q: "Il cambio di destinazione d'uso comporta oneri da pagare al Comune?",
      a: "Se il titolo richiesto è il Permesso di Costruire, si', è dovuto il contributo di costruzione calcolato dal Comune sulla nuova destinazione. Con CILA o SCIA senza opere rilevanti, di norma non sono dovuti oneri di urbanizzazione, ma questo va verificato con lo Sportello Unico Edilizia del Comune competente.",
    },
    {
      q: "Bisogna aggiornare il catasto dopo un cambio di destinazione d'uso?",
      a: "Si', quando il cambio d'uso modifica la categoria catastale dell'immobile va presentata una variazione catastale all'Agenzia delle Entrate entro i termini di legge, indipendentemente dal titolo edilizio con cui è stato autorizzato l'intervento.",
    },
  ],
  correlati: [
    { label: "Cos'e' la SCIA", href: '/guide/scia' },
    { label: 'Permesso di Costruire', href: '/guide/permesso-di-costruire' },
    { label: 'Cantieri di ristrutturazione', href: '/cantieri/ristrutturazione' },
  ],
  metaTitle: "Cambio di destinazione d'uso: quando serve, titoli edilizi e costi",
  metaDescription:
    "Cambio di destinazione d'uso: quando è rilevante, quale titolo edilizio richiede (CILA, SCIA o Permesso di Costruire) e quanto costa indicativamente.",
  ondata: 2,
};

export default pillar;

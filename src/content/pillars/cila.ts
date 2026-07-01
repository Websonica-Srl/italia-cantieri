import type { PillarContent } from '@/lib/content/pillars';

/**
 * Pillar guida: CILA (ondata 1).
 * Copy pieno (Task 11). Target keyword "cila" (49.500/mese) + "cila cos'e'" (2.900/mese).
 * Intent: proprietario/tecnico. Angolo: normativo puro (nessun blocco-dato, editoriale).
 *
 * Fix (Task 11): metaTitle NON deve includere il suffisso " | Italia Cantieri":
 * il root layout applica gia' il template `%s | Italia Cantieri` (src/app/layout.tsx).
 * La versione precedente includeva il suffisso in metaTitle -> doppio suffisso a runtime
 * ("... | Italia Cantieri | Italia Cantieri"). Vedi anche ristrutturazione.ts (Task 10)
 * che segue gia' la convenzione corretta (metaTitle senza suffisso).
 */
const pillar: PillarContent = {
  kind: 'guida',
  slug: 'cila',
  titolo: 'CILA',
  h1: 'CILA: cos\'e\' e come funziona la Comunicazione di Inizio Lavori Asseverata',
  answerFirst:
    'La CILA (Comunicazione di Inizio Lavori Asseverata) e\' il titolo edilizio piu\' leggero previsto dal Testo Unico Edilizia (art. 6-bis DPR 380/2001): permette di iniziare i lavori il giorno stesso della presentazione, senza attesa ne\' autorizzazione preventiva del Comune. Basta l\'asseverazione di un tecnico abilitato che certifichi la conformita\' urbanistica e catastale dell\'intervento. Si usa per manutenzione straordinaria che non tocca le parti strutturali dell\'edificio: non e\' adatta a interventi che modificano sagoma, volume o struttura portante.',
  sections: [
    {
      heading: 'Quando si usa la CILA e quando NON basta',
      body:
        'La CILA copre gli interventi di manutenzione straordinaria che non riguardano le parti strutturali: spostamento di tramezzi non portanti, rifacimento di pavimentazioni e rivestimenti, sostituzione di infissi, realizzazione o rimozione di controsoffitti, rifacimento di impianti (idraulico, elettrico, termico) senza alterare i volumi. E\' il titolo corretto anche per l\'installazione di alcuni impianti tecnologici quando non richiedono altro titolo abilitativo.\n\nLa CILA NON basta quando l\'intervento tocca le parti strutturali (demolizione o costruzione di muri portanti, solai, scale in cemento armato), quando cambia la sagoma o il volume dell\'edificio, o quando comporta un cambio di destinazione d\'uso urbanisticamente rilevante. In questi casi serve la SCIA (per interventi piu\' incisivi ma senza aumento di volumetria, come ristrutturazioni "pesanti" o interventi sull\'involucro) oppure il Permesso di Costruire (per nuove costruzioni, ampliamenti volumetrici e modifiche di sagoma). Anche gli interventi su immobili vincolati (centri storici, beni tutelati) possono richiedere autorizzazioni aggiuntive oltre alla CILA.',
    },
    {
      heading: 'Iter, tempi, costi e sanzioni',
      body:
        'La CILA si presenta allo Sportello Unico Edilizia (SUE) del Comune, di norma per via telematica, allegando la relazione tecnica del progettista asseverante e gli elaborati grafici dello stato di fatto e di progetto. A differenza di SCIA e Permesso di Costruire, non c\'e\' alcun termine di attesa: i lavori possono iniziare lo stesso giorno del deposito, perche\' la CILA non e\' soggetta a controllo preventivo (il Comune puo\' comunque effettuare verifiche successive).\n\nI costi tipici sono l\'onorario del tecnico abilitato per il sopralluogo, la relazione asseverata e gli elaborati grafici: l\'importo varia in base alla complessita\' dell\'intervento e non e\' fissato per legge. Non e\' previsto un contributo di costruzione per gli interventi propriamente di manutenzione straordinaria oggetto di CILA.\n\nChi esegue lavori senza presentare la CILA e\' soggetto a una sanzione pecuniaria fissa (art. 6-bis, comma 5, DPR 380/2001), ridotta se la comunicazione viene presentata tardivamente ("CILA in sanatoria") prima che siano contestati abusi edilizi rilevanti. Le variazioni catastali eventualmente conseguenti all\'intervento vanno comunque comunicate all\'Agenzia delle Entrate nei termini di legge.',
    },
  ],
  faq: [
    {
      q: 'Quanto tempo serve per ottenere una CILA?',
      a: 'Nessuna attesa: a differenza di SCIA e Permesso di Costruire, con la CILA i lavori possono iniziare lo stesso giorno della presentazione, perche\' non e\' soggetta a controllo preventivo del Comune.',
    },
    {
      q: 'Chi puo\' asseverare una CILA?',
      a: 'Solo un tecnico abilitato iscritto al relativo albo professionale (architetto, ingegnere, geometra o perito edile), che si assume la responsabilita\' della conformita\' urbanistica, edilizia e catastale dell\'intervento dichiarato.',
    },
    {
      q: 'Cosa succede se non presento la CILA prima dei lavori?',
      a: 'I lavori effettuati senza CILA sono irregolari e soggetti a una sanzione pecuniaria fissa prevista dal DPR 380/2001, oltre all\'obbligo di regolarizzare la posizione con una CILA tardiva ("in sanatoria").',
    },
    {
      q: 'CILA e SCIA sono la stessa cosa?',
      a: 'No. La CILA copre interventi piu\' semplici (manutenzione straordinaria non strutturale) e non richiede il termine di controllo di 30 giorni previsto invece dalla SCIA, che si usa per interventi piu\' incisivi come la ristrutturazione "leggera" o il restauro.',
    },
    {
      q: 'Serve un progetto vero e proprio per la CILA?',
      a: 'Serve una relazione tecnica asseverata con gli elaborati grafici essenziali (stato di fatto e di progetto), non un progetto esecutivo completo come per il Permesso di Costruire: la complessita\' degli elaborati dipende dall\'intervento.',
    },
  ],
  correlati: [
    { label: 'Cos\'e\' la SCIA', href: '/guide/scia' },
    { label: 'SCIA o CILA: quale scegliere', href: '/guide/scia-o-cila' },
    { label: 'Cantieri di ristrutturazione', href: '/cantieri/ristrutturazione' },
  ],
  metaTitle: 'CILA: cos\'e\', quando serve e come funziona',
  metaDescription:
    'Cos\'e\' la CILA (Comunicazione di Inizio Lavori Asseverata): quando si usa, quando NON basta, iter, tempi, costi e sanzioni. Differenze con SCIA e Permesso di Costruire.',
  ondata: 1,
};

export default pillar;

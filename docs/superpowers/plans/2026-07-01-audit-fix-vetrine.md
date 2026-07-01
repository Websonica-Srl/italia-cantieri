# Piano — Fix audit usabilità vetrine (italiacantieri.it + bandigaredappalto.it)

Data: 2026-07-01. Fonte: due report di test di usabilità (cantieri + bandi).
Repo coinvolti: `italia-cantieri`, `italia-bandi`, DB Supabase PROD (`obcxbjxyznbzvgxwptvi`).
Vincolo: PROD (ogni push → deploy Railway). DDL additivo consentito (non distruttivo).

## Diagnosi confermata sul DB (read-only)

| Fatto | Valore reale | Mostrato | Causa |
|---|---|---|---|
| Cantieri totali | 36.005 (`cantieri_pubblici_attivi`) | header 36.005 ok / breakdown 29.980 | **stale-cache** (`client.ts` senza override fetch → `.next/cache` congela i dati al build) |
| Cantieri per-regione | 16.563/8.930/4.284/2.923/2.696/609 | 14.257/6.565/… | stale-cache |
| Bandi home stats RPC | `get_bandi_home_stats()` = **8,36s** | 0/0/0/0 | supera statement_timeout anon → catch → zero |
| Bandi lista `/bandi` | query 53ms (ok) | "Nessun risultato" | **stale-cache** (build vecchio pre-fix `count:planned`) |
| Bandi totali | 51.463 | 50.882/50.967 | hardcoded + enumerazione parziale |
| `get_cantieri_distinct_counts` | **NON esiste** | fallback paginato con cap | RPC mancante → "36 comuni" parziale |
| `importo_lavori` (cantieri) | sempre NULL | "0 €" | metrica da nascondere |
| CIG == numero_bando | uguali nella view | duplicato | dato ingestion; frontend: non duplicare |

## Decisione utente
- **Conteggi home = "circa", istantanei (decimi di secondo)**. Non serve il numero esatto.
  → **stats-cache** (tabella 1 riga per prodotto) aggiornata da **pg_cron**, letta via RPC istantanea.

## Decisioni copy (default autonomi, rivedibili)
- Freschezza: unificare tutto su **"aggiornati ogni settimana"** (l'ingestion è on-demand, non giornaliera). Rimuovere "ogni giorno".
- "Tutto gratuito, sempre" → **"Consultazione gratuita dei dati pubblici"** (niente assoluto; il soft-paywall resta per export/alert).
- Cantieri chi-siamo: **rimuovere** "contatti diretti dei professionisti" (falso + rischio GDPR: non abbiamo recapiti). Riformulare in "link all'atto pubblico e ai soggetti dichiarati".
- "SOLO DATI PUBBLICI" + GA: chiarire che GA è solo analytics di navigazione (nessun dato personale dei cantieri).

---

## WS-DB — stats-cache condivisa (PROD, additivo)
1. Tabella `public.stats_cache(key text pk, payload jsonb not null, updated_at timestamptz default now())`. RLS on + policy SELECT anon.
2. `refresh_stats_cache()` (SECURITY DEFINER) calcola e upserta:
   - `bandi_home` → {totale, aperti, enti, importo_base_tot}
   - `cantieri_home` → {totale, regioni, comuni, importo_tot}
   - `cantieri_regioni` → [{regione, n}]
   - `bandi_regioni` → [{regione, n}]
   - `bandi_cpv_group` → [{gruppo, n}]
   - `bandi_aggiudicazioni` → {tot, rti}
3. pg_cron: `refresh_stats_cache()` ogni ora. Eseguire una volta subito.
4. RPC lettura (STABLE, instant, grant anon): riscrivere `get_bandi_home_stats()` per leggere `stats_cache`; nuove `get_cantieri_home_stats()`, `get_cantieri_regioni_cached()`, `get_bandi_regioni_cached()`, `get_bandi_cpv_group_cached()`.
5. Leaderboard tie-breaker: aggiungere `firm_slug` come secondo `order by` nelle view/RPC leaderboard/rti/buyer/landscape (o nel query-layer). Verificare in `intelligence.ts`.
6. `get_advisors security` dopo migrazione.

## WS-CANTIERI (repo italia-cantieri)
C1. `client.ts`: singleton + override `global.fetch` con `next:{revalidate:60}` (fix stale-cache, come template satelliti).
C2. Home/regioni/statistiche: leggere conteggi da RPC cached (istantanei, "circa"); breakdown regioni da `get_cantieri_regioni_cached()`. Rimuovere i "~40.000/~24.748/30.000" placeholder in OG/description → valori dinamici o generici.
C3. Provincia header "0": allineare il conteggio header alla somma comuni (usare fonte ungated coerente); rimuovere il gate incoerente sull'header provincia.
C4. Scheda cantiere `/cantiere/[slug]`: renderizzare `descrizione` nel body; indirizzo con fallback `indirizzo_norm ?? indirizzo` + `civico_norm ?? civico`; aggiungere riga indirizzo nella tabella dati.
C5. Nascondere "Valore opere … 0 €" ovunque `importo_totale===0` (importo_lavori null): rimuovere KPI o mostrare "n/d".
C6. `CantiereCard.tsx`: tipo reale via label `tipo_titolo` (cantieri-core `TITOLO_LABELS`/vocab) invece di fallback "Cantiere"; se null → intervento_categoria.
C7. Redirect gerarchico: aggiungere in `next.config.js` redirect `/:regione/:provincia/:comune` → `/comune/:comune` (evita 404); breadcrumb href allineati alle route reali.
C8. `/come-trattiamo-i-dati`: rimuovere il redirect a `/legal/privacy` (la pagina dedicata esiste) — i link puntano alla pagina reale.
C9. Helper eufonico `prepA(nome)` in `lib/utils.ts` ("a"/"ad"); applicare a tutti i "a ${comune}".
C10. Accenti: correggere ~103 stringhe (gia→già, piu→più, e'→è, attivita→attività, ecc.).
C11. Formattazione numeri: usare `formatNumber` ovunque (no `.toString()`/`Math.round` grezzi).
C12. Freschezza: "ogni giorno" → "ogni settimana" (unificare).
C13. Statistiche: label "Top 20 regioni" → "Regioni coperte"; rimuovere sparkline placeholder (o marcare esplicitamente "illustrativa" — default: rimuovere).
C14. Comuni coperti: fonte unica (RPC cached) su home e regione.

## WS-BANDI (repo italia-bandi)
B1. `client.ts`: aggiungere override `global.fetch` con `next:{revalidate:60}` + esporre `.rpc` nel noopClient.
B2. Home counters: `getBandiStats` legge RPC cached (istantaneo). Verificare valori ~reali.
B3. `/bandi` + ricerca: confermato query ok; il fix stale-cache (B1) + redeploy risolve. NON inghiottire silenziosamente: loggare l'errore (già fatto) e — opzionale — mostrare stato "errore temporaneo" invece di lista vuota muta.
B4. Conteggi CPV single-source: usare `get_bandi_cpv_group_cached()` per home/filtro/categoria. Rimuovere numeri hardcoded (50.882, 25.495, 36.254, 11.901) → cached/live o generici.
B5. `fetchAllBandiRows`: su errore di pagina **non** troncare silenziosamente (throw o retry) per non produrre conteggi parziali divergenti; comunque i conteggi passano alla cache.
B6. Leaderboard tie-breaker (coordinato con WS-DB o in query-layer `.order('firm_slug')`).
B7. Doppio euro: `BandoCard.tsx` — rimuovere icona euro OPPURE il simbolo dal formatter (scegliere: tenere icona, formatter senza €). Coerenza in dettaglio.
B8. Header sticky: spacer globale in `layout.tsx` (pt sul `<main>`) + `scroll-margin-top` per le ancore.
B9. Badge "Scade domani": posizione uniforme (ancorare, no wrap ballerino).
B10. "Dettagli": rendere accessibile (`group-focus`, aria) — la card resta il link.
B11. `decodeEntities()` util applicata a `oggetto`/`descrizione_completa`/`stazione_appaltante` (decodifica `&#8220;` ecc.).
B12. Accenti hardcoded (e'→è, piu'→più, societa'→società, meta'→metà…) in CompetitivitaBox/LandscapeBlock/classifiche/categoria.
B13. Paywall copy: "Iscriviti gratis per vedere tutti i N vincitori" (accordo genere) + logica non ingannevole (mostrare che sblocca contatti/export, non "tutte le X" già visibili).
B14. Dettaglio: se `numero_bando === cig` mostrare solo CIG.
B15. Glossario: SOA e CIG → "ANAC" (non "autorità di vigilanza sui contratti pubblici").
B16. Filtro categorie: derivare opzioni dal set CPV completo/cached (no gruppi mancanti).

## Gate & verifica (per ogni repo)
- `npm run build` verde.
- Agenti gate: `pr-review-toolkit:code-reviewer` + `pr-review-toolkit:silent-failure-hunter`.
- Test: vitest per utils puri (prepA, decodeEntities, formatter, label tipo). Aggiungere vitest a italia-bandi.
- Playwright (MCP) su dev server locale: verifica ogni bug chiave risolto (conteggi coerenti, /bandi popolata, scheda con indirizzo/descrizione, no €€, no "a Asti", ecc.). Obiettivo 100% verde.
- `get_advisors security` dopo DDL.

## Ordine esecuzione
1. WS-DB (sblocca conteggi) → 2. WS-CANTIERI + WS-BANDI in parallelo (repo distinti) → 3. gate+build+Playwright → 4. commit/push (autonomo) → deploy → verifica live.

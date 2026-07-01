import { siteConfig } from '@/lib/site-config';
import { getInterventoPillarSlugs, getGuidaPillarSlugs, getPillar } from '@/lib/content/pillars';

export const dynamic = 'force-static';
export const revalidate = 3600;

/**
 * llms.txt (convenzione emergente per agenti AI/LLM crawler): riassunto del
 * sito + elenco delle risorse stabili con URL assoluto e descrizione, cosi'
 * un modello puo' orientarsi senza dover crawlare tutto il sito.
 *
 * Include solo i pillar pubblicati (answerFirst non vuoto): gli stub non
 * hanno ancora copy pronto e restano fuori (coerente con lo shard "pillar"
 * della sitemap, vedi src/app/sitemap.ts).
 */
export async function GET() {
  const baseUrl = siteConfig.baseUrl;
  const lines: string[] = [];

  lines.push(`# ${siteConfig.name}`);
  lines.push(`> ${siteConfig.description}`);
  lines.push('');
  lines.push(
    'Dati aggregati da fonti open data della Pubblica Amministrazione italiana (permessi di costruire, SCIA, CILA, bandi di gara), pubblicati con piena trasparenza GDPR.'
  );
  lines.push('');

  lines.push('## Guide normative');
  for (const slug of getGuidaPillarSlugs()) {
    const p = getPillar('guida', slug);
    if (!p || !p.answerFirst) continue;
    lines.push(`- [${p.h1}](${baseUrl}/guide/${p.slug}): ${p.metaDescription}`);
  }
  lines.push('');

  lines.push('## Interventi edilizi');
  for (const slug of getInterventoPillarSlugs()) {
    const p = getPillar('intervento', slug);
    if (!p || !p.answerFirst) continue;
    lines.push(`- [${p.h1}](${baseUrl}/cantieri/${p.slug}): ${p.metaDescription}`);
  }
  lines.push('');

  lines.push('## Altre risorse');
  lines.push(`- [Cantieri](${baseUrl}/cantieri): elenco e ricerca cantieri edilizi per regione, provincia, comune.`);
  lines.push(`- [Guide](${baseUrl}/guide): guide sui titoli edilizi (CILA, SCIA, permesso di costruire).`);
  lines.push(`- [Statistiche](${baseUrl}/statistiche): dati aggregati su volumi e tipologie di cantieri.`);
  lines.push(`- [Glossario](${baseUrl}/glossario): definizioni dei termini tecnici dell'edilizia.`);

  return new Response(lines.join('\n') + '\n', {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}

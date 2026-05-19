import { ExternalLink, Users } from 'lucide-react';
import { slugify } from '@/lib/utils';

interface Props {
  comune: string;
  countImprese?: number;
}

export default function CrossLinkCorrelati({ comune, countImprese }: Props) {
  if (!comune) return null;
  const slug = slugify(comune);
  const hubUrl = `https://www.italiaprogettisti.com/comune/${slug}`;

  return (
    <div className="rounded-3xl border border-border bg-secondary p-6">
      <div className="flex items-start gap-3">
        <Users className="h-5 w-5 text-foreground flex-shrink-0 mt-0.5" strokeWidth={1.5} />
        <div className="flex-1">
          <h3 className="font-semibold mb-1.5">Cerchi professionisti o imprese a {comune}?</h3>
          <p className="text-sm text-secondary-text mb-4 leading-relaxed">
            {countImprese && countImprese > 0
              ? `Sul nostro database principale ItaliaProgettisti.com sono presenti ${countImprese.toLocaleString('it-IT')} imprese e studi attivi nell'area di ${comune}.`
              : `Sul nostro database principale ItaliaProgettisti.com puoi trovare studi di progettazione e imprese edili attivi nell'area di ${comune}.`}
          </p>
          <a
            href={hubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline"
          >
            Esplora imprese e studi a {comune} <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

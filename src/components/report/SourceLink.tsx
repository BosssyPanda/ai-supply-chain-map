import { ExternalLink } from 'lucide-react';
import type { Source } from '../../data/schema';
import { cn } from '../../lib/cn';

export function SourceLink({ source, className }: { source: Source; className?: string }): JSX.Element {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer"
      className={cn('block rounded-md border border-border bg-surface px-3 py-2 text-sm transition hover:border-accent/45', className)}
    >
      <span className="flex items-start justify-between gap-3 font-semibold text-foreground">
        <span>{source.title}</span>
        <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
      </span>
      <span className="mt-1 block text-xs text-muted-foreground">
        {source.publisher}
        {source.dateAccessed ? ` · ${source.dateAccessed}` : ''}
        {source.reliabilityScore ? ` · ${source.reliabilityScore} reliability` : ''}
      </span>
    </a>
  );
}

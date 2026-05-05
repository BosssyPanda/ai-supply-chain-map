import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface StageFlowItem {
  id: string;
  title: string;
  description?: ReactNode;
  meta?: ReactNode;
  icon?: ReactNode;
}

export function StageCard({
  item,
  index,
  active = false,
}: {
  item: StageFlowItem;
  index: number;
  active?: boolean;
}): JSX.Element {
  return (
    <article
      className={cn(
        'min-h-44 rounded-lg border bg-surface p-4 text-center shadow-report-soft',
        active ? 'border-accent shadow-report' : 'border-border',
      )}
    >
      <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-accent-soft text-accent">
        {item.icon ?? <span className="text-sm font-semibold">{index + 1}</span>}
      </div>
      <h3 className="mt-4 text-base font-semibold leading-snug text-foreground">{item.title}</h3>
      {item.description ? <div className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</div> : null}
      {item.meta ? <div className="mt-4 rounded-md border border-border bg-surface-muted px-3 py-2 text-xs text-muted-foreground">{item.meta}</div> : null}
    </article>
  );
}

export function StageFlow({
  items,
  activeId,
  className,
}: {
  items: StageFlowItem[];
  activeId?: string;
  className?: string;
}): JSX.Element {
  return (
    <div className={cn('grid gap-3 md:grid-cols-2 xl:grid-cols-5', className)}>
      {items.map((item, index) => (
        <div key={item.id} className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto]">
          <StageCard item={item} index={index} active={activeId === item.id} />
          {index < items.length - 1 ? (
            <div className="hidden items-center text-muted-foreground xl:flex">
              <ArrowRight className="h-5 w-5" />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

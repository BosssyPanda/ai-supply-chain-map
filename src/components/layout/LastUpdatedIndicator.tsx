import { CalendarClock } from 'lucide-react';
import { cn } from '../../lib/cn';

export function LastUpdatedIndicator({
  value,
  className,
}: {
  value?: string;
  className?: string;
}): JSX.Element {
  return (
    <div className={cn('hidden items-center gap-2 border-l border-border pl-5 text-xs text-muted-foreground lg:flex', className)}>
      <CalendarClock className="h-4 w-4" />
      <span>
        <span className="block font-semibold">Last updated</span>
        <span className="block text-foreground">{value ?? 'Data pending'}</span>
      </span>
    </div>
  );
}

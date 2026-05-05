import { Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function FilterBar({ children, className }: { children: ReactNode; className?: string }): JSX.Element {
  return <div className={cn('rounded-lg border border-border bg-surface p-4 shadow-report-soft', className)}>{children}</div>;
}

export function FilterSearch({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}): JSX.Element {
  return (
    <label className={cn('relative block', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-md border border-border bg-surface pl-10 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/15"
      />
    </label>
  );
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  allLabel: string;
  className?: string;
}): JSX.Element {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1 block text-[11px] font-semibold text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm capitalize text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option.replaceAll('_', ' ')}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FilterToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-10 rounded-md border px-3 text-sm font-semibold transition',
        active ? 'border-accent bg-accent-soft text-accent' : 'border-border bg-surface text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

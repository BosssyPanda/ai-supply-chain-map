import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { EmptyState } from './EmptyStates';

export interface ReportTableColumn<T> {
  id: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  className?: string;
}

export function ReportTable<T>({
  columns,
  rows,
  getRowKey,
  onRowClick,
  emptyMessage = 'No records match the current view.',
  className,
}: {
  columns: ReportTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}): JSX.Element {
  return (
    <div className={cn('overflow-hidden rounded-lg border border-border bg-surface shadow-report-soft', className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="border-b border-border bg-surface-muted text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th key={column.id} className={cn('px-4 py-3', column.className)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr
                key={getRowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={cn('transition hover:bg-accent-soft/60', onRowClick && 'cursor-pointer')}
              >
                {columns.map((column) => (
                  <td key={column.id} className={cn('px-4 py-3 align-top text-muted-foreground', column.className)}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 ? (
        <div className="border-t border-border p-5">
          <EmptyState message={emptyMessage} />
        </div>
      ) : null}
    </div>
  );
}

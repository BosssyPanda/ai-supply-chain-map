import { Bell } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';

export function Alerts(): JSX.Element {
  return (
    <PageShell>
      <div className="grid min-h-[60vh] place-items-center">
      <section className="max-w-xl rounded-lg border border-border bg-surface p-8 text-center shadow-report-soft">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
          <Bell className="h-7 w-7" />
        </div>
        <h1 className="mt-5 font-display text-4xl text-foreground">Research Alerts</h1>
        <p className="mt-3 text-muted-foreground">
          Coming soon: monitors for export-control changes, listing-status changes, HBM capacity updates, and grid interconnection bottleneck shifts.
        </p>
      </section>
      </div>
    </PageShell>
  );
}

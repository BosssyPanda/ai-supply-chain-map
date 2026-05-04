import { Bell } from 'lucide-react';

export function Alerts(): JSX.Element {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <section className="max-w-xl rounded-3xl border border-slate-800 bg-slate-950/75 p-8 text-center shadow-2xl">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-blue-400/40 bg-blue-500/10 text-blue-200">
          <Bell className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-3xl font-bold text-white">Research Alerts</h1>
        <p className="mt-3 text-slate-400">
          Coming soon: monitors for export-control changes, listing-status changes, HBM capacity updates, and grid interconnection bottleneck shifts.
        </p>
      </section>
    </div>
  );
}

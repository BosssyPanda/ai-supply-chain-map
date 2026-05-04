import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppShell(): JSX.Element {
  return (
    <div className="min-h-screen bg-night-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

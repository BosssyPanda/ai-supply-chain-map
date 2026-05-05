import { Outlet } from 'react-router-dom';
import { loadExplorerData } from '../../data/loaders';
import { TopNav } from './TopNav';

const data = loadExplorerData();

function getLatestSourceDate(): string | undefined {
  const dates = data.sources
    .map((source) => source.dateAccessed)
    .filter(Boolean)
    .sort();
  return dates[dates.length - 1];
}

export function AppShell(): JSX.Element {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav lastUpdated={getLatestSourceDate()} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

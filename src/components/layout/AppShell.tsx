import { Outlet, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const isAtlasRoute = location.pathname === '/' || location.pathname === '/overview' || location.pathname === '/concept/atlas';

  return (
    <div className={isAtlasRoute ? 'min-h-screen bg-[#030814] text-white' : 'min-h-screen bg-background text-foreground'}>
      <TopNav lastUpdated={getLatestSourceDate()} variant={isAtlasRoute ? 'atlas' : 'default'} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

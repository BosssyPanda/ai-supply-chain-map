import { Navigate, type RouteObject } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Alerts } from './pages/Alerts';
import { AtlasConcept } from './pages/AtlasConcept';
import { Bottlenecks } from './pages/Bottlenecks';
import { Companies } from './pages/Companies';
import { CompanyPage } from './pages/CompanyPage';
import { Comparisons } from './pages/Comparisons';
import { Materials } from './pages/Materials';
import { Overview } from './pages/Overview';
import { Sources } from './pages/Sources';
import { SupplyChain } from './pages/SupplyChain';
import { Watchlist } from './pages/Watchlist';

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Overview /> },
      { path: 'overview', element: <Navigate to="/" replace /> },
      { path: 'supply-chain', element: <SupplyChain /> },
      { path: 'companies', element: <Companies /> },
      { path: 'companies/:id', element: <CompanyPage /> },
      { path: 'materials', element: <Materials /> },
      { path: 'bottlenecks', element: <Bottlenecks /> },
      { path: 'sources', element: <Sources /> },
      { path: 'watchlist', element: <Watchlist /> },
      { path: 'comparisons', element: <Comparisons /> },
      { path: 'alerts', element: <Alerts /> },
      { path: 'concept/atlas', element: <AtlasConcept /> },
    ],
  },
];

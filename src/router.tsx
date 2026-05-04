import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Alerts } from './pages/Alerts';
import { Companies } from './pages/Companies';
import { CompanyPage } from './pages/CompanyPage';
import { Comparisons } from './pages/Comparisons';
import { Overview } from './pages/Overview';
import { SupplyChain } from './pages/SupplyChain';
import { Watchlist } from './pages/Watchlist';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Overview /> },
      { path: 'overview', element: <Navigate to="/" replace /> },
      { path: 'supply-chain', element: <SupplyChain /> },
      { path: 'companies', element: <Companies /> },
      { path: 'companies/:id', element: <CompanyPage /> },
      { path: 'watchlist', element: <Watchlist /> },
      { path: 'comparisons', element: <Comparisons /> },
      { path: 'alerts', element: <Alerts /> },
    ],
  },
]);

import { isValidElement } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { appRoutes } from './appRoutes';
import { AtlasConcept } from './pages/AtlasConcept';

function childRoute(path: string): RouteObject | undefined {
  return appRoutes[0]?.children?.find((route) => route.path === path);
}

describe('appRoutes', () => {
  it('preserves the existing application routes while adding the atlas concept', () => {
    const paths = appRoutes[0]?.children?.map((route) => route.index ? '/' : route.path);

    expect(paths).toEqual([
      '/',
      'overview',
      'supply-chain',
      'companies',
      'companies/:id',
      'materials',
      'bottlenecks',
      'sources',
      'watchlist',
      'comparisons',
      'alerts',
      'concept/atlas',
    ]);
  });

  it('renders the atlas concept at /concept/atlas instead of redirecting', () => {
    const atlasRoute = childRoute('concept/atlas');
    const element = atlasRoute?.element;

    expect(isValidElement(element)).toBe(true);
    if (!isValidElement(element)) throw new Error('Expected /concept/atlas to have a React element');

    expect(element.type).toBe(AtlasConcept);
    expect(element.type).not.toBe(Navigate);
  });
});

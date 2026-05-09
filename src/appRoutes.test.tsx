import { createElement, isValidElement } from 'react';
import { MemoryRouter, Navigate, type RouteObject } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { appRoutes, atlasRouteElement } from './appRoutes';
import { AtlasRoute, AtlasRouteFallback } from './pages/AtlasRoute';

function childRoute(path: string): RouteObject | undefined {
  return appRoutes[0]?.children?.find((route) => route.path === path);
}

function indexRoute(): RouteObject | undefined {
  return appRoutes[0]?.children?.find((route) => route.index);
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

  it('renders the same Atlas route element at / and /concept/atlas', () => {
    const rootRoute = indexRoute();
    const atlasRoute = childRoute('concept/atlas');

    expect(rootRoute?.element).toBe(atlasRouteElement);
    expect(atlasRoute?.element).toBe(atlasRouteElement);
    expect(rootRoute?.element).toBe(atlasRoute?.element);
    expect(isValidElement(atlasRouteElement)).toBe(true);
    if (!isValidElement(atlasRouteElement)) throw new Error('Expected shared Atlas route to have a React element');

    expect(atlasRouteElement.type).toBe(AtlasRoute);
    expect(atlasRouteElement.type).not.toBe(Navigate);
  });

  it('keeps /overview as a redirect to the deterministic root atlas', () => {
    const overviewRoute = childRoute('overview');
    const element = overviewRoute?.element;

    expect(isValidElement(element)).toBe(true);
    if (!isValidElement<{ to: string; replace: boolean }>(element)) throw new Error('Expected /overview to have a React element');

    expect(element.type).toBe(Navigate);
    expect(element.props.to).toBe('/');
    expect(element.props.replace).toBe(true);
  });

  it('renders an atlas-styled fallback for route chunk failures', () => {
    const html = renderToStaticMarkup(
      createElement(MemoryRouter, null, createElement(AtlasRouteFallback, { reason: 'atlas route failed to load' })),
    );

    expect(html).toContain('The AI Supply Chain Atlas');
    expect(html).toContain('data-atlas-render-mode="page-fallback"');
    expect(html).toContain('data-atlas-fallback-reason="atlas route failed to load"');
    expect(html.match(/data-atlas-render-mode=/g)?.length).toBe(1);
    expect(html).not.toContain('The AI Supply Chain, Explained');
    expect(html).not.toContain('Loading atlas...');
  });
});

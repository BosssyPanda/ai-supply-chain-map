import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Overview } from './Overview';

describe('Overview', () => {
  it('uses the Atlas experience instead of the legacy report overview', () => {
    const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Overview)));

    expect(html).toContain('The AI Supply Chain Atlas');
    expect(html).toContain('data-atlas-render-mode="page-fallback"');
    expect(html).not.toContain('The AI Supply Chain, Explained');
    expect(html).not.toContain('Loading atlas...');
  });
});

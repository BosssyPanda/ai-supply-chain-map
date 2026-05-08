import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { TopNav } from './TopNav';

describe('TopNav', () => {
  it('keeps Overview as the atlas-styled primary route without a separate Atlas tab', () => {
    const html = renderToStaticMarkup(
      createElement(MemoryRouter, null, createElement(TopNav, { variant: 'atlas' })),
    );

    expect(html).toContain('Overview');
    expect(html).toContain('href="/"');
    expect(html).toContain('Supply Chain');
    expect(html).toContain('Companies');
    expect(html).not.toContain('>Atlas<');
    expect(html).not.toContain('href="/concept/atlas"');
  });
});

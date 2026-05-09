import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { loadExplorerData } from '../../data/loaders';
import { CanvasFallback } from './AtlasCanvas';
import { AtlasFallback } from './AtlasFallback';
import { getFallbackMarkerPosition } from './AtlasFallback';
import { AtlasConceptPage, atlasDesktopViewportQuery, shouldRenderDesktopAtlas } from './AtlasConceptPage';
import { shouldRevealFloatingCardDetails } from './AtlasFloatingCard';
import { getAtlasScrollState } from './AtlasScrollController';
import { getAtlasInsight, getAtlasStages } from './atlasStages';

describe('atlasStages', () => {
  it('adapts the real overview stages into the five atlas stages', () => {
    const stages = getAtlasStages(loadExplorerData());

    expect(stages.map((stage) => stage.title)).toEqual([
      'Models & Cloud',
      'Compute & Chips',
      'Data Centers & Networking',
      'Power & Cooling',
      'Materials & Minerals',
    ]);
    expect(stages.every((stage, index) => stage.step === String(index + 1).padStart(2, '0'))).toBe(true);
    expect(stages.every((stage) => stage.description && stage.href.startsWith('/supply-chain?focus='))).toBe(true);
    expect(stages.every((stage) => stage.scene.position.length === 3 && stage.scene.camera.length === 3)).toBe(true);
    expect(stages.every((stage) => stage.mappedExamples.length <= 2)).toBe(true);
  });

  it('uses source-backed insight data without inventing fallback numbers', () => {
    const insight = getAtlasInsight(loadExplorerData());

    expect(insight.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$|Data pending - source needed/);
    expect(insight.summary).toContain('source rows');
    expect(insight.summary).toContain('Data pending - source needed');
    expect(insight.summary).not.toContain('Data pending — source needed');
  });

  it('renders the desktop atlas only for large non-reduced-motion viewports', () => {
    expect(atlasDesktopViewportQuery).toBe('(min-width: 1280px)');
    expect(shouldRenderDesktopAtlas({ isLargeViewport: true, prefersReducedMotion: false })).toBe(true);
    expect(shouldRenderDesktopAtlas({ isLargeViewport: false, prefersReducedMotion: false })).toBe(false);
    expect(shouldRenderDesktopAtlas({ isLargeViewport: true, prefersReducedMotion: true })).toBe(false);
  });

  it('reveals floating card details on scroll focus, hover, or keyboard focus', () => {
    expect(shouldRevealFloatingCardDetails({ isActive: true, isHovered: false, isFocused: false, isHandoff: false })).toBe(true);
    expect(shouldRevealFloatingCardDetails({ isActive: false, isHovered: true, isFocused: false, isHandoff: false })).toBe(true);
    expect(shouldRevealFloatingCardDetails({ isActive: false, isHovered: false, isFocused: true, isHandoff: false })).toBe(true);
    expect(shouldRevealFloatingCardDetails({ isActive: true, isHovered: true, isFocused: true, isHandoff: true })).toBe(false);
  });

  it('keeps fallback preview markers inside narrow mobile bounds', () => {
    const positions = Array.from({ length: 5 }, (_, index) => getFallbackMarkerPosition(index, 5));

    expect(positions.map((position) => position.leftPercent)).toEqual([14, 32, 50, 68, 86]);
    expect(positions.every((position) => position.leftPercent >= 14 && position.leftPercent <= 86)).toBe(true);
  });

  it('maps scroll progress to the intended atlas focus states', () => {
    const stages = getAtlasStages(loadExplorerData());

    expect(getAtlasScrollState(0, stages).activeStage?.title ?? null).toBeNull();
    expect(getAtlasScrollState(0.2, stages).activeStage?.title).toBe('Models & Cloud');
    expect(getAtlasScrollState(0.4, stages).activeStage?.title).toBe('Compute & Chips');
    expect(getAtlasScrollState(0.6, stages).activeStage?.title).toBe('Data Centers & Networking');
    expect(getAtlasScrollState(0.8, stages).activeStage?.title).toBe('Power & Cooling');
    expect(getAtlasScrollState(0.88, stages).activeStage?.title).toBe('Materials & Minerals');
    expect(getAtlasScrollState(1, stages).activeStage?.title ?? null).toBeNull();
    expect(getAtlasScrollState(1, stages).isHandoff).toBe(true);
    expect(getAtlasScrollState(-0.2, stages).progress).toBe(0);
    expect(getAtlasScrollState(1.2, stages).progress).toBe(1);
  });

  it('renders the reduced-motion fallback with the five real stage labels and one primary CTA', () => {
    const stages = getAtlasStages(loadExplorerData());
    const html = renderToStaticMarkup(
      createElement(MemoryRouter, null, createElement(AtlasFallback, { stages, reducedMotion: true })),
    );

    for (const stage of stages) {
      expect(html).toContain(stage.title.replace(/&/g, '&amp;'));
    }
    expect(html).toContain('A static atlas view is shown because reduced motion is enabled.');
    expect(html).toContain('data-atlas-render-mode="page-fallback"');
    expect(html).toContain('data-atlas-fallback-reason="reduced motion enabled"');
    expect(html).toContain('data-atlas-progress-rail="fallback"');
    expect(html.match(/Explore the Atlas/g)?.length).toBe(1);
    expect(html).not.toContain('radial-gradient');
    expect(html).not.toContain('rounded-[50%]');
  });

  it('renders the page fallback with one authoritative render-mode marker and custom reasons', () => {
    const stages = getAtlasStages(loadExplorerData());
    const html = renderToStaticMarkup(
      createElement(MemoryRouter, null, createElement(AtlasFallback, { stages, fallbackReason: 'atlas route failed to load' })),
    );

    expect(html.match(/data-atlas-render-mode=/g)?.length).toBe(1);
    expect(html).toContain('data-atlas-render-mode="page-fallback"');
    expect(html).toContain('data-atlas-fallback-reason="atlas route failed to load"');
  });

  it('does not duplicate render-mode markers in the full page fallback path', () => {
    const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(AtlasConceptPage)));

    expect(html.match(/data-atlas-render-mode=/g)?.length).toBe(1);
    expect(html).toContain('data-atlas-render-mode="page-fallback"');
  });

  it('renders the WebGL canvas fallback as an atlas stage preview instead of a radial diagram', () => {
    const stages = getAtlasStages(loadExplorerData());
    const html = renderToStaticMarkup(createElement(CanvasFallback, { stages, reason: 'WebGL unavailable' }));

    expect(html).toContain('data-atlas-render-mode="canvas-fallback"');
    expect(html).toContain('Static atlas preview with five supply-chain stages');
    expect(html).toContain('01 Models &amp; Cloud');
    expect(html).not.toContain('radial-gradient');
    expect(html).not.toContain('rounded-[50%]');
  });
});

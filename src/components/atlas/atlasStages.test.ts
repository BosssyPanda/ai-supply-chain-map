import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { loadExplorerData } from '../../data/loaders';
import { AtlasFallback } from './AtlasFallback';
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

    expect(insight.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$|Data pending — source needed/);
    expect(insight.summary).toContain('source rows');
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
    expect(html.match(/Open current graph/g)?.length).toBe(1);
  });
});

import { describe, expect, it } from 'vitest';
import { ensureAppBuildMarker, formatBuildMarker, type AppBuildInfo } from './buildInfo';

const buildInfo: AppBuildInfo = {
  version: '0.2.0',
  buildId: 'test-build',
  builtAt: '2026-05-09T07:00:00.000Z',
  commit: 'abcdef1234567890',
  deploymentId: 'dpl_test_123',
  environment: 'test',
};

describe('buildInfo', () => {
  it('formats the hidden build marker deterministically', () => {
    expect(formatBuildMarker(buildInfo)).toBe('0.2.0:test-build:2026-05-09T07:00:00.000Z');
  });

  it('adds a hidden meta marker and document dataset fields', () => {
    const appendedNodes: Array<{ name: string; content: string }> = [];
    const documentRef = {
      documentElement: { dataset: {} as Record<string, string> },
      querySelector: () => null,
      createElement: () => ({ name: '', content: '' }),
      head: {
        appendChild: (node: { name: string; content: string }) => appendedNodes.push(node),
      },
    } as unknown as Document;

    ensureAppBuildMarker(documentRef, buildInfo);

    expect(documentRef.documentElement.dataset.appBuildId).toBe('test-build');
    expect(documentRef.documentElement.dataset.appBuildAt).toBe('2026-05-09T07:00:00.000Z');
    expect(documentRef.documentElement.dataset.appVersion).toBe('0.2.0');
    expect(documentRef.documentElement.dataset.appCommit).toBe('abcdef1234567890');
    expect(documentRef.documentElement.dataset.appDeploymentId).toBe('dpl_test_123');
    expect(documentRef.documentElement.dataset.appEnvironment).toBe('test');
    expect(appendedNodes).toEqual([
      {
        name: 'ai-supply-chain-build',
        content: '0.2.0:test-build:2026-05-09T07:00:00.000Z',
      },
    ]);
  });
});

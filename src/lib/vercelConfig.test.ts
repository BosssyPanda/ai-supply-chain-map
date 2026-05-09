import { describe, expect, it } from 'vitest';
import vercelConfig from '../../vercel.json';

function headerValue(source: string, key: string): string | undefined {
  return vercelConfig.headers
    .find((entry) => entry.source === source)
    ?.headers.find((header) => header.key.toLowerCase() === key.toLowerCase())?.value;
}

describe('vercel cache headers', () => {
  it('keeps atlas HTML and tombstone workers uncached while preserving immutable hashed assets', () => {
    expect(headerValue('/', 'Cache-Control')).toContain('no-store');
    expect(headerValue('/concept/atlas', 'Cache-Control')).toContain('no-store');
    expect(headerValue('/service-worker.js', 'Cache-Control')).toContain('no-store');
    expect(headerValue('/sw.js', 'Cache-Control')).toContain('no-store');
    expect(headerValue('/assets/(.*)', 'Cache-Control')).toBe('public, max-age=31536000, immutable');
  });
});

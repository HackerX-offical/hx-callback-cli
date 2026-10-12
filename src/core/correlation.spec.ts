import { newCorrelationPath } from './correlation.js';

describe('newCorrelationPath', () => {
  it('returns unique paths', () => {
    const s = new Set<string>();
    const a = newCorrelationPath(s);
    const b = newCorrelationPath(s);
    expect(a).not.toBe(b);
    expect(a.startsWith('/hx/')).toBe(true);
  });
});

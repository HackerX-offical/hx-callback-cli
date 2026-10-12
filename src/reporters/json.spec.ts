import { hitsToJson } from './json.js';

describe('hitsToJson', () => {
  it('serializes', () => {
    const j = JSON.parse(hitsToJson([], { http: 0, dns: 0, total: 0 }));
    expect(j.summary.total).toBe(0);
  });
});

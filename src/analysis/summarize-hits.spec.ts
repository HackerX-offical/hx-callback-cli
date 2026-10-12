import { summarizeHits } from './summarize-hits.js';

describe('summarizeHits', () => {
  it('counts channels', () => {
    const s = summarizeHits([
      { id: '1', channel: 'http', time: 't' },
      { id: '2', channel: 'dns', time: 't' },
    ]);
    expect(s.total).toBe(2);
    expect(s.http).toBe(1);
  });
});

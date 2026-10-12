import { startCallbackServer } from '../src/server.js';

describe('callback server', () => {
  it('records http hit', async () => {
    const srv = await startCallbackServer(0, 18853, '127.0.0.1');
    await fetch(`${srv.baseUrl}/probe-test`);
    await new Promise((r) => setTimeout(r, 300));
    expect(srv.hits.some((h) => h.channel === 'http')).toBe(true);
    await srv.stop();
  }, 15000);
});

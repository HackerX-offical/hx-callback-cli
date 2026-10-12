import { recordHttpHit } from './record-hit.js';
import { EventEmitter } from 'node:events';

describe('recordHttpHit', () => {
  it('pushes hit', () => {
    const hits: import('../types.js').HitLog[] = [];
    const req = new EventEmitter() as import('node:http').IncomingMessage;
    Object.assign(req, {
      method: 'GET',
      url: '/x',
      headers: {},
      socket: { remoteAddress: '1.2.3.4' },
    });
    recordHttpHit(hits, req, 'body');
    expect(hits).toHaveLength(1);
  });
});

import { randomUUID } from 'node:crypto';
import type { HitLog } from '../types.js';

export function recordDnsHit(hits: HitLog[], remote: string, msg: Buffer): void {
  hits.push({
    id: randomUUID(),
    channel: 'dns',
    time: new Date().toISOString(),
    remote,
    query: msg.toString('hex').slice(0, 256),
  });
}

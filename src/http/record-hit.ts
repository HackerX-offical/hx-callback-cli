import { randomUUID } from 'node:crypto';
import type { HitLog } from '../types.js';
import { headersToRecord } from '../utils/headers-to-record.js';
import { truncateBody } from '../utils/truncate-body.js';
import type { IncomingMessage } from 'node:http';

export function recordHttpHit(hits: HitLog[], req: IncomingMessage, body: string): string {
  const id = randomUUID();
  hits.push({
    id,
    channel: 'http',
    time: new Date().toISOString(),
    remote: req.socket.remoteAddress,
    method: req.method,
    path: req.url,
    headers: headersToRecord(req.headers),
    bodyPreview: truncateBody(body),
  });
  return id;
}

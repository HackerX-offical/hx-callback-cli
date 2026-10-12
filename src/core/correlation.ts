import { randomUUID } from 'node:crypto';

export function newCorrelationPath(ids: Set<string>): string {
  const cid = randomUUID().slice(0, 8);
  ids.add(cid);
  return `/hx/${cid}`;
}

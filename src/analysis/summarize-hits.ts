import type { HitLog } from '../types.js';

export function summarizeHits(hits: HitLog[]) {
  const http = hits.filter((h) => h.channel === 'http').length;
  const dns = hits.filter((h) => h.channel === 'dns').length;
  return { http, dns, total: hits.length };
}

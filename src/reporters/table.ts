import type { HitLog } from '../types.js';

export function formatHitLine(h: HitLog): string {
  return `[${h.channel}] ${h.time} ${h.method ?? ''} ${h.path ?? h.query ?? ''}`.trim();
}

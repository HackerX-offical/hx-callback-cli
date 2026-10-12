import type { HitLog } from '../types.js';
import type { summarizeHits } from '../analysis/summarize-hits.js';

export function hitsToJson(hits: HitLog[], summary: ReturnType<typeof summarizeHits>): string {
  return JSON.stringify({ summary, hits }, null, 2);
}

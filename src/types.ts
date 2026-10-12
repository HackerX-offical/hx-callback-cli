export interface HitLog {
  id: string;
  channel: 'http' | 'dns';
  time: string;
  remote?: string;
  method?: string;
  path?: string;
  headers?: Record<string, string>;
  query?: string;
  bodyPreview?: string;
}

export interface CallbackServer {
  httpPort: number;
  dnsPort: number;
  baseUrl: string;
  hits: HitLog[];
  stop: () => Promise<void>;
  newCorrelationPath: () => string;
}

import http from 'node:http';
import { randomUUID } from 'node:crypto';
import dgram from 'node:dgram';

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

export async function startCallbackServer(
  httpPort = 8848,
  dnsPort = 8853,
  bindHost = '0.0.0.0',
): Promise<CallbackServer> {
  const hits: HitLog[] = [];
  const correlationIds = new Set<string>();

  const server = http.createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8').slice(0, 2048);
      const headers: Record<string, string> = {};
      for (const [k, v] of Object.entries(req.headers)) {
        if (typeof v === 'string') headers[k] = v;
      }
      const id = randomUUID();
      hits.push({
        id,
        channel: 'http',
        time: new Date().toISOString(),
        remote: req.socket.remoteAddress,
        method: req.method,
        path: req.url,
        headers,
        bodyPreview: body,
      });
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`hx-callback ok ${id}\n`);
    });
  });

  await new Promise<void>((resolve) => server.listen(httpPort, bindHost, resolve));
  const addr = server.address();
  const actualHttpPort = typeof addr === 'object' && addr ? addr.port : httpPort;

  const dns = dgram.createSocket('udp4');
  dns.on('message', (msg, rinfo) => {
    hits.push({
      id: randomUUID(),
      channel: 'dns',
      time: new Date().toISOString(),
      remote: `${rinfo.address}:${rinfo.port}`,
      query: msg.toString('hex').slice(0, 256),
    });
  });
  await new Promise<void>((resolve, reject) => {
    dns.once('error', reject);
    dns.bind(dnsPort, bindHost, () => resolve());
  });

  return {
    httpPort: actualHttpPort,
    dnsPort,
    baseUrl: `http://127.0.0.1:${actualHttpPort}`,
    hits,
    newCorrelationPath() {
      const cid = randomUUID().slice(0, 8);
      correlationIds.add(cid);
      return `/hx/${cid}`;
    },
    stop: async () => {
      await new Promise<void>((r) => server.close(() => r()));
      await new Promise<void>((r) => dns.close(() => r()));
    },
  };
}

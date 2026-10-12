import http from 'node:http';
import dgram from 'node:dgram';
import type { CallbackServer, HitLog } from '../types.js';
import { newCorrelationPath } from './correlation.js';
import { recordHttpHit } from '../http/record-hit.js';
import { recordDnsHit } from '../dns/record-dns-hit.js';

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
      const body = Buffer.concat(chunks).toString('utf8');
      const id = recordHttpHit(hits, req, body);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`hx-callback ok ${id}\n`);
    });
  });

  await new Promise<void>((resolve) => server.listen(httpPort, bindHost, resolve));
  const addr = server.address();
  const actualHttpPort = typeof addr === 'object' && addr ? addr.port : httpPort;

  const dns = dgram.createSocket('udp4');
  dns.on('message', (msg, rinfo) => {
    recordDnsHit(hits, `${rinfo.address}:${rinfo.port}`, msg);
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
      return newCorrelationPath(correlationIds);
    },
    stop: async () => {
      await new Promise<void>((r) => server.close(() => r()));
      await new Promise<void>((r) => dns.close(() => r()));
    },
  };
}

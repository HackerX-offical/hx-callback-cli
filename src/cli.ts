#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { startCallbackServer } from './server.js';

const program = new Command();
program.name('hx-callback').description('OOB callback correlation server').version('1.0.0');

program
  .command('listen')
  .description('Start HTTP + DNS listeners and stream hits to the terminal')
  .option('-p, --http-port <n>', 'HTTP port', '8848')
  .option('--dns-port <n>', 'DNS UDP port', '8853')
  .action(async (opts: { httpPort: string; dnsPort: string }) => {
    const srv = await startCallbackServer(Number(opts.httpPort), Number(opts.dnsPort));
    console.log(chalk.green(`HTTP  ${srv.baseUrl}`));
    console.log(chalk.green(`DNS   UDP :${srv.dnsPort} (hex query logged)`));
    console.log(chalk.dim('Generate path:'), srv.newCorrelationPath());

    setInterval(() => {
      while (srv.hits.length) {
        const h = srv.hits.shift()!;
        console.log(chalk.bold(`[${h.channel}] ${h.time}`), h.method, h.path ?? h.query);
        if (h.bodyPreview) console.log(chalk.dim(h.bodyPreview.slice(0, 200)));
      }
    }, 500);

    process.on('SIGINT', async () => {
      await srv.stop();
      process.exit(0);
    });
  });

program.parse();

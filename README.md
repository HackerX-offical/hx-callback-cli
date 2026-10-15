# hx-callback-cli

**Out-of-band (OOB) HTTP and DNS correlation server** for blind SSRF, XXE, and
deserialization proof during authorized tests.

## Why this exists

Blind vulnerabilities need a collaborator you control. Instead of ad-hoc `nc` listeners,
this CLI runs correlated HTTP paths and DNS queries so each payload gets a unique token
you can match to the finding in your report.

## Features

- Combined HTTP listener and DNS UDP logger on configurable ports
- Per-hit correlation IDs in URL paths
- Streams request method, path, headers, and body preview to the terminal
- Graceful shutdown on SIGINT

## Install

```bash
git clone https://github.com/HackerX-official/hx-callback-cli.git
cd hx-callback-cli
npm install
npm run build
npm link   # optional: global hx-callback
```

## Quick start

```bash
hx-callback listen
hx-callback listen -p 8848 --dns-port 8853
```

Use the printed base URL and `newCorrelationPath()`-style paths in your payloads.

## Output

| Channel | What you see                                                        |
| ------- | ------------------------------------------------------------------- |
| HTTP    | `[http]` timestamp, method, path, optional body preview (truncated) |
| DNS     | `[dns]` timestamp, encoded query label                              |

Hits are drained to stdout every 500ms while the process runs.

## Develop

```bash
npm run format
npm run build
npm test
npm run format:check
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for module layout and extension points.

## Ethics

Use only on systems and content you are **authorized** to test. See
[SECURITY.md](./SECURITY.md).

## License

Licensed under the [HackerX License](./LICENSE). Redistributions must retain copyright,
license text, and [NOTICE](./NOTICE) attribution per the license terms.

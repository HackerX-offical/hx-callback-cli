# hx-callback-cli architecture

OOB HTTP/DNS callback correlation server for authorized assessments.

## Layout

```
src/
  cli.ts
  server.ts              # Re-exports
  types.ts
  core/                  # start server, correlation paths
  http/ dns/             # Hit recording
  analysis/ summarize-hits
  reporters/
  utils/
```

```bash
npm install && npm run build && npm test
```

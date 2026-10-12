# hx-callback-cli

**Out-of-band correlation** for blind SSRF/XXE/RCE chains. Local HTTP listener logs full
requests; UDP DNS socket logs query payloads for hex inspection.

```bash
hx-callback listen -p 8848
# inject http://YOUR_IP:8848/hx/<id> in payloads
```

Use only on engagements where OOB testing is authorized. MIT — HackerX Official

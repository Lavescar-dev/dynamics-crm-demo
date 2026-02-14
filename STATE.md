# STATE — Vertex (Dynamics CRM Demo)
Date: 2026-02-04 (UTC snapshot)

Status: `DEGRADED`

Public URL: `https://vertex.lavescar.com.tr`  
Origin URL (resolve): `curl -I --resolve vertex.lavescar.com.tr:443:91.99.192.155 https://vertex.lavescar.com.tr`

Current Deploy:
- Symlink: `/var/www/lavescar/demos/vertex/current -> /var/www/lavescar/demos/vertex/releases/20260204_071957`
- Runtime model: static via nginx
- Active Port: `443` (nginx)

Evidence (commands + observed result):
- `curl -I https://vertex.lavescar.com.tr` -> `HTTP/2 200`, `content-type: text/html`, `cache-control: no-store...`, `cf-cache-status: DYNAMIC`, `x-robots-tag: noindex...`
- `curl -I --resolve vertex.lavescar.com.tr:443:91.99.192.155 https://vertex.lavescar.com.tr` -> `HTTP/2 200`, `server: nginx`
- Asset cache probe:
  - `curl -I https://vertex.lavescar.com.tr/_app/immutable/entry/start.Bz8uaY-l.js`
  - Result: `cache-control: public, max-age=31536000, immutable`
- `/api` behavior probe:
  - `curl -I https://vertex.lavescar.com.tr/api/health` -> `200 text/html` (SPA fallback)
- Nginx vhost proof:
  - `nginx -T | grep -nE 'server_name (vertex)\\.lavescar\\.com\\.tr'`
  - `/etc/nginx/sites-available/vertex.lavescar.com.tr` satır `13-14`: cache+spa include

Known Issues:
1. `/api/*` static fallback nedeniyle yanlış pozitif health sonucu verebilir.  
   Evidence: `curl -I https://vertex.lavescar.com.tr/api/health`
2. Runtime/browser smoke (console uncaught, network 404) kanıtı eksik.  
   Evidence gap: DevTools capture yok.
3. `x-demo-mode` header standardizasyonu yok (Nexus ile tutarsız).  
   Evidence: `curl -I https://vertex.lavescar.com.tr`

Next Actions:
- `IMPLEMENTATION.md` §2.1 (`/api` guard)
- `IMPLEMENTATION.md` §2.2 (browser smoke + route audit)
- `IMPLEMENTATION.md` §3 (UX reliability polish)

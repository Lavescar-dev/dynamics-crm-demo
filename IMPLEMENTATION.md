# IMPLEMENTATION — Vertex (Execution-Ready)
Date: 2026-02-04

## 1) Problem List (Evidence)

1. `/api/*` static fallback ile maskeleniyor.
- Evidence: `curl -I https://vertex.lavescar.com.tr/api/health` => `200 text/html`.
- Hypothesis: no explicit `/api` guard; `try_files` fallback route’u cevaplıyor.

2. Browser smoke matrisi eksik.
- Evidence: yalnızca CLI smoke mevcut (public/origin/status/header).
- Hypothesis: JS runtime regresyonları gözden kaçabilir.

3. Type-check borcu yüksek olabilir.
- Evidence: local `svelte-check` denemelerinde geniş hata çıktıları (özellikle UI lib typings).
- Hypothesis: demo çalışıyor olsa da maintainability düşüyor.

## 2) Fix Plan (Smallest Safe Steps)

### 2.1 Nginx `/api` guard
- Files:
  - `/etc/nginx/sites-available/vertex.lavescar.com.tr`
- Change type: config
- Change:
  - `location ^~ /api/ { return 404; }` (veya explicit json-not-supported).
- Risk: low
- Rollback:
  - Vhost revert + `nginx -t && systemctl reload nginx`.

### 2.2 Browser smoke contract
- Files:
  - `demos/dynamics-crm-demo/src/routes/+layout.svelte`
  - `demos/dynamics-crm-demo/src/routes/dashboard/sales/+page.svelte`
- Change type: test/procedural (no forced code change)
- Change:
  - DevTools test scripti: console error, 404 network, route refresh checks.
- Risk: low
- Rollback: N/A (test-only).

### 2.3 Type-check debt reduction (targeted)
- Files:
  - `demos/dynamics-crm-demo/package.json`
  - Failing component files from check output (targeted only)
- Change type: code/config
- Change:
  - Önce blocking TS hataları (runtime riskli olanlar), sonra cosmetic.
- Risk: medium
- Rollback: commit-by-commit revert.

## 3) UI/UX Value Plan (0-bloat)

1. Empty-state microcopy:
- File: `demos/dynamics-crm-demo/src/routes/dashboard/service/+page.svelte`
- Add: "This is synthetic demo data" ve next action ipucu.

2. Error boundary copy:
- File: `demos/dynamics-crm-demo/src/routes/sales/accounts/+page.svelte`
- Add: fetch error panel + retry button.

3. Loading consistency:
- File: `demos/dynamics-crm-demo/src/routes/sales/opportunities/+page.svelte`
- Add: route-level skeleton loader.

## 4) DoD

1. Public root `200`.
2. SPA refresh `200` (non-root paths dahil).
3. `/api/*` istekleri explicit behavior veriyor (fallback HTML değil).
4. DevTools console uncaught error yok.
5. Cloudflare Dev Mode OFF iken davranış stabil.

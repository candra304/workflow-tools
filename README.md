# Workflow Tools — Monorepo

Katalog tools React premium + Pattern Picker + Stack Generator + Referensi per Niche
(**Workflow Tools**) dan galeri hasil kerja Muse agent (**Muse Demo Hub**), dalam
satu monorepo yang mudah di-update.

> Ini adalah hasil restruktur dari dua file HTML tunggal
> (`workflow-tools.html` 93KB dan `muse-demo-hub.html` 43KB).
> **Isi, fitur, dan tema tidak berubah** — yang berubah hanya strukturnya:
> data pindah ke JSON, logika pindah ke `lib/`, tampilan pindah ke komponen
> per file. Tema per niche dipertahankan persis seperti v2
> (Finance navy + emas, Portfolio editorial, Luxury beige + emas,
> Pendidikan biru + putih, SaaS indigo) — **bukan** hitam pekat + hijau limau.

## Kenapa Vite + React, bukan Next.js?

Kedua app ini **client-only**: tidak ada SSR, tidak ada backend, tidak butuh
SEO server-side. Yang dibutuhkan hanyalah file statis yang bisa disajikan
GitHub Pages apa adanya.

| | Vite + React (dipakai di sini) | Next.js |
|---|---|---|
| Output | `dist/` statis, langsung tayang di GitHub Pages | Perlu `output: "export"` + config tambahan |
| Build | Ringan & cepat (±1 detik per app) | Lebih berat (Node server, routing, SSR) |
| Cocok untuk | Katalog & galeri interaktif seperti ini | App multi-halaman yang butuh SSR/SEO |

Keputusan: **Vite + React + TypeScript**. Kalau nanti ada kebutuhan SSR/SEO
atau backend, app bisa dipindah ke Next.js tanpa mengubah data
(`packages/data/*.json` tetap sama).

## Struktur

```
workflow-tools-proper/
├── README.md                  # file ini
├── package.json               # workspaces + script root (dev/build)
├── docs/
│   └── STRUCTURE.md           # diagram + cara nambah tool / niche / demo
├── apps/
│   ├── workflow-tools/        # App 1: katalog + Pattern Picker + Stack Generator
│   │   └── src/
│   │       ├── app/App.tsx        # komposisi halaman + state
│   │       ├── components/        # Hero, PatternPicker, StackGenerator,
│   │       │                      # Catalog, CatalogCard, NicheSection, PatatapPads
│   │       ├── lib/               # stack.ts (conflict check + npm install +
│   │       │                      # checklist), filters.ts, audio.ts (WebAudio)
│   │       └── styles/app.css     # gaya app (tema di packages/ui/theme.css)
│   └── demo-hub/              # App 2: galeri 8 demo
│       └── src/
│           ├── app/App.tsx
│           ├── components/        # Hero, Toolbar, DemoCard, Sections
│           │                      # (ThemeLegend, LanguageGrid, HowItWorks), Modals
│           ├── lib/               # filter.ts (cari/urut), thumb.tsx (miniatur)
│           └── styles/app.css
├── packages/
│   ├── data/                  # ★ SATU-SATUNYA SUMBER DATA (JSON + tipe TS)
│   │   ├── tools.json         # 42 kartu: 28 tools + 14 referensi live
│   │   ├── patterns.json      # 4 pola + 8 kategori + tema kategori + nama pola
│   │   ├── niches.json        # 5 niche, 43 item (E-Commerce 8 sub-model)
│   │   ├── demos.json         # 8 demo Demo Hub
│   │   ├── languages.json     # 10 bahasa/stack + filter Demo Hub
│   │   ├── themes.json        # legenda tema per niche (kedua app)
│   │   └── src/index.ts       # tipe + export; apps import dari sini
│   └── ui/                    # komponen + tema dipakai bareng kedua app
│       ├── src/theme.css      # sistem tema --ta (pola/niche/sub-grup)
│       ├── src/tokens.ts      # peta tema + helper themeStyle/demoThemeStyle
│       └── src/components/    # Toast, Chip, NicheBadge
│           └── useClipboard.ts
└── .gitignore
```

**Aturan utama:** apps **tidak boleh** hardcode daftar 42 tools / niche / demo
di dalam komponen — semua dibaca dari `@workflow-tools/data`. Tema tinggal di
`@workflow-tools/ui` (`theme.css` + `tokens.ts`), bukan hardcode warna di
komponen. Buktinya: `grep` nama tool/demo di `apps/*/src` menghasilkan nol
(lihat `docs/STRUCTURE.md`).

## Cara jalan lokal

```bash
npm install          # sekali, dari root — install semua workspace
npm run dev:workflow-tools   # http://localhost:5173
npm run dev:demo-hub         # http://localhost:5174 (jalankan di terminal lain)
```

## Cara build (terverifikasi)

```bash
npm run build        # build kedua app; hasil di apps/*/dist/
```

Tiap app juga bisa di-build sendiri: `npm run build:workflow-tools`,
`npm run build:demo-hub`. Preview hasil build:
`npm run preview:workflow-tools` / `npm run preview:demo-hub`.

## Deploy ke GitHub Pages

Repo tujuan: `candra304/workflow-tools` (branch `main`).

- Isi `apps/workflow-tools/dist/` → root repo (`index.html` dkk).
- Isi `apps/demo-hub/dist/` → folder `demo-hub/` di repo yang sama.
- Aktifkan Pages: repo **Settings → Pages → Deploy from branch `main` → `/ (root)**.
- Live: `https://candra304.github.io/workflow-tools/` dan
  `https://candra304.github.io/workflow-tools/demo-hub/`.

## Cara update (ringkas)

- **Nambah tool baru:** tambah 1 objek ke `packages/data/tools.json` — selesai.
  Tidak perlu sentuh komponen. Lihat `docs/STRUCTURE.md`.
- **Nambah niche / demo baru:** sama — tambah ke `niches.json` / `demos.json`.
- **Ubah tema niche:** edit `packages/ui/src/theme.css` + `tokens.ts` sekali,
  kedua app ikut berubah.

## Yang TIDAK ada di repo ini

Tidak ada folder `contracts/` atau file Solidity — tidak ada blockchain di
proyek ini. Kalau nanti ada fitur Web3 beneran, strukturnya tinggal tambah
`packages/contracts/` tanpa mengubah yang sudah ada.

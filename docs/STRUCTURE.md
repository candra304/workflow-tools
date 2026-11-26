# Struktur Monorepo — Diagram & Cara Update

## Diagram

```
workflow-tools-proper/
├── package.json            # npm workspaces: apps/* + packages/*
├── README.md               # ringkasan + cara run/build/deploy
├── docs/STRUCTURE.md       # file ini
├── apps/
│   ├── workflow-tools/     # Vite + React + TS — katalog & generator
│   │   ├── index.html          # root HTML (font Archivo + JetBrains Mono)
│   │   ├── vite.config.ts      # base './' (aman di GitHub Pages)
│   │   ├── package.json        # deps: react, vite, @workflow-tools/*
│   │   └── src/
│   │       ├── main.tsx        # import theme.css + app.css + App
│   │       ├── app/App.tsx     # state: stack, pola, filter, checklist, toast
│   │       ├── components/
│   │       │   ├── Hero.tsx            # statistik (dihitung dari data)
│   │       │   ├── PatatapPads.tsx     # demo mini WebAudio (A S D F J K L ;)
│   │       │   ├── PatternPicker.tsx   # 4 kartu pola + animasi per pola
│   │       │   ├── StackGenerator.tsx  # chips + npm install + checklist
│   │       │   ├── Catalog.tsx         # filter + grid (42 kartu)
│   │       │   ├── CatalogCard.tsx     # 1 kartu + detail + +Stack + salin
│   │       │   └── NicheSection.tsx    # legenda tema + blok niche + sorting
│   │       ├── lib/
│   │       │   ├── stack.ts    # conflicts() / buildCommand() / buildChecklist()
│   │       │   ├── filters.ts  # filterTools() / sortNicheItems()
│   │       │   └── audio.ts    # PAD_NOTES + playNote() (WebAudio)
│   │       └── styles/app.css  # gaya app (tema di packages/ui/theme.css)
│   └── demo-hub/           # Vite + React + TS — galeri demo
│       ├── index.html          # root HTML (font Plus Jakarta Sans + JetBrains Mono)
│       ├── vite.config.ts
│       ├── package.json
│       └── src/
│           ├── main.tsx
│           ├── app/App.tsx     # state: filter, cari, urutan, modal, toast
│           ├── components/
│           │   ├── Hero.tsx        # statistik demo & bahasa (dari data)
│           │   ├── Toolbar.tsx     # cari + urutan + chip filter + hasil
│           │   ├── DemoCard.tsx    # 1 kartu demo + Lihat Demo/Salin Link + hosting & Custom Link
│           │   ├── HostingPicker.tsx # bagian "Pilih Hosting" — 10 hosting gratisan
│           │   ├── Sections.tsx    # ThemeLegend + LanguageGrid + HowItWorks
│           │   └── Modals.tsx      # modal Lihat Demo (preview + info hosting)
│           ├── lib/
│           │   ├── filter.ts   # matchesDemo() / sortDemos() / demoLink()
│           │   ├── hosting.ts  # hosting default/per-demo + Custom Link (localStorage)
│           │   └── thumb.tsx   # ThumbArt — miniatur abstrak per demo
│           └── styles/app.css  # gaya app (tema per demo dari data)
├── packages/
│   ├── data/               # ★ SATU-SATUNYA SUMBER DATA
│   │   ├── tools.json      # 42 tools/referensi (semua field kartu)
│   │   ├── patterns.json   # 4 pola + categories + categoryThemes + patternNames
│   │   ├── niches.json     # 5 niche + 43 item + checkedLabel
│   │   ├── demos.json      # 8 demo (judul, prompt, stack, tema — TANPA kode)
│   │   ├── hostings.json   # 10 hosting gratisan (id, nama, url, catatan gratis)
│   │   ├── languages.json  # 10 bahasa/stack + 9 filter
│   │   ├── themes.json     # legenda tema per niche (2 app)
│   │   └── src/index.ts    # tipe TypeScript + export bernama
│   └── ui/                 # dipakai bareng kedua app
│       ├── src/theme.css   # sistem --ta: tema pola / niche / sub-grup
│       ├── src/tokens.ts   # peta tema + themeStyle() / demoThemeStyle()
│       ├── src/useClipboard.ts
│       └── src/components/ # Toast, Chip, NicheBadge
└── .gitignore
```

Alur data: `packages/data/*.json` → `packages/data/src/index.ts` (tipe) →
`apps/*/src/**` import `@workflow-tools/data`. Tema: `packages/ui/theme.css`
+ `tokens.ts` → kedua app. **Tidak ada arah sebaliknya.**

## Bukti data terpisah dari UI

Jalankan dari root repo:

```bash
# 1. Nama tool tidak boleh muncul sebagai string data di kode aplikasi
#    (hanya di JSON data). Pengecualian sah: nama komponen PatatapPads
#    (nama fitur demo mini, bukan data katalog) dan label grup 3D yang
#    sudah dipindah ke patterns.json -> threeDSetNames.
grep -rE '"(React 19|shadcn/ui|Bruno Simon|Three\.js|GSAP \+ ScrollTrigger|Next\.js 16|Radio Garden|Paper Planes|Patatap|Quick, Draw|Lando Norris|Scout Motors|Bulgari Eclettica|Victor Furuya|Mat Voyce|Deep Sea|NASA Eyes|Awwwards \+ Godly|Ant Design|Mantine|Anime\.js|React Bits|Magic UI|React Three Fiber|SplitType|Lottie|Lucide|Fontshare|Unsplash|Create T3 App|Next\.js Commerce|Next\.js SaaS Starter)"' apps/*/src packages/ui/src || echo "BERSIH: 0 hardcode nama tool di src"

# 2. Nama demo & niche tidak boleh hardcode di kode aplikasi
#    (pengecualian sah: judul app "Muse Demo Hub" di footer/title-nya sendiri)
grep -rE "Stok Harian Kinmart|PropVault|Butik Luxury|Backtest Z-Score|FundedNext|Propanium|Halston|Eduma|Finovate|Muse Motion Studio|Web Review Tool|Web Sekolah" apps/*/src packages/ui/src || echo "BERSIH: 0 hardcode nama demo/niche di src"

# 3. Warna lama v1 (limau/hitam pekat) tidak boleh ada lagi di source
grep -rE "#b9f73d|#060706" apps/*/src packages/*/src packages/data || echo "BERSIH: tidak ada warna lama"
```

## Cara nambah tool baru (3 langkah)

1. Buka `packages/data/tools.json`, tambah 1 objek di akhir array — salin
   bentuk objek lain (wajib: `id`, `name`, `url`, `cat`, `type`, `func`,
   `use`, `avoid`, `weight`, `kb`, `license`, `stars`, `pkg`, `install`,
   `patterns`, `examples`, `alt`; `group` boleh `null`).
   `cat` harus salah satu dari 8 kategori di `patterns.json → categories`;
   `patterns` berisi id pola (`drive`/`scroll`/`config`/`game`).
2. Jalankan `npm run build:workflow-tools` — kalau JSON-nya valid, kartu baru
   langsung muncul di katalog (termasuk di hitungan kategori & filter).
3. Commit & push seperti biasa. **Tidak ada file komponen yang perlu diubah.**

## Cara nambah niche baru (3 langkah)

1. Buka `packages/data/niches.json`, tambah 1 objek ke `niches` — salin bentuk
   niche lain (`id`, `name`, `desc`, `stack`, `groups[]`; tiap group berisi
   `label`, `style`, `stack`, `items[]`).
2. Kalau niche baru butuh tema sendiri, tambah 1 baris di
   `packages/ui/src/theme.css` (`.niche-block[data-niche="id-baru"] {...}`)
   dan 1 entri di `packages/ui/src/tokens.ts` (`NICHE_THEMES`).
   Kalau tidak, pakai tema `lainnya` (indigo) — tidak wajib.
3. `npm run build:workflow-tools`, cek, commit & push.

## Cara nambah demo baru (3 langkah)

1. Buka `packages/data/demos.json`, tambah 1 objek — salin bentuk demo lain
   (`id`, `title`, `date`, `dateLabel`, `status`, `desc`, `prompt`,
   `stacks[]`, `cat`, `theme` `{a, soft, line, tbg, on}`, `thumb`
   salah satu dari `catalog|trading|stock|motion|review|chart`).
   Demo Hub hanya menampilkan demo — JANGAN tambah field kode.
2. `npm run build:demo-hub` — kartu baru langsung muncul, lengkap dengan
   tombol Lihat Demo / Salin Link, pemilih hosting + kolom Custom Link,
   dan ikut terfilter oleh search + chip bahasa (kalau `stacks`-nya
   mengandung bahasa yang ada di `languages.json`).
3. Commit & push.

## Cara ubah tema

- **Tema 1 niche / pola / kategori:** edit `packages/ui/src/theme.css`
  (class/atributnya) dan `packages/ui/src/tokens.ts` (peta yang sama).
  Kedua app ikut berubah karena sama-sama import package ini.
- **Tema 1 demo di Demo Hub:** edit field `theme` demo itu di
  `packages/data/demos.json` — tidak perlu sentuh komponen.

## Catatan pemindahan (asal → tujuan)

| Asal (single-file) | Tujuan (monorepo) |
|---|---|
| `TOOLS` (42 objek di `<script>`) | `packages/data/tools.json` |
| `PATTERNS` + `CATS` + `CAT_THEMES` + `PATTERN_NAMES` | `packages/data/patterns.json` |
| `NICHES` (5 niche, 43 item) + `TF` | `packages/data/niches.json` (key disingkat jadi nama panjang: `n`→`name`, `u`→`url`, dst; `TF` di-inline jadi URL ThemeForest) |
| `DEMOS` (8 demo) | `packages/data/demos.json` |
| `LANGUAGES` + `FILTERS` | `packages/data/languages.json` |
| Legenda tema (6 item × 2 app) | `packages/data/themes.json` |
| `applyTheme` + peta tema CSS | `packages/ui/src/theme.css` + `tokens.ts` |
| `conflicts` / `buildCommand` / `buildChecklist` | `apps/workflow-tools/src/lib/stack.ts` |
| Filter katalog + sort niche | `apps/workflow-tools/src/lib/filters.ts` |
| `matches` / `sorted` / `demoLink` | `apps/demo-hub/src/lib/filter.ts` |
| `thumbHTML()` | `apps/demo-hub/src/lib/thumb.tsx` (`ThumbArt`) |
| `copyText` / toast | `packages/ui/src/useClipboard.ts` + `Toast` |
| Animasi pola (`anim` HTML di data) | `apps/workflow-tools/src/components/PatternPicker.tsx` (`PatternAnim`, dipilih by id) |
| CSS `<style>` Workflow Tools | `apps/workflow-tools/src/styles/app.css` (minus 23 blok tema → `theme.css`) |
| CSS `<style>` Demo Hub | `apps/demo-hub/src/styles/app.css` (verbatim) |

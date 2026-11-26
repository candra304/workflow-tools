# Muse Demo Hub (app)

Galeri hasil kerja Muse agent — 8 demo (Workflow Tools, Prop Simulator, Stok
Harian Kinmart, Muse Motion Studio, Web Review Tool, Backtest Z-Score Python,
contoh Pendidikan & Butik Luxury). Tiap kartu: judul, prompt asli, stack,
tanggal, badge, tombol Lihat Demo (modal preview), Lihat Kode (modal cuplikan
+ salin), dan Salin Link. Ada search + filter bahasa/stack + urutan.

- **Stack:** Vite + React + TypeScript (client-only, output statis untuk GitHub Pages).
- **Data:** semua demo/bahasa/tema dibaca dari `@workflow-tools/data`
  (`demos.json`, `languages.json`, `themes.json`) — jangan hardcode di komponen.
- **Tema:** tiap kartu ikut tema niche-nya (dari `demos.json → theme`).

```bash
npm run dev    # dari folder ini, atau: npm run dev:demo-hub (dari root)
npm run build  # hasil di dist/ — salin isinya ke folder demo-hub/ di repo
npm run preview
```

Cara nambah demo baru: tambah 1 objek ke `packages/data/demos.json` —
lihat `docs/STRUCTURE.md`.

# Muse Demo Hub (app)

Galeri hasil kerja Muse agent — 8 demo (Workflow Tools, Prop Simulator, Stok
Harian Kinmart, Muse Motion Studio, Web Review Tool, Backtest Z-Score Python,
contoh Pendidikan & Butik Luxury). Tiap kartu: judul, prompt asli, stack,
tanggal, badge, tombol Lihat Demo (modal preview, atau langsung buka Custom
Link kalau ada), Salin Link, plus pemilih hosting sendiri dan kolom Custom
Link. Di atas grid ada bagian "Pilih Hosting" — 10 hosting gratisan populer
yang bisa dipilih jadi hosting default (tersimpan di localStorage). Demo Hub
hanya menampilkan demo — TIDAK ada code demo di sini. Ada search + filter
bahasa/stack + urutan.

- **Stack:** Vite + React + TypeScript (client-only, output statis untuk GitHub Pages).
- **Data:** semua demo/bahasa/tema/hosting dibaca dari `@workflow-tools/data`
  (`demos.json`, `hostings.json`, `languages.json`, `themes.json`) — jangan
  hardcode di komponen. Pilihan hosting & Custom Link tersimpan di
  localStorage browser (`mdh_default_hosting`, `mdh_host_<id>`, `mdh_custom_<id>`).
- **Tema:** tiap kartu ikut tema niche-nya (dari `demos.json → theme`).

```bash
npm run dev    # dari folder ini, atau: npm run dev:demo-hub (dari root)
npm run build  # hasil di dist/ — salin isinya ke folder demo-hub/ di repo
npm run preview
```

Cara nambah demo baru: tambah 1 objek ke `packages/data/demos.json` —
lihat `docs/STRUCTURE.md`.

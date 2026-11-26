# Muse Demo Hub (app)

Galeri hasil kerja Muse agent — 9 demo bawaan (Workflow Tools, Prop Simulator,
Stok Harian Kinmart, Muse Motion Studio, Web Review Tool, Sekolah Pondok,
contoh Pendidikan & Butik Luxury, Backtest Z-Score Python). Tiap kartu: judul,
prompt asli, stack, tanggal, badge, tombol Lihat Demo (modal preview, atau
langsung buka Custom Link kalau ada), Salin Link, plus pemilih hosting sendiri
dan kolom Custom Link. Di atas grid ada bagian "Pilih Hosting" — 10 hosting
gratisan populer yang bisa dipilih jadi hosting default (tersimpan di
localStorage). Demo Hub hanya menampilkan demo — TIDAK ada code demo di sini.
Ada search + filter bahasa/stack + urutan.

Fitur tambahan (juga tersimpan di localStorage browser ini saja):

- **Tambah Hasil** — tombol di hero membuka form (judul, kategori, stack,
  prompt, tanggal otomatis hari ini, hosting / Custom Link). Hasil baru
  langsung muncul sebagai kartu demo baru (`mdh_user_demos`) dan bisa
  dihapus penambahnya (klik Hapus 2x konfirmasi). Demo bawaan tidak berubah.
- **Template Eksklusif — 1 of 1** — seksi khusus berisi 3 template dari
  `packages/data/templates.json`. Tidak ada tombol duplikat / salin / copy.
  Tombol Buka & Download baru aktif setelah pengunjung follow X
  @candraputra009 dan TikTok @candraputra162 lalu mencentang sendiri kedua
  konfirmasinya (`mdh_tpl_follow_<id>`). Download menghasilkan file .txt
  ringkasan template, lalu status permanen jadi Sudah Diambil
  (`mdh_tpl_taken_<id>`). Cek follow-nya lewat centang sendiri — X/TikTok
  tidak mengizinkan cek otomatis tanpa login/API, dan itu dijelaskan jujur
  di halaman.

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

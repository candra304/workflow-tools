# Workflow Tools (app)

Katalog 42 kartu (28 tools + 14 referensi web live, 8 kategori), Pattern Picker
4 pola super interaktif, Stack Generator (npm install + checklist + conflict
check), dan Referensi per Niche (Finance/Prop, Portfolio, E-Commerce 8
sub-model, Pendidikan, SaaS, dll).

- **Stack:** Vite + React + TypeScript (client-only, output statis untuk GitHub Pages).
- **Data:** semua daftar dibaca dari `@workflow-tools/data` (`tools.json`,
  `patterns.json`, `niches.json`, `themes.json`) — jangan hardcode di komponen.
- **Tema:** per niche/pola/kategori, dari `@workflow-tools/ui` (`theme.css` +
  `tokens.ts`). Bukan hitam pekat + limau.

```bash
npm run dev    # dari folder ini, atau: npm run dev:workflow-tools (dari root)
npm run build  # hasil di dist/ — salin isinya ke root repo candra304/workflow-tools
npm run preview
```

import { categories, tools, type PatternId } from "@workflow-tools/data";
import { filterTools, type CatalogFilter } from "../lib/filters";
import { CatalogCard } from "./CatalogCard";

export interface CatalogProps {
  filter: CatalogFilter;
  onFilterChange: (f: CatalogFilter) => void;
  stack: string[];
  onToggleStack: (id: string) => void;
  showToast: (msg: string) => void;
}

/** Katalog 42 kartu + filter (cari / pola / berat / lisensi / kategori). */
export function Catalog({ filter, onFilterChange, stack, onToggleStack, showToast }: CatalogProps) {
  const shown = filterTools(tools, filter);
  const set = (patch: Partial<CatalogFilter>) => onFilterChange({ ...filter, ...patch });

  return (
    <section id="katalog">
      <div className="sec-head">
        <span className="sec-num">03</span>
        <h2>Katalog 42 Kartu</h2>
      </div>
      <p className="sec-desc">
        28 tools + 14 referensi web live. Tiap kartu lengkap: fungsi, kapan pakai / jangan pakai, berat &amp;
        lisensi, bintang GitHub, perintah install, pola yang cocok, contoh web yang memakai, dan alternatifnya.
        Referensi live tidak di-install — itu bahan ATM (Amati, Tiru, Modifikasi).
      </p>
      <div className="filters">
        <div className="f-row">
          <label className="search">
            <span aria-hidden="true">⌕</span>
            <input
              id="q"
              type="search"
              placeholder="Cari: hero 3D, scroll, ikon, configurator…"
              autoComplete="off"
              value={filter.query}
              onChange={(e) => set({ query: e.target.value })}
            />
          </label>
          <select
            id="fPattern"
            aria-label="Filter pola"
            value={filter.pattern}
            onChange={(e) => set({ pattern: e.target.value as "" | PatternId })}
          >
            <option value="">Semua pola</option>
            <option value="drive">Pola: Drive / Explore</option>
            <option value="scroll">Pola: Scroll Film</option>
            <option value="config">Pola: Configurator / Game</option>
            <option value="game">Pola: Game / Instrument</option>
          </select>
          <select
            id="fWeight"
            aria-label="Filter berat"
            value={filter.weight}
            onChange={(e) => set({ weight: e.target.value })}
          >
            <option value="">Semua berat</option>
            <option value="Ringan">Ringan (&lt;50KB)</option>
            <option value="Sedang">Sedang (50–200KB)</option>
            <option value="Berat">Berat (&gt;200KB)</option>
          </select>
          <select
            id="fLicense"
            aria-label="Filter lisensi"
            value={filter.license}
            onChange={(e) => set({ license: e.target.value })}
          >
            <option value="">Semua lisensi</option>
            <option value="Gratis">Gratis / Open source</option>
            <option value="Freemium">Freemium</option>
            <option value="Berbayar">Berbayar</option>
          </select>
        </div>
        <div className="f-row" id="catChips">
          {["Semua", ...categories].map((c) => {
            const n = c === "Semua" ? tools.length : tools.filter((t) => t.cat === c).length;
            return (
              <button
                key={c}
                type="button"
                className={`cat-chip${filter.category === c ? " on" : ""}`}
                onClick={() => set({ category: c })}
              >
                {c} ({n})
              </button>
            );
          })}
        </div>
        <div className="f-row">
          <span className="result-count" id="resultCount">
            Menampilkan {shown.length} dari {tools.length} kartu
          </span>
        </div>
      </div>
      <div className="grid" id="grid">
        {shown.map((t) => (
          <CatalogCard
            key={t.id}
            tool={t}
            inStack={stack.includes(t.id)}
            onToggleStack={onToggleStack}
            showToast={showToast}
          />
        ))}
      </div>
      <div className={`no-result${shown.length === 0 ? " show" : ""}`} id="noResult">
        <b>Tidak ada kartu yang cocok</b>
        Coba longgarkan filter — hapus kata kunci, atau pilih “Semua pola / berat / lisensi”.
      </div>
    </section>
  );
}

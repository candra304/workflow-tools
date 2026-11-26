import { demoFilters } from "@workflow-tools/data";
import type { DemoSort } from "../lib/filter";

export interface ToolbarProps {
  query: string;
  onQueryChange: (q: string) => void;
  sort: DemoSort;
  onSortChange: (s: DemoSort) => void;
  filter: string;
  onFilterChange: (f: string) => void;
  shown: number;
  total: number;
}

/** Toolbar: cari + urutkan + chip filter bahasa/stack + baris hasil. */
export function Toolbar({ query, onQueryChange, sort, onSortChange, filter, onFilterChange, shown, total }: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="search-row">
        <div className="search-box">
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            id="searchInput"
            type="search"
            placeholder="Cari demo, prompt, atau stack… misal: prop, stok, python"
            aria-label="Cari demo"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </div>
        <select
          id="sortSel"
          className="sort-sel"
          aria-label="Urutkan demo"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as DemoSort)}
        >
          <option value="baru">Terbaru dulu</option>
          <option value="lama">Terlama dulu</option>
          <option value="az">Judul A–Z</option>
        </select>
      </div>
      <div className="chips" id="chips" role="group" aria-label="Filter bahasa dan stack">
        {demoFilters.map((f) => (
          <button
            key={f}
            type="button"
            className={`chip${filter === f ? " active" : ""}`}
            data-filter={f}
            onClick={() => onFilterChange(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <p className="result-line" id="resultLine">
        Menampilkan <b>{shown}</b> dari {total} demo
        {filter !== "Semua" ? (
          <>
            {" · filter: "}
            <b>{filter}</b>
          </>
        ) : null}
        {query.trim() ? (
          <>
            {" · cari: "}
            <b>“{query.trim()}”</b>
          </>
        ) : null}
      </p>
    </div>
  );
}

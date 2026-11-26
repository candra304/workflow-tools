/**
 * Filter katalog & sorting niche — dipindah 1:1 dari versi single-file.
 */
import {
  patternNames,
  type NicheItem,
  type PatternId,
  type Tool,
} from "@workflow-tools/data";

export interface CatalogFilter {
  query: string;
  pattern: "" | PatternId;
  weight: string;
  license: string;
  category: string;
}

export function filterTools(tools: Tool[], f: CatalogFilter): Tool[] {
  const q = f.query.toLowerCase().trim();
  return tools.filter((t) => {
    if (f.category !== "Semua" && t.cat !== f.category) return false;
    if (f.pattern && !t.patterns.includes(f.pattern)) return false;
    if (f.weight && t.weight !== f.weight) return false;
    if (f.license && t.license !== f.license) return false;
    if (q) {
      const hay = `${t.name} ${t.func} ${t.cat} ${t.examples} ${t.use} ${t.patterns
        .map((p) => patternNames[p])
        .join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export type NicheSortMode = "laris" | "baru" | "premium";

/** Urutan default: paling diminati (popularity) dulu, bukan alfabet. */
export function sortNicheItems(items: NicheItem[], mode: NicheSortMode): NicheItem[] {
  return [...items].sort((a, b) => {
    if (mode === "baru") return b.freshness - a.freshness || b.popularity - a.popularity;
    if (mode === "premium") return Number(b.premium) - Number(a.premium) || b.popularity - a.popularity;
    return b.popularity - a.popularity;
  });
}

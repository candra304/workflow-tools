/**
 * @workflow-tools/data — satu-satunya sumber data monorepo ini.
 * Semua daftar (tools, pola, niche, demo, bahasa, tema) tinggal di file
 * JSON di sebelah package ini. Komponen di apps/* HANYA boleh membaca
 * lewat export di bawah — dilarang hardcode daftar di dalam komponen.
 *
 * Cara update data: edit file JSON-nya, tidak perlu sentuh komponen.
 * Lihat docs/STRUCTURE.md ("Cara nambah tool / niche / demo baru").
 */
import toolsJson from "../tools.json";
import patternsJson from "../patterns.json";
import nichesJson from "../niches.json";
import demosJson from "../demos.json";
import hostingsJson from "../hostings.json";
import languagesJson from "../languages.json";
import themesJson from "../themes.json";

export type ToolType = "tool" | "ref";
export type PatternId = "drive" | "scroll" | "config" | "game";
export type Weight = "Ringan" | "Sedang" | "Berat";
export type License = "Gratis" | "Freemium" | "Berbayar";

export interface Tool {
  id: string;
  name: string;
  url: string;
  cat: string;
  type: ToolType;
  /** grup konflik: "uikit" | "3d-three" | "3d-spline" | "3d-ogl" | "fx" | null */
  group: string | null;
  func: string;
  use: string;
  avoid: string;
  weight: Weight;
  kb: string;
  license: License;
  stars: string;
  pkg: string | null;
  install: string;
  patterns: PatternId[];
  examples: string;
  alt: string;
}

export interface ThemeVars {
  /** warna aksen */
  a: string;
  /** warna gelap (deep) */
  d: string;
  /** warna latar lembut (soft) */
  s: string;
  /** warna teks di atas aksen (ink) */
  i: string;
}

export interface Pattern {
  id: PatternId;
  name: string;
  like: string;
  desc: string;
  /** id tools optimal untuk pola ini (7–9 tools) */
  stack: string[];
  time: string;
  level: string;
}

export interface PatternsData {
  categories: string[];
  categoryThemes: Record<string, ThemeVars>;
  patternNames: Record<PatternId, string>;
  patterns: Pattern[];
  /** Label tampil untuk tiap set 3D (dipakai pesan konflik Stack Generator). */
  threeDSetNames: Record<string, string>;
}

export interface NicheItem {
  name: string;
  url: string;
  urlLabel: string;
  price: string;
  metric: string;
  /** skor kebaruan update (badge "Baru Update" = tertinggi) */
  freshness: number;
  /** skor peminat internal (dari sales / skor / status patokan) */
  popularity: number;
  badges: string[];
  pattern: PatternId;
  premium: boolean;
  note: string;
}

export interface NicheGroup {
  label: string | null;
  style: string | null;
  stack: string | null;
  items: NicheItem[];
}

export interface Niche {
  id: string;
  name: string;
  desc: string;
  stack: string[];
  groups: NicheGroup[];
}

export interface NichesData {
  checkedLabel: string;
  niches: Niche[];
}

export interface DemoTheme {
  a: string;
  soft: string;
  line: string;
  tbg: string;
  on: string;
}

export type ThumbType = "catalog" | "trading" | "stock" | "motion" | "review" | "chart";

export interface Demo {
  id: string;
  title: string;
  date: string;
  dateLabel: string;
  status: string;
  desc: string;
  prompt: string;
  stacks: string[];
  cat: string;
  theme: DemoTheme;
  thumb: ThumbType;
}

/** Hosting gratisan populer — dipakai Demo Hub sebagai pilihan deploy. */
export interface Hosting {
  id: string;
  name: string;
  url: string;
  /** catatan paket gratis, 1 baris */
  note: string;
}

export interface Language {
  name: string;
  note: string;
  color: string;
  /** nilai filter di Demo Hub; null = bahasa ini belum dipakai filter demo */
  filter: string | null;
}

export interface LanguagesData {
  languages: Language[];
  filters: string[];
}

export interface ThemeLegendItem {
  name: string;
  note: string;
  swatches: [string, string];
}

export interface ThemesData {
  workflowTools: ThemeLegendItem[];
  demoHub: ThemeLegendItem[];
}

export const tools: Tool[] = toolsJson as Tool[];
export const patternsData: PatternsData = patternsJson as PatternsData;
export const categories: string[] = patternsData.categories;
export const categoryThemes: Record<string, ThemeVars> = patternsData.categoryThemes;
export const patternNames: Record<PatternId, string> = patternsData.patternNames;
export const patterns: Pattern[] = patternsData.patterns;
export const nichesData: NichesData = nichesJson as NichesData;
export const niches: Niche[] = nichesData.niches;
export const demos: Demo[] = demosJson as Demo[];
export const hostings: Hosting[] = hostingsJson as Hosting[];
/** Cari hosting berdasarkan id — null kalau id tidak dikenal. */
export const findHosting = (id: string): Hosting | null =>
  hostings.find((h) => h.id === id) ?? null;
export const languagesData: LanguagesData = languagesJson as LanguagesData;
export const languages: Language[] = languagesData.languages;
export const demoFilters: string[] = languagesData.filters;
export const themesData: ThemesData = themesJson as ThemesData;

/** Lookup tool berdasarkan id — dipakai Stack Generator & Pattern Picker. */
export const toolsById: Record<string, Tool> = Object.fromEntries(tools.map((t) => [t.id, t]));

/**
 * tokens.ts — peta tema sebagai data (cermin dari theme.css).
 * Dipakai komponen yang perlu mengatur variabel tema lewat inline
 * style, mis. kartu katalog yang temanya ikut kategori tools-nya
 * (cara yang sama seperti `applyTheme()` di versi single-file dulu).
 */
import type { CSSProperties } from "react";
import type { ThemeVars } from "@workflow-tools/data";

export type { ThemeVars };

/** Tema per kategori katalog — sumber: packages/data/patterns.json (categoryThemes). */
export const CATEGORY_THEMES: Record<string, ThemeVars> = {
  "Core React": { a: "#818cf8", d: "#a5b4fc", s: "#22223d", i: "#191930" },
  "UI Kit": { a: "#a78bfa", d: "#c4b5fd", s: "#262040", i: "#221344" },
  Animasi: { a: "#ff6a4d", d: "#ff9a85", s: "#381a10", i: "#2a0f08" },
  "3D / WebGL": { a: "#e3b341", d: "#f0cd6a", s: "#16233c", i: "#241a05" },
  "Scroll & Interaksi": { a: "#ece5d3", d: "#ece5d3", s: "#26261f", i: "#1d1a15" },
  "Aset Premium": { a: "#d6b98a", d: "#e6cfa3", s: "#2e2417", i: "#2a1f0d" },
  "Referensi Web Live": { a: "#38bdf8", d: "#7cc7ff", s: "#10283f", i: "#082a3f" },
  "Template / Starter": { a: "#14b8a6", d: "#5eead4", s: "#0f2b2b", i: "#ffffff" }
};

/** Tema per pola (class `.pattern--*` di theme.css memakai nilai yang sama). */
export const PATTERN_THEMES: Record<string, ThemeVars> = {
  drive: { a: "#14b8a6", d: "#5eead4", s: "#0f2b2b", i: "#ffffff" },
  scroll: { a: "#ece5d3", d: "#ece5d3", s: "#26261f", i: "#1d1a15" },
  config: { a: "#e3b341", d: "#f0cd6a", s: "#2a2110", i: "#241a05" },
  game: { a: "#ff6a4d", d: "#ff9a85", s: "#381a10", i: "#2a0f08" }
};

/** Tema per niche (class `.niche-block[data-niche]` di theme.css). */
export const NICHE_THEMES: Record<string, ThemeVars> = {
  finance: { a: "#e3b341", d: "#f0cd6a", s: "#16233c", i: "#241a05" },
  portfolio: { a: "#ece5d3", d: "#ece5d3", s: "#26261f", i: "#1d1a15" },
  ecommerce: { a: "#ff6a4d", d: "#ff9a85", s: "#381a10", i: "#2a0f08" },
  pendidikan: { a: "#38bdf8", d: "#7cc7ff", s: "#10283f", i: "#082a3f" },
  lainnya: { a: "#818cf8", d: "#a5b4fc", s: "#22223d", i: "#191930" }
};

/** Tema per sub-grup niche (atribut `data-theme` di theme.css). */
export const SUBGROUP_THEMES: Record<string, ThemeVars> = {
  luxury: { a: "#d6b98a", d: "#e6cfa3", s: "#2e2417", i: "#2a1f0d" },
  challenger: { a: "#ff6a4d", d: "#ff9a85", s: "#381a10", i: "#2a0f08" },
  saas: { a: "#818cf8", d: "#a5b4fc", s: "#22223d", i: "#191930" },
  edu: { a: "#38bdf8", d: "#7cc7ff", s: "#10283f", i: "#082a3f" },
  editorial: { a: "#ece5d3", d: "#ece5d3", s: "#26261f", i: "#1d1a15" },
  finance: { a: "#e3b341", d: "#f0cd6a", s: "#16233c", i: "#241a05" },
  drive: { a: "#14b8a6", d: "#5eead4", s: "#0f2b2b", i: "#ffffff" },
  health: { a: "#34a186", d: "#8fe0cb", s: "#122b25", i: "#ffffff" }
};

/** Label sub-grup niche -> kunci tema (dulu fungsi `subTheme()`). */
export const SUBGROUP_THEME_FOR_LABEL: Record<string, string> = {
  Luxury: "luxury",
  "Food & Drink": "challenger",
  Fashion: "challenger",
  Fitness: "challenger",
  Beauty: "challenger",
  Elektronik: "finance",
  Furniture: "luxury",
  "3D Store": "saas",
  SaaS: "saas",
  "Agency / Studio": "editorial",
  "Real Estate": "drive",
  Kesehatan: "health",
  "Restoran / Hotel": "luxury",
};

export function subgroupThemeForLabel(label: string | null): string {
  if (!label) return "";
  return SUBGROUP_THEME_FOR_LABEL[label] ?? "";
}

/** Badge niche -> class CSS (dulu fungsi `badgeCls()`). */
export function badgeClassFor(badge: string): string {
  if (badge === "Trending") return "trending";
  if (badge === "Top Rated") return "toprated";
  if (badge === "Baru Update") return "baru";
  return "awwwards";
}

/**
 * Ubah ThemeVars jadi inline style `--ta*` — pengganti `applyTheme(el, cat)`
 * di versi single-file. Dipakai kartu katalog (tema ikut kategori).
 */
export function themeStyle(vars: ThemeVars | undefined): CSSProperties {
  if (!vars) return {};
  return {
    "--ta": vars.a,
    "--ta-deep": vars.d,
    "--ta-soft": vars.s,
    "--ta-ink": vars.i,
  } as CSSProperties;
}

/** Tema per demo di Demo Hub (dari demos.json: a/soft/line/tbg/on). */
export function demoThemeStyle(theme: {
  a: string;
  soft: string;
  line: string;
  tbg: string;
  on: string;
}): CSSProperties {
  return {
    "--a": theme.a,
    "--asoft": theme.soft,
    "--aline": theme.line,
    "--tbg": theme.tbg,
    "--aon": theme.on,
  } as CSSProperties;
}

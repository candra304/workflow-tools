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
  "Core React": { a: "#4f46e5", d: "#2e2a7a", s: "#eceafe", i: "#ffffff" },
  "UI Kit": { a: "#6366f1", d: "#3730a3", s: "#eef0fe", i: "#ffffff" },
  Animasi: { a: "#e63b25", d: "#8f1d0d", s: "#fde9e4", i: "#ffffff" },
  "3D / WebGL": { a: "#b8912a", d: "#102542", s: "#e6ebf3", i: "#ffffff" },
  "Scroll & Interaksi": { a: "#1d1a15", d: "#1d1a15", s: "#efe9db", i: "#f5efe0" },
  "Aset Premium": { a: "#a8822f", d: "#3a2f14", s: "#f3ecda", i: "#ffffff" },
  "Referensi Web Live": { a: "#1a73e8", d: "#0f3f7d", s: "#e6f0fd", i: "#ffffff" },
  "Template / Starter": { a: "#0d5c63", d: "#083f45", s: "#e0f0f0", i: "#ffffff" },
};

/** Tema per pola (class `.pattern--*` di theme.css memakai nilai yang sama). */
export const PATTERN_THEMES: Record<string, ThemeVars> = {
  drive: { a: "#0d5c63", d: "#083f45", s: "#e0f0f0", i: "#ffffff" },
  scroll: { a: "#1d1a15", d: "#1d1a15", s: "#efe9db", i: "#f5efe0" },
  config: { a: "#a8822f", d: "#3a2f14", s: "#f3ecda", i: "#ffffff" },
  game: { a: "#e63b25", d: "#8f1d0d", s: "#fde9e4", i: "#ffffff" },
};

/** Tema per niche (class `.niche-block[data-niche]` di theme.css). */
export const NICHE_THEMES: Record<string, ThemeVars> = {
  finance: { a: "#b8912a", d: "#102542", s: "#e6ebf3", i: "#ffffff" },
  portfolio: { a: "#1d1a15", d: "#1d1a15", s: "#efe9db", i: "#f5efe0" },
  ecommerce: { a: "#e63b25", d: "#8f1d0d", s: "#fde9e4", i: "#ffffff" },
  pendidikan: { a: "#1a73e8", d: "#0f3f7d", s: "#e6f0fd", i: "#ffffff" },
  lainnya: { a: "#4f46e5", d: "#2e2a7a", s: "#eceafe", i: "#ffffff" },
};

/** Tema per sub-grup niche (atribut `data-theme` di theme.css). */
export const SUBGROUP_THEMES: Record<string, ThemeVars> = {
  luxury: { a: "#a8822f", d: "#3a2f14", s: "#f3ecda", i: "#ffffff" },
  challenger: { a: "#e63b25", d: "#8f1d0d", s: "#fde9e4", i: "#ffffff" },
  saas: { a: "#4f46e5", d: "#2e2a7a", s: "#eceafe", i: "#ffffff" },
  edu: { a: "#1a73e8", d: "#0f3f7d", s: "#e6f0fd", i: "#ffffff" },
  editorial: { a: "#1d1a15", d: "#1d1a15", s: "#efe9db", i: "#f5efe0" },
  finance: { a: "#b8912a", d: "#102542", s: "#e6ebf3", i: "#ffffff" },
  drive: { a: "#0d5c63", d: "#083f45", s: "#e0f0f0", i: "#ffffff" },
  health: { a: "#2e7d6b", d: "#17493e", s: "#e2f1ec", i: "#ffffff" },
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

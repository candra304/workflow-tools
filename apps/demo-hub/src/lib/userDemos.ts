/**
 * Hasil tambahan user ("Tambah Hasil") — tersimpan di localStorage browser
 * ini saja (key mdh_user_demos), bukan di data bawaan. 9 demo bawaan di
 * packages/data/demos.json tidak pernah diubah oleh fitur ini.
 *
 * Perilaku di-port 1:1 dari Demo Hub single-file:
 * - form: judul, kategori, stack (pilih dari daftar), prompt, deskripsi
 *   opsional, tanggal otomatis hari ini, hosting dari 10 pilihan atau
 *   Custom Link. Hasil baru langsung muncul sebagai kartu demo baru.
 * - hapus: hanya penambahnya yang bisa menghapus (klik Hapus 2x konfirmasi).
 */
import type { Demo, DemoTheme, ThumbType } from "@workflow-tools/data";

export const USER_DEMOS_KEY = "mdh_user_demos";

/** Pilihan stack di form Tambah Hasil (sama seperti Demo Hub single-file). */
export const STACK_OPTIONS: string[] = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React / Next.js",
  "Tailwind",
  "Python",
  "Three.js",
  "GSAP + ScrollTrigger",
  "Lenis",
];

/** Kategori / niche di form Tambah Hasil. */
export const ADD_CATEGORIES: string[] = [
  "Pendidikan",
  "Finance / Prop Firm",
  "SaaS / Tools",
  "Portfolio",
  "E-Commerce Luxury",
  "E-Commerce Challenger",
  "Lainnya",
];

/** Tema per kategori untuk hasil tambahan (sama seperti Demo Hub single-file). */
export const CAT_THEMES: Record<string, DemoTheme> = {
  Pendidikan: {
    a: "#38bdf8",
    soft: "rgba(56,189,248,.13)",
    line: "rgba(56,189,248,.45)",
    tbg: "#082a40",
    on: "#04141f",
  },
  "Finance / Prop Firm": {
    a: "#e3b341",
    soft: "rgba(227,179,65,.13)",
    line: "rgba(227,179,65,.45)",
    tbg: "#0a1830",
    on: "#191204",
  },
  "SaaS / Tools": {
    a: "#8b93ff",
    soft: "rgba(139,147,255,.13)",
    line: "rgba(139,147,255,.45)",
    tbg: "#141433",
    on: "#0d0d24",
  },
  Portfolio: {
    a: "#ece4d1",
    soft: "rgba(236,228,209,.12)",
    line: "rgba(236,228,209,.42)",
    tbg: "#1d1a15",
    on: "#171410",
  },
  "E-Commerce Luxury": {
    a: "#d8b98a",
    soft: "rgba(216,185,138,.13)",
    line: "rgba(216,185,138,.45)",
    tbg: "#221a10",
    on: "#1c1408",
  },
  "E-Commerce Challenger": {
    a: "#ff7a59",
    soft: "rgba(255,122,89,.13)",
    line: "rgba(255,122,89,.45)",
    tbg: "#2b130c",
    on: "#260f04",
  },
  Lainnya: {
    a: "#e9e6dc",
    soft: "rgba(233,230,220,.12)",
    line: "rgba(233,230,220,.42)",
    tbg: "#17181c",
    on: "#141310",
  },
};

/** Miniatur per kategori untuk hasil tambahan. */
export const CAT_THUMBS: Record<string, ThumbType> = {
  "Finance / Prop Firm": "trading",
  Portfolio: "motion",
  Pendidikan: "catalog",
  "SaaS / Tools": "review",
};

const BULAN_SINGKAT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const BULAN_PANJANG = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const HARI_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

function pad2(n: number): string {
  return (n < 10 ? "0" : "") + n;
}

export interface TodayParts {
  iso: string;
  label: string;
  full: string;
}

/** Tanggal hari ini — ISO untuk sort, label singkat, dan label panjang. */
export function todayParts(): TodayParts {
  const n = new Date();
  return {
    iso: `${n.getFullYear()}-${pad2(n.getMonth() + 1)}-${pad2(n.getDate())}`,
    label: `${n.getDate()} ${BULAN_SINGKAT[n.getMonth()]} ${n.getFullYear()}`,
    full: `${HARI_ID[n.getDay()]}, ${n.getDate()} ${BULAN_PANJANG[n.getMonth()]} ${n.getFullYear()}`,
  };
}

function lsGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function lsSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage tidak tersedia — hasil tidak tersimpan */
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/**
 * Muat hasil tambahan user dari localStorage. Entri tidak valid (tanpa
 * id/judul, atau id-nya bentrok dengan demo bawaan) dilewati. Tema &
 * miniatur dilengkapi dari kategori kalau tidak tersimpan.
 */
export function loadUserDemos(builtinIds: Set<string>): Demo[] {
  const raw = lsGet(USER_DEMOS_KEY);
  if (!raw) return [];
  let arr: unknown;
  try {
    arr = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(arr)) return [];
  const out: Demo[] = [];
  for (const u of arr) {
    if (!isRecord(u) || typeof u.id !== "string" || typeof u.title !== "string") continue;
    if (builtinIds.has(u.id) || out.some((d) => d.id === u.id)) continue;
    const cat = typeof u.cat === "string" ? u.cat : "Lainnya";
    const theme = (isRecord(u.theme) ? (u.theme as unknown as DemoTheme) : null) ?? CAT_THEMES[cat] ?? CAT_THEMES["Lainnya"];
    const thumb = (typeof u.thumb === "string" ? (u.thumb as ThumbType) : null) ?? CAT_THUMBS[cat] ?? "catalog";
    out.push({
      id: u.id,
      title: u.title,
      date: typeof u.date === "string" ? u.date : "",
      dateLabel: typeof u.dateLabel === "string" ? u.dateLabel : "",
      status: typeof u.status === "string" ? u.status : "Baru",
      desc: typeof u.desc === "string" ? u.desc : "",
      prompt: typeof u.prompt === "string" ? u.prompt : "",
      stacks: Array.isArray(u.stacks) ? (u.stacks.filter((s) => typeof s === "string") as string[]) : [],
      cat,
      theme,
      thumb,
      custom: true,
    });
  }
  return out;
}

/** Simpan daftar hasil tambahan user ke localStorage. */
export function saveUserDemos(userDemos: Demo[]): void {
  const arr = userDemos.map((d) => ({
    id: d.id,
    title: d.title,
    date: d.date,
    dateLabel: d.dateLabel,
    status: d.status,
    desc: d.desc,
    prompt: d.prompt,
    stacks: d.stacks,
    cat: d.cat,
    theme: d.theme,
    thumb: d.thumb,
  }));
  lsSet(USER_DEMOS_KEY, JSON.stringify(arr));
}

/** Bangun objek Demo baru dari form Tambah Hasil (id unik berbasis waktu). */
export function buildUserDemo(input: {
  title: string;
  prompt: string;
  desc: string;
  cat: string;
  stacks: string[];
}): Demo {
  const t = todayParts();
  return {
    id: `user-${Date.now()}`,
    title: input.title,
    date: t.iso,
    dateLabel: t.label,
    status: "Baru",
    desc: input.desc || input.prompt,
    prompt: input.prompt,
    stacks: [...input.stacks],
    cat: input.cat,
    theme: CAT_THEMES[input.cat] ?? CAT_THEMES["Lainnya"],
    thumb: CAT_THUMBS[input.cat] ?? "catalog",
    custom: true,
  };
}

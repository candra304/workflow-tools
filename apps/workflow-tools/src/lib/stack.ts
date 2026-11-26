/**
 * Logika Stack Generator — dipindah 1:1 dari versi single-file
 * (fungsi conflicts / buildCommand / buildChecklist).
 * Semua nama tool & pola dibaca dari @workflow-tools/data, bukan hardcode.
 */
import {
  patternsData,
  patternNames,
  toolsById,
  type PatternId,
  type Tool,
} from "@workflow-tools/data";

export const MAX_STACK = 12;

/** Daftar peringatan konflik untuk stack saat ini (HTML-safe string, seperti aslinya). */
export function conflicts(stack: string[]): string[] {
  const warns: string[] = [];
  const byId = toolsById;
  const uis = stack.filter((id) => byId[id]?.group === "uikit");
  if (uis.length > 1) {
    warns.push(
      `<b>Konflik UI Kit:</b> kamu memilih ${uis.map((i) => byId[i].name).join(" + ")}. Pilih <b>satu</b> UI Kit saja — dua sistem komponen akan bentrok gaya & membengkakkan bundle.`,
    );
  }
  const sets = new Set<string>();
  stack.forEach((id) => {
    const g = byId[id]?.group;
    if (g && g.startsWith("3d-")) sets.add(g);
  });
  const setNames = patternsData.threeDSetNames;
  const setList = [...sets];
  if (setList.length > 1) {
    warns.push(
      `<b>Konflik set 3D:</b> kamu memilih ${setList.map((s) => setNames[s]).join(" + ")}. Pilih <b>satu</b> set 3D untuk satu scene — campur aduk membuat render berat & tidak konsisten.`,
    );
  }
  const fx = stack.filter((id) => byId[id]?.group === "fx");
  if (fx.length > 1) {
    warns.push(
      `<b>Terlalu banyak sumber efek:</b> ${fx.map((i) => byId[i].name).join(" + ")} dipilih bersamaan. Pilih salah satu agar gaya efek konsisten di seluruh web.`,
    );
  }
  if (stack.length > MAX_STACK) {
    warns.push(
      `<b>Melebihi batas:</b> stack berisi ${stack.length} tools. Batas sehat per build adalah <b>${MAX_STACK}</b> — kurangi yang tidak benar-benar dipakai pola ini.`,
    );
  }
  return warns;
}

/** Satu perintah `npm install` gabungan + baris per tool non-npm (seperti aslinya). */
export function buildCommand(stack: string[]): string {
  const pkgs: string[] = [];
  const extras: Tool[] = [];
  stack.forEach((id) => {
    const t = toolsById[id];
    if (!t) return;
    if (t.pkg) {
      t.pkg.split(" ").forEach((p) => {
        if (!pkgs.includes(p)) pkgs.push(p);
      });
    } else {
      extras.push(t);
    }
  });
  const lines: string[] = [];
  if (pkgs.length) lines.push(`npm install ${pkgs.join(" ")}`);
  extras.forEach((t) => {
    if (t.install && !t.install.startsWith("npm") && !t.install.startsWith("npx")) {
      lines.push(`# ${t.name}: ${t.install}`);
    } else if (t.install) {
      lines.push(`${t.install}   # ${t.name}`);
    }
  });
  return lines.join("\n");
}

/** Checklist build dinamis berdasarkan isi stack & pola aktif (seperti aslinya). */
export function buildChecklist(stack: string[], activePattern: PatternId | null): string[] {
  const steps: string[] = [];
  const has = (id: string) => stack.includes(id);
  const cats = new Set<string>();
  stack.forEach((id) => {
    if (toolsById[id]) cats.add(toolsById[id].cat);
  });
  if (activePattern) {
    steps.push(`Kunci konsep 1 interaksi utama pola ${patternNames[activePattern]} — jangan tambah pola kedua`);
  }
  if (has("nextjs")) steps.push("Scaffold project: npx create-next-app@latest (TypeScript + Tailwind + App Router)");
  if (has("vite")) steps.push("Scaffold project: npm create vite@latest -- --template react-ts");
  steps.push("Install stack dengan perintah generator di atas");
  if (cats.has("UI Kit")) steps.push("Setup UI Kit terpilih & kunci token warna/tema sebelum bikin komponen lain");
  if (has("tailwind")) steps.push("Atur Tailwind: palet warna, font display, spacing — satu sumber kebenaran gaya");
  if (cats.has("3D / WebGL")) steps.push("Bangun scene 3D kasar dulu (greybox), tes performa di HP kelas menengah sebelum detail");
  if (has("gsap")) steps.push("Susun timeline GSAP per adegan; aktifkan ScrollTrigger hanya di section yang perlu");
  if (has("lenis")) steps.push("Pasang Lenis sebagai lapisan paling bawah, sinkronkan dengan ScrollTrigger");
  if (has("motion")) steps.push("Tambahkan micro-interaction Motion: hover, masuk/keluar, transisi halaman");
  if (cats.has("Aset Premium")) steps.push("Siapkan aset: 1 set ikon, maks 2 family font, gambar terkompresi (WebP/AVIF)");
  steps.push("Tes mobile: target total muatan awal ramping, animasi 60fps, hormati prefers-reduced-motion");
  steps.push("Deploy & ukur: Lighthouse + cek bundle — tidak ada library yatim yang tidak terpakai");
  return steps;
}

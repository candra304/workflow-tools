/**
 * Template Eksklusif 1 of 1 — gate follow + status diambil.
 *
 * Aturan (di-port 1:1 dari Demo Hub single-file):
 * - TIDAK ada tombol duplikat / salin / copy untuk template ini.
 * - Tombol Buka & Download baru aktif setelah pengunjung mencentang
 *   sendiri "Saya sudah follow X" DAN "Saya sudah follow TikTok".
 * - Sekali di-download, status permanen jadi "Sudah Diambil" dan template
 *   tidak bisa dibuka / di-download lagi.
 * - Semua status tersimpan di localStorage browser pengunjung saja:
 *   mdh_tpl_taken_<id> dan mdh_tpl_follow_<id> ({ x, tt }).
 *
 * Penjelasan jujur (juga tampil di halaman): X dan TikTok tidak
 * mengizinkan pengecekan follow otomatis tanpa login / API resmi, jadi
 * sistem percaya pada centang kejujuran pengunjung — tidak ada
 * verifikasi otomatis ke akun X / TikTok siapa pun.
 */
import type { Template } from "@workflow-tools/data";

export const X_URL = "https://x.com/candraputra009";
export const X_HANDLE = "@candraputra009";
export const TIKTOK_URL = "https://www.tiktok.com/@candraputra162";
export const TIKTOK_HANDLE = "@candraputra162";

export interface FollowState {
  x: boolean;
  tt: boolean;
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
    /* storage tidak tersedia — status tidak tersimpan */
  }
}

/** true kalau template ini sudah pernah di-download (permanen). */
export function tplTaken(id: string): boolean {
  return lsGet(`mdh_tpl_taken_${id}`) === "1";
}

/** Konfirmasi follow yang dicentang pengunjung untuk satu template. */
export function tplFollow(id: string): FollowState {
  const raw = lsGet(`mdh_tpl_follow_${id}`);
  if (!raw) return { x: false, tt: false };
  try {
    const o = JSON.parse(raw) as Partial<FollowState>;
    return { x: !!o.x, tt: !!o.tt };
  } catch {
    return { x: false, tt: false };
  }
}

export function setTplFollow(id: string, f: FollowState): void {
  lsSet(`mdh_tpl_follow_${id}`, JSON.stringify(f));
}

/** Tombol Buka & Download aktif hanya kalau kedua follow sudah dicentang. */
export function tplUnlocked(id: string): boolean {
  const f = tplFollow(id);
  return f.x && f.tt;
}

/**
 * Download template sebagai file ringkasan .txt (via Blob), lalu tandai
 * template sebagai sudah diambil — permanen, tidak bisa di-download lagi.
 */
export function downloadTemplate(t: Template): void {
  const lines = [
    t.title,
    "Template Eksklusif Muse Demo Hub — 1 of 1 (Sekali Buat)",
    "",
    `Kategori: ${t.cat}`,
    `Stack: ${t.stacks.join(", ")}`,
    "",
    t.desc,
    "",
    "Template ini hanya dibuat satu kali dan tidak diduplikat untuk siapa pun.",
    `Diambil lewat Muse Demo Hub setelah follow X ${X_HANDLE} dan TikTok ${TIKTOK_HANDLE}.`,
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${t.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  lsSet(`mdh_tpl_taken_${t.id}`, "1");
}

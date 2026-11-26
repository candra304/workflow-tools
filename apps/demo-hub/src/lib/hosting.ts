/**
 * Hosting bebas Demo Hub — pilihan hosting + Custom Link per demo.
 * Semua pilihan tersimpan di localStorage browser ini saja:
 * - mdh_default_hosting : id hosting default (dipilih di "Pilih Hosting")
 * - mdh_host_<demoId>   : id hosting khusus satu demo ("" = ikut default)
 * - mdh_custom_<demoId> : URL Custom Link satu demo ("" = belum ada)
 * Tidak ada code demo yang disimpan di sini — Demo Hub hanya menampilkan
 * demo, bukan kodenya.
 */
import { findHosting, hostings, type Demo, type Hosting } from "@workflow-tools/data";

export const DEFAULT_HOSTING_KEY = "mdh_default_hosting";
export const DEFAULT_HOSTING_ID = "github-pages";

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
    /* storage tidak tersedia — pilihan tidak tersimpan */
  }
}

function lsDel(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* abaikan */
  }
}

/** Id hosting default yang dipilih user (fallback: GitHub Pages). */
export function getDefaultHostingId(): string {
  return lsGet(DEFAULT_HOSTING_KEY) || DEFAULT_HOSTING_ID;
}

export function setDefaultHostingId(id: string): void {
  lsSet(DEFAULT_HOSTING_KEY, id);
}

export function getDefaultHosting(): Hosting {
  return findHosting(getDefaultHostingId()) ?? hostings[0];
}

/** Id hosting khusus satu demo ("" = ikut default). */
export function getDemoHostingId(demoId: string): string {
  return lsGet(`mdh_host_${demoId}`) || "";
}

export function setDemoHostingId(demoId: string, id: string): void {
  if (id) lsSet(`mdh_host_${demoId}`, id);
  else lsDel(`mdh_host_${demoId}`);
}

/** Hosting yang berlaku untuk satu demo: khusus demo, kalau tidak ada ikut default. */
export function getEffectiveHosting(demoId: string): Hosting {
  return findHosting(getDemoHostingId(demoId) || getDefaultHostingId()) ?? hostings[0];
}

/** Custom Link yang tersimpan untuk satu demo ("" = belum ada). */
export function getCustomLink(demoId: string): string {
  return lsGet(`mdh_custom_${demoId}`) || "";
}

export function setCustomLink(demoId: string, url: string): void {
  lsSet(`mdh_custom_${demoId}`, url);
}

export function deleteCustomLink(demoId: string): void {
  lsDel(`mdh_custom_${demoId}`);
}

/**
 * Normalisasi URL yang ditempel user: tambah https:// kalau belum ada
 * skema, lalu validasi. Kembalikan "" kalau tidak valid.
 */
export function normalizeUrl(raw: string): string {
  const u = String(raw || "").trim();
  if (!u) return "";
  const withScheme = /^https?:\/\//i.test(u) ? u : `https://${u}`;
  try {
    new URL(withScheme);
    return withScheme;
  } catch {
    return "";
  }
}

/** URL yang dibuka tombol Lihat Demo: Custom Link kalau ada, kalau tidak "" (buka preview). */
export function resolveDemoUrl(demo: Demo): string {
  return getCustomLink(demo.id);
}

/** Link yang disalin tombol Salin Link — Custom Link kalau ada, kalau tidak path demo. */
export function demoLink(demo: Demo): string {
  return getCustomLink(demo.id) || `muse-demo-hub/demo/${demo.id}`;
}

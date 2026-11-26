/** Filter + sorting Demo Hub — dipindah 1:1 dari versi single-file. */
import type { Demo } from "@workflow-tools/data";

export type DemoSort = "baru" | "lama" | "az";

export function matchesDemo(d: Demo, filter: string, query: string): boolean {
  if (filter !== "Semua" && !d.stacks.includes(filter)) return false;
  if (!query) return true;
  const hay = `${d.title} ${d.desc} ${d.prompt} ${d.stacks.join(" ")}`.toLowerCase();
  return hay.includes(query);
}

export function sortDemos(list: Demo[], sort: DemoSort): Demo[] {
  const arr = [...list];
  if (sort === "az") arr.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === "lama") arr.sort((a, b) => (a.date < b.date ? -1 : 1));
  else arr.sort((a, b) => (a.date > b.date ? -1 : 1));
  return arr;
}

/** Link demo — sama seperti `demoLink()` di versi single-file. */
export function demoLink(d: Demo): string {
  return `muse-demo-hub/demo/${d.id}`;
}

import type { ReactNode } from "react";
import { badgeClassFor } from "../tokens";

/** Badge niche (Trending / Top Rated / Baru Update / Awwwards). */
export function NicheBadge({ label }: { label: string }) {
  return <span className={`badge ${badgeClassFor(label)}`}>{label}</span>;
}

/** Chip kecil generik (dipakai untuk berat, lisensi, pola, stack). */
export function Chip({
  children,
  tone,
  className = "",
}: {
  children: ReactNode;
  tone?: "lime" | "warn";
  className?: string;
}) {
  return <span className={`chip${tone ? ` ${tone}` : ""}${className ? ` ${className}` : ""}`}>{children}</span>;
}

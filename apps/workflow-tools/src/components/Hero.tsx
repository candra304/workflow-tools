import { categories, patterns, tools } from "@workflow-tools/data";
import { PatatapPads } from "./PatatapPads";

/** Hero + statistik — semua angka dihitung dari data, bukan hardcode. */
export function Hero() {
  const toolCount = tools.filter((t) => t.type === "tool").length;
  const refCount = tools.filter((t) => t.type === "ref").length;
  const stats: Array<[string, string]> = [
    [String(tools.length), "Kartu total"],
    [String(toolCount), "Tools"],
    [String(refCount), "Referensi live"],
    [String(categories.length), "Kategori"],
    [String(patterns.length), "Pola interaktif"],
  ];
  return (
    <header className="hero">
      <span className="hero-tag">
        <span className="dot" /> Katalog &middot; Pola &middot; Stack Generator
      </span>
      <h1>
        Workflow
        <br />
        <span className="lime">Tools</span>
      </h1>
      <p className="hero-sub">
        Semua sumber daya untuk membangun web premium <strong>super interaktif</strong> dengan React JS —
        disimpan lengkap di katalog, tapi yang masuk ke satu build selalu ramping:{" "}
        <strong>7–9 tools inti, maksimal 12</strong>. Katalog itu database, bukan{" "}
        <span className="mono">package.json</span>.
      </p>
      <div className="stats">
        {stats.map(([num, label]) => (
          <div className="stat" key={label}>
            <b>{num}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <PatatapPads />
    </header>
  );
}

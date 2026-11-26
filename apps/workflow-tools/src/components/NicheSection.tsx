import { niches, nichesData, patternNames, themesData } from "@workflow-tools/data";
import { Chip, NicheBadge, subgroupThemeForLabel } from "@workflow-tools/ui";
import { sortNicheItems, type NicheSortMode } from "../lib/filters";

/**
 * Referensi per Kebutuhan / Niche — data dari packages/data/niches.json,
 * tema dari packages/data/themes.json + packages/ui/theme.css.
 * Urutan default: paling diminati (popularity) dulu.
 */
export function NicheSection({
  sort,
  onSortChange,
  activeNiche,
  onActiveNicheChange,
}: {
  sort: NicheSortMode;
  onSortChange: (s: NicheSortMode) => void;
  activeNiche: string;
  onActiveNicheChange: (n: string) => void;
}) {
  const visible = niches.filter((nz) => activeNiche === "Semua" || nz.name === activeNiche);
  return (
    <section id="niche">
      <div className="sec-head">
        <span className="sec-num">04</span>
        <h2>Referensi per Kebutuhan / Niche</h2>
      </div>
      <p className="sec-desc">
        Katalog tools itu umum — bagian ini menjawab “mau bikin web <em>apa</em>”. Tiap niche berisi referensi
        premium yang terbukti laris / jadi patokan di bidangnya, lengkap dengan harga, sales / skor, badge, dan
        pola interaktif yang cocok. Urutan default: <strong>paling diminati dulu</strong>, bukan alfabet.
      </p>
      <div className="theme-legend" aria-label="Legenda tema per niche">
        {themesData.workflowTools.map((t) => (
          <span key={t.name}>
            <i style={{ background: t.swatches[0] }} />
            <i style={{ background: t.swatches[1], marginLeft: -14 }} />
            {t.name} — {t.note}
          </span>
        ))}
      </div>
      <div className="niche-tools">
        <div className="f-row" id="nicheChips" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["Semua", ...niches.map((n) => n.name)].map((name) => (
            <button
              key={name}
              type="button"
              className={`cat-chip${activeNiche === name ? " on" : ""}`}
              onClick={() => onActiveNicheChange(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <select id="nSort" aria-label="Urutkan referensi niche" value={sort} onChange={(e) => onSortChange(e.target.value as NicheSortMode)}>
          <option value="laris">Urutkan: Paling Laris</option>
          <option value="baru">Urutkan: Paling Baru Update</option>
          <option value="premium">Urutkan: Paling Premium (Awwwards)</option>
        </select>
        <span className="checked-note">
          Snapshot katalog &middot; terakhir dicek <b>{nichesData.checkedLabel}</b>
        </span>
      </div>
      <div id="nicheList">
        {visible.map((nz) => {
          const total = nz.groups.reduce((a, g) => a + g.items.length, 0);
          return (
            <div className="niche-block" data-niche={nz.id} key={nz.id}>
              <div className="niche-head">
                <h3>{nz.name}</h3>
                <span className="chip">{total} referensi</span>
              </div>
              <div className="niche-stack">
                {nz.stack.map((s) => (
                  <Chip tone="lime" key={s}>
                    {s}
                  </Chip>
                ))}
              </div>
              <p className="niche-desc">{nz.desc}</p>
              {nz.groups.map((g, gi) => (
                <div className="subgroup" data-theme={subgroupThemeForLabel(g.label)} key={gi}>
                  {g.label ? (
                    <>
                      <h4>{g.label}</h4>
                      <p className="style">{g.style}</p>
                      {g.stack ? <p className="s-stack">Stack: {g.stack}</p> : null}
                    </>
                  ) : null}
                  <div className="n-grid">
                    {sortNicheItems(g.items, sort).map((it) => (
                      <div className="n-card" key={it.name}>
                        {it.badges.length ? (
                          <div className="n-badges">
                            {it.badges.map((b) => (
                              <NicheBadge key={b} label={b} />
                            ))}
                          </div>
                        ) : null}
                        <h5 className="n-name">
                          <a href={it.url} target="_blank" rel="noopener">
                            {it.name}
                          </a>
                        </h5>
                        <div className="n-meta">
                          <span>
                            Harga: <b>{it.price}</b>
                          </span>
                          <span>{it.metric}</span>
                        </div>
                        <div className="n-meta">
                          <span>
                            Update: <b>Nov 2026</b>
                          </span>
                          <span>
                            <a href={it.url} target="_blank" rel="noopener">
                              {it.urlLabel}
                            </a>
                          </span>
                        </div>
                        <p className="n-note">{it.note}</p>
                        <span className="n-pat">Pola cocok: {patternNames[it.pattern]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

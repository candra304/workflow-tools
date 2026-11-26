import { useState } from "react";
import { patternNames, type Tool } from "@workflow-tools/data";
import { Chip, themeStyle, useClipboard, CATEGORY_THEMES } from "@workflow-tools/ui";

/** Satu kartu katalog — tema ikut kategori tools-nya (lihat themeStyle). */
export function CatalogCard({
  tool,
  inStack,
  onToggleStack,
  showToast,
}: {
  tool: Tool;
  inStack: boolean;
  onToggleStack: (id: string) => void;
  showToast: (msg: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const copy = useClipboard();
  const isRef = tool.type === "ref";
  const showStars = tool.stars && tool.stars !== "— (web live)";

  return (
    <article
      className={`card${isRef ? " ref" : ""}${inStack ? " in-stack" : ""}`}
      style={themeStyle(CATEGORY_THEMES[tool.cat])}
    >
      <div className="c-top">
        <span className={`c-cat${isRef ? " ref" : ""}`}>{tool.cat}</span>
        {showStars ? <span className="chip">★ {tool.stars}</span> : null}
      </div>
      <h3 className="c-name">
        <a href={tool.url} target="_blank" rel="noopener">
          {tool.name} ↗
        </a>
      </h3>
      <p className="c-func">{tool.func}</p>
      <div className="c-chips">
        <span className={tool.weight === "Berat" ? "chip warn" : "chip"}>
          {tool.weight} · {tool.kb}
        </span>
        <span className="chip">{tool.license === "Gratis" ? "Gratis / OSS" : tool.license}</span>
      </div>
      <div className="c-chips">
        {tool.patterns.map((p) => (
          <Chip key={p}>{patternNames[p]}</Chip>
        ))}
      </div>
      <div className={`c-detail${open ? " open" : ""}`} id={`det-${tool.id}`}>
        <dl>
          <div>
            <dt>Pakai kapan</dt>
            <dd className="good">{tool.use}</dd>
          </div>
          <div>
            <dt>Jangan pakai kapan</dt>
            <dd className="bad">{tool.avoid}</dd>
          </div>
          <div>
            <dt>Contoh web yang pakai / terkait</dt>
            <dd>{tool.examples}</dd>
          </div>
          <div>
            <dt>Alternatif</dt>
            <dd>{tool.alt}</dd>
          </div>
          {tool.type === "tool" ? (
            <div>
              <dt>Install</dt>
              <dd>
                <span className="install">
                  <code>{tool.install}</code>
                  <button
                    type="button"
                    onClick={() => copy(tool.install, () => showToast(`Perintah install ${tool.name} tersalin`))}
                  >
                    Salin
                  </button>
                </span>
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
      <div className="c-actions">
        {isRef ? (
          <a className="visit" href={tool.url} target="_blank" rel="noopener">
            Kunjungi web live ↗
          </a>
        ) : (
          <button
            type="button"
            className={`add${inStack ? " added" : ""}`}
            onClick={() => onToggleStack(tool.id)}
          >
            {inStack ? "✓ Di stack — hapus" : "+ Stack"}
          </button>
        )}
        <button type="button" className="detail" onClick={() => setOpen((o) => !o)}>
          {open ? "Tutup" : "Detail"}
        </button>
      </div>
    </article>
  );
}

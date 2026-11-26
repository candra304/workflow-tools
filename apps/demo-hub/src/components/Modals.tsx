import type { Demo } from "@workflow-tools/data";
import { demoThemeStyle, useClipboard } from "@workflow-tools/ui";
import { ThumbArt } from "../lib/thumb";
import { demoLink } from "../lib/filter";

export interface ModalsProps {
  demo: Demo | null;
  modal: "preview" | "code" | null;
  onClose: () => void;
  onSwitch: (m: "preview" | "code") => void;
  showToast: (msg: string) => void;
}

/** Modal Lihat Demo + modal Lihat Kode — tema ikut demo yang dibuka. */
export function Modals({ demo, modal, onClose, onSwitch, showToast }: ModalsProps) {
  const copy = useClipboard();
  if (!demo) return null;
  const copyLink = () => copy(demoLink(demo), () => showToast(`Link demo ${demo.title} disalin`));

  return (
    <>
      <div
        className={`overlay${modal === "preview" ? " open" : ""}`}
        id="previewOverlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pvTitle"
        style={demoThemeStyle(demo.theme)}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="modal">
          <div className="modal-head">
            <div>
              <h3 id="pvTitle">{demo.title}</h3>
              <div className="sub">
                {demo.cat} · {demo.dateLabel} · {demo.stacks.join(" · ")}
              </div>
            </div>
            <button className="close-btn" type="button" aria-label="Tutup preview" onClick={onClose}>
              ✕
            </button>
          </div>
          <div className="modal-body">
            <div className="preview-frame">
              <div className="pf-top">
                <i />
                <i />
                <i />
                <span className="pf-url">demo/{demo.id}</span>
              </div>
              <div className="preview-stage" style={{ minHeight: 190 }}>
                <ThumbArt type={demo.thumb} />
              </div>
            </div>
            <p className="desc">{demo.desc}</p>
            <div className="prompt-box" style={{ marginTop: 14 }}>
              <span className="p-label">Prompt yang dipakai</span>
              <p style={{ WebkitLineClamp: "unset" }}>“{demo.prompt}”</p>
            </div>
            <div className="tags" style={{ marginTop: 12 }}>
              {demo.stacks.map((s) => (
                <span className="tag" key={s}>
                  {s}
                </span>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" type="button" onClick={() => onSwitch("code")}>
                Lihat Kode
              </button>
              <button className="btn btn-ghost" type="button" onClick={copyLink}>
                Salin Link Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`overlay${modal === "code" ? " open" : ""}`}
        id="codeOverlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cdTitle"
        style={demoThemeStyle(demo.theme)}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="modal">
          <div className="modal-head">
            <div>
              <h3 id="cdTitle">Kode — {demo.title}</h3>
              <div className="sub">
                {demo.dateLabel} · cuplikan inti demo
              </div>
            </div>
            <button className="close-btn" type="button" aria-label="Tutup kode" onClick={onClose}>
              ✕
            </button>
          </div>
          <div className="modal-body">
            <div className="code-meta">
              <span>{demo.codeLang}</span>
              <button
                className="btn btn-ghost"
                type="button"
                style={{ flex: "none", minHeight: 40 }}
                onClick={() => copy(demo.code, () => showToast(`Kode ${demo.title} disalin`))}
              >
                Salin Kode
              </button>
            </div>
            <pre className="code">
              <code>{demo.code}</code>
            </pre>
            <div className="modal-actions">
              <button className="btn btn-primary" type="button" onClick={() => onSwitch("preview")}>
                Lihat Demo
              </button>
              <button className="btn btn-ghost" type="button" onClick={copyLink}>
                Salin Link Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

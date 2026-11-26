import type { Demo } from "@workflow-tools/data";
import { demoThemeStyle, useClipboard } from "@workflow-tools/ui";
import { ThumbArt } from "../lib/thumb";
import { demoLink } from "../lib/filter";
import { getCustomLink, getEffectiveHosting, resolveDemoUrl } from "../lib/hosting";

export interface ModalsProps {
  demo: Demo | null;
  modal: "preview" | null;
  onClose: () => void;
  showToast: (msg: string) => void;
}

/**
 * Modal Lihat Demo — tema ikut demo yang dibuka.
 * Tanpa modal Kode: Demo Hub hanya menampilkan demo, bukan kodenya.
 * Modal menampilkan hosting yang berlaku + Custom Link demo ini, dan
 * tombol Buka Link Demo membuka Custom Link kalau ada.
 */
export function Modals({ demo, modal, onClose, showToast }: ModalsProps) {
  const copy = useClipboard();
  if (!demo) return null;
  const copyLink = () => copy(demoLink(demo), () => showToast(`Link demo ${demo.title} disalin`));
  const effective = getEffectiveHosting(demo.id);
  const custom = getCustomLink(demo.id);

  const handleOpenDemo = () => {
    const url = resolveDemoUrl(demo);
    if (url) {
      window.open(url, "_blank", "noopener");
      return;
    }
    onClose();
    showToast(`Belum ada Custom Link — tempel link di kartu ${demo.title} dulu ya`);
  };

  return (
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
              <span className="pf-url">
                {custom || `demo/${demo.id} · hosting: ${effective.name}`}
              </span>
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
          <div className="pv-hosting">
            <span>
              Hosting aktif: <b>{effective.name}</b> — {effective.note}{" "}
              <a href={effective.url} target="_blank" rel="noopener">
                Kunjungi hosting
              </a>
            </span>
            {custom ? (
              <span>
                Custom Link kamu:{" "}
                <a href={custom} target="_blank" rel="noopener">
                  {custom}
                </a>
              </span>
            ) : (
              <span>
                Belum ada Custom Link untuk demo ini. Tempel link kamu di kolom Custom Link pada kartu demo —
                setelah itu tombol Lihat Demo langsung membuka link tersebut.
              </span>
            )}
          </div>
          <p className="generic-note">
            Contoh struktur generic: <code>&lt;section&gt; judul + isi + tombol &lt;/section&gt;</code> — untuk
            membuka versi live-nya, pakai tombol Buka Link Demo di atas atau Custom Link di kartu demo.
          </p>
          <div className="modal-actions">
            <button className="btn btn-primary" type="button" onClick={handleOpenDemo}>
              {custom ? "Buka Link Demo" : "Isi Custom Link Dulu di Kartu"}
            </button>
            <button className="btn btn-ghost" type="button" onClick={copyLink}>
              Salin Link Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

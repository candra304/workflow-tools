import { useState } from "react";
import type { Demo } from "@workflow-tools/data";
import { hostings } from "@workflow-tools/data";
import { demoThemeStyle, useClipboard } from "@workflow-tools/ui";
import { ThumbArt } from "../lib/thumb";
import { demoLink } from "../lib/filter";
import {
  deleteCustomLink,
  getCustomLink,
  getDemoHostingId,
  getEffectiveHosting,
  normalizeUrl,
  resolveDemoUrl,
  setCustomLink,
  setDemoHostingId,
} from "../lib/hosting";

export type DemoAction = "preview";

/**
 * Satu kartu demo — tema ikut kategori demo (variabel --a* dari data).
 * Tanpa tombol Kode: Demo Hub hanya menampilkan demo, bukan kodenya.
 * Tiap kartu punya pemilih hosting sendiri + kolom Custom Link yang
 * tersimpan di localStorage browser ini (mdh_host_<id> / mdh_custom_<id>).
 */
export function DemoCard({
  demo,
  onAction,
  showToast,
  defaultHostingId,
}: {
  demo: Demo;
  onAction: (action: DemoAction, demo: Demo) => void;
  showToast: (msg: string) => void;
  /** id hosting default saat ini — berubah saat user ganti di "Pilih Hosting" */
  defaultHostingId: string;
}) {
  const copy = useClipboard();
  const [hostSel, setHostSel] = useState(() => getDemoHostingId(demo.id));
  const [customInput, setCustomInput] = useState(() => getCustomLink(demo.id));
  const [savedCustom, setSavedCustom] = useState(() => getCustomLink(demo.id));

  const effective = getEffectiveHosting(demo.id);
  const statusCls = demo.status === "Live" ? "" : " proses";

  const handleLihatDemo = () => {
    const url = resolveDemoUrl(demo);
    if (url) {
      window.open(url, "_blank", "noopener");
      return;
    }
    onAction("preview", demo);
  };

  const handleSaveCustom = () => {
    const val = normalizeUrl(customInput);
    if (!val) {
      showToast("Link tidak valid — tempel URL lengkap ya");
      return;
    }
    setCustomLink(demo.id, val);
    setCustomInput(val);
    setSavedCustom(val);
    showToast("Custom Link tersimpan untuk demo ini");
  };

  const handleOpenCustom = () => {
    if (savedCustom) {
      window.open(savedCustom, "_blank", "noopener");
      return;
    }
    const val = normalizeUrl(customInput);
    if (val) {
      setCustomLink(demo.id, val);
      setCustomInput(val);
      setSavedCustom(val);
      window.open(val, "_blank", "noopener");
      return;
    }
    showToast("Tempel Custom Link dulu, lalu klik Simpan / Buka Link");
  };

  const handleDeleteCustom = () => {
    deleteCustomLink(demo.id);
    setCustomInput("");
    setSavedCustom("");
    showToast("Custom Link dihapus");
  };

  const handleHostChange = (value: string) => {
    setDemoHostingId(demo.id, value);
    setHostSel(value);
    const h = getEffectiveHosting(demo.id);
    showToast(`Hosting demo ini: ${h.name}`);
  };

  return (
    <article className="card" id={`demo-${demo.id}`} style={demoThemeStyle(demo.theme)}>
      <div className="thumb" aria-hidden="true">
        <ThumbArt type={demo.thumb} />
        <span className={`badge-status${statusCls}`}>{demo.status}</span>
        <span className="cat-badge">{demo.cat}</span>
      </div>
      <div className="card-body">
        <div className="card-head">
          <h3>{demo.title}</h3>
          <span className="card-date">{demo.dateLabel}</span>
        </div>
        <p className="card-desc">{demo.desc}</p>
        <div className="prompt-box">
          <span className="p-label">Prompt</span>
          <p>“{demo.prompt}”</p>
        </div>
        <div className="tags">
          {demo.stacks.map((s, i) => (
            <span className={`tag${i === 0 ? " hot" : ""}`} key={s}>
              {s}
            </span>
          ))}
        </div>

        <div className="hosting-box">
          <span className="hb-label">Hosting demo ini</span>
          <select
            className="host-select"
            aria-label={`Pilih hosting untuk ${demo.title}`}
            value={hostSel}
            onChange={(e) => handleHostChange(e.target.value)}
          >
            <option value="">
              Ikut default: {hostings.find((h) => h.id === defaultHostingId)?.name ?? "-"}
            </option>
            {hostings.map((h) => (
              <option value={h.id} key={h.id}>
                {h.name}
              </option>
            ))}
          </select>
          <p className="host-note-line" style={{ margin: 0 }}>
            <a href={effective.url} target="_blank" rel="noopener">
              {effective.name}
            </a>{" "}
            — {effective.note}
          </p>
          <span className="hb-label">Custom Link</span>
          <div className="custom-row">
            <input
              className="custom-input"
              type="url"
              inputMode="url"
              placeholder="https://link-demo-kamu.com"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              aria-label={`Custom link untuk ${demo.title}`}
            />
          </div>
          <div className="custom-row">
            <button className="btn btn-ghost btn-small" type="button" onClick={handleSaveCustom}>
              Simpan Link
            </button>
            <button className="btn btn-primary btn-small" type="button" onClick={handleOpenCustom}>
              Buka Link
            </button>
            {savedCustom ? (
              <button className="btn btn-ghost btn-small" type="button" onClick={handleDeleteCustom}>
                Hapus
              </button>
            ) : null}
          </div>
          <p className="custom-status" style={{ margin: 0 }}>
            {savedCustom ? (
              <>
                Tersimpan:{" "}
                <a href={savedCustom} target="_blank" rel="noopener">
                  {savedCustom}
                </a>
              </>
            ) : (
              <>
                Belum ada custom link — tempel link demo kamu, atau pakai hosting <b>{effective.name}</b>.
              </>
            )}
          </p>
        </div>

        <div className="card-actions">
          <button className="btn btn-primary" type="button" onClick={handleLihatDemo}>
            <svg viewBox="0 0 24 24">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Lihat Demo
          </button>
          <button
            className="btn btn-ghost btn-icon"
            type="button"
            aria-label={`Salin link demo ${demo.title}`}
            title="Salin Link"
            onClick={() => copy(demoLink(demo), () => showToast(`Link demo ${demo.title} disalin`))}
          >
            <svg viewBox="0 0 24 24">
              <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
              <path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

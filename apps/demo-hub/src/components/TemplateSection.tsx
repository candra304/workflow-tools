import { useState } from "react";
import { templates, type Demo } from "@workflow-tools/data";
import {
  TIKTOK_HANDLE,
  TIKTOK_URL,
  X_HANDLE,
  X_URL,
  downloadTemplate,
  setTplFollow,
  tplFollow,
  tplTaken,
  tplUnlocked,
} from "../lib/templates";

export interface TemplateSectionProps {
  /** Dipanggil tombol "Buka Template" — App membuka preview demo terkait. */
  onOpenDemo: (demo: Demo) => void;
  /** Cari demo bawaan/tambahan berdasarkan id (untuk demoId template). */
  findDemo: (id: string) => Demo | null;
  showToast: (msg: string) => void;
}

/**
 * Seksi khusus "Template Eksklusif — 1 of 1" (di-port dari Demo Hub
 * single-file). Tiap template hanya dibuat SEKALI: tidak ada tombol
 * duplikat / salin / copy, dan sekali di-download statusnya permanen
 * jadi "Sudah Diambil". Buka & Download baru aktif setelah pengunjung
 * follow X + TikTok dan mencentang sendiri kedua konfirmasinya.
 */
export function TemplateSection({ onOpenDemo, findDemo, showToast }: TemplateSectionProps) {
  // State lokal hanya untuk memicu render ulang saat follow/taken berubah.
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  const handleFollowChange = (tplId: string, key: "x" | "tt", checked: boolean) => {
    if (tplTaken(tplId)) return;
    const f = tplFollow(tplId);
    if (key === "x") f.x = checked;
    else f.tt = checked;
    setTplFollow(tplId, f);
    refresh();
    if (f.x && f.tt) showToast("Konfirmasi follow lengkap — tombol Buka & Download aktif");
  };

  const handleOpen = (tplId: string) => {
    const t = templates.find((x) => x.id === tplId);
    if (!t || tplTaken(t.id) || !tplUnlocked(t.id)) return;
    const d = findDemo(t.demoId);
    if (d) onOpenDemo(d);
  };

  const handleDownload = (tplId: string) => {
    const t = templates.find((x) => x.id === tplId);
    if (!t || tplTaken(t.id) || !tplUnlocked(t.id)) return;
    downloadTemplate(t);
    refresh();
    showToast(`Template "${t.title}" sudah kamu ambil — status: Sudah Diambil`);
  };

  return (
    <section className="tpl-section" aria-labelledby="tplTitle">
      <div className="block-head">
        <h2 id="tplTitle">Template Eksklusif — 1 of 1</h2>
        <p>
          Tempat khusus template yang hanya dibuat <strong>SEKALI</strong>. Tiap template di sini 1 of 1: tidak ada
          tombol duplikat / salin / copy, dan sekali diambil orang, statusnya jadi <strong>Sudah Diambil</strong> dan
          tidak bisa di-download lagi.
        </p>
      </div>
      <div className="tpl-grid" id="tplGrid">
        {templates.map((t) => {
          const taken = tplTaken(t.id);
          const f = tplFollow(t.id);
          const gateDisabled = taken || !(f.x && f.tt);
          return (
            <article className={`tpl-card${taken ? " taken" : ""}`} key={t.id}>
              <div className="tpl-badges">
                <span className="tpl-badge">1 of 1 — Sekali Buat</span>
                <span className={`tpl-status${taken ? " taken" : ""}`}>{taken ? "Sudah Diambil" : "Tersedia"}</span>
              </div>
              <h3>{t.title}</h3>
              <p>
                <strong style={{ color: "var(--text)" }}>{t.cat}</strong> · {t.desc}
              </p>
              <div className="tags">
                {t.stacks.map((s) => (
                  <span className="tag" key={s}>
                    {s}
                  </span>
                ))}
              </div>
              <div className="follow-box">
                <span className="fb-label">Syarat buka &amp; download — follow dulu</span>
                <div className="follow-btns">
                  <a className="btn btn-ghost btn-small" href={X_URL} target="_blank" rel="noopener">
                    Follow X · {X_HANDLE}
                  </a>
                  <a className="btn btn-ghost btn-small" href={TIKTOK_URL} target="_blank" rel="noopener">
                    Follow TikTok · {TIKTOK_HANDLE}
                  </a>
                </div>
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={f.x}
                    disabled={taken}
                    onChange={(e) => handleFollowChange(t.id, "x", e.target.checked)}
                  />
                  <span>Saya sudah follow X</span>
                </label>
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={f.tt}
                    disabled={taken}
                    onChange={(e) => handleFollowChange(t.id, "tt", e.target.checked)}
                  />
                  <span>Saya sudah follow TikTok</span>
                </label>
              </div>
              <div className="card-actions">
                <button className="btn btn-ghost" type="button" disabled={gateDisabled} onClick={() => handleOpen(t.id)}>
                  Buka Template
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  disabled={gateDisabled}
                  onClick={() => handleDownload(t.id)}
                >
                  {taken ? "Sudah Diambil" : "Download"}
                </button>
              </div>
              {taken ? (
                <p className="tpl-note">
                  Template 1 of 1 ini sudah diambil — tidak bisa dibuka / di-download lagi dan tidak dibuat ulang.
                </p>
              ) : (
                <p className="tpl-note">
                  Sekali di-download, status berubah jadi <strong>Sudah Diambil</strong> dan template ini tidak
                  tersedia lagi. Template eksklusif tidak punya tombol duplikat / salin.
                </p>
              )}
            </article>
          );
        })}
      </div>
      <p className="honest-note">
        <strong style={{ color: "var(--muted)" }}>Catatan jujur soal cek follow:</strong> tombol Buka &amp; Download
        template hanya aktif setelah kamu follow dan mencentang sendiri dua kotak konfirmasi di kartunya. X dan TikTok
        tidak mengizinkan pengecekan follow otomatis tanpa login / API resmi, jadi sistem di halaman ini percaya pada
        centang kejujuranmu — tidak ada verifikasi otomatis ke akun X / TikTok kamu.
      </p>
    </section>
  );
}

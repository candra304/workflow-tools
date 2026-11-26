import { useState } from "react";
import { hostings, type Demo } from "@workflow-tools/data";
import { normalizeUrl, setCustomLink, setDemoHostingId } from "../lib/hosting";
import {
  ADD_CATEGORIES,
  STACK_OPTIONS,
  buildUserDemo,
  todayParts,
} from "../lib/userDemos";

export interface AddResultModalProps {
  open: boolean;
  onClose: () => void;
  /** Dipanggil setelah hasil baru tersimpan (App menambahkannya ke grid). */
  onAdded: (demo: Demo) => void;
  showToast: (msg: string) => void;
}

/**
 * Modal "Tambah Hasil" — form hasil yang sudah jadi (di-port dari Demo Hub
 * single-file). Tanggal otomatis hari ini; hasil baru langsung muncul
 * sebagai kartu demo baru dan tersimpan di localStorage (mdh_user_demos).
 */
export function AddResultModal({ open, onClose, onAdded, showToast }: AddResultModalProps) {
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState(ADD_CATEGORIES[0]);
  const [pickedStacks, setPickedStacks] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [desc, setDesc] = useState("");
  const [hostingSel, setHostingSel] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;
  const today = todayParts();

  const toggleStack = (s: string) => {
    setPickedStacks((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const resetForm = () => {
    setTitle("");
    setCat(ADD_CATEGORIES[0]);
    setPickedStacks([]);
    setPrompt("");
    setDesc("");
    setHostingSel("");
    setCustomInput("");
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    const p = prompt.trim();
    const d = desc.trim();
    const customRaw = customInput.trim();
    const custom = customRaw ? normalizeUrl(customRaw) : "";
    if (!t) {
      setError("Judul hasil belum diisi.");
      return;
    }
    if (!pickedStacks.length) {
      setError("Pilih minimal 1 stack yang dipakai.");
      return;
    }
    if (!p) {
      setError("Prompt yang dipakai belum diisi.");
      return;
    }
    if (customRaw && !custom) {
      setError("Custom Link tidak valid — tempel URL lengkap, misal https://contoh.com");
      return;
    }
    setError("");
    const demo = buildUserDemo({ title: t, prompt: p, desc: d, cat, stacks: pickedStacks });
    if (hostingSel) setDemoHostingId(demo.id, hostingSel);
    if (custom) setCustomLink(demo.id, custom);
    resetForm();
    onAdded(demo);
    showToast(`Hasil baru ditambahkan: ${t}`);
  };

  return (
    <div
      className="overlay open"
      id="addOverlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="addTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <div className="modal-head">
          <div>
            <h3 id="addTitle">Tambah Hasil</h3>
            <div className="sub">Hasil yang sudah jadi → langsung jadi kartu demo baru</div>
          </div>
          <button className="close-btn" type="button" aria-label="Tutup form tambah hasil" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className={`f-error${error ? " show" : ""}`} id="fError" role="alert">
                {error}
              </div>
              <div className="f-field">
                <label htmlFor="fTitle">Judul hasil *</label>
                <input
                  className="f-input"
                  id="fTitle"
                  type="text"
                  placeholder="Misal: Landing Page Toko Kopi"
                  autoComplete="off"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="f-field">
                <label htmlFor="fCat">Kategori / niche *</label>
                <select className="f-select" id="fCat" value={cat} onChange={(e) => setCat(e.target.value)}>
                  {ADD_CATEGORIES.map((c) => (
                    <option value={c} key={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="f-field">
                <label>
                  Stack yang dipakai * <span className="f-note">— ketuk untuk memilih, bisa lebih dari satu</span>
                </label>
                <div className="stack-pick" id="fStacks">
                  {STACK_OPTIONS.map((s) => {
                    const on = pickedStacks.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        className="chip"
                        data-stack-pick={s}
                        aria-pressed={on}
                        onClick={() => toggleStack(s)}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="f-field">
                <label htmlFor="fPrompt">Prompt yang dipakai *</label>
                <textarea
                  className="f-textarea"
                  id="fPrompt"
                  placeholder="Tulis prompt asli yang kamu pakai untuk membuat hasil ini…"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <div className="f-field">
                <label htmlFor="fDesc">
                  Deskripsi singkat <span className="f-note">(opsional — kosongkan untuk memakai prompt sebagai deskripsi)</span>
                </label>
                <textarea
                  className="f-textarea"
                  id="fDesc"
                  placeholder="Satu-dua kalimat tentang hasil ini…"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
              <div className="f-field">
                <label htmlFor="fDate">Tanggal dibuat</label>
                <input className="f-input" id="fDate" type="text" readOnly value={`${today.full} — otomatis hari ini`} />
                <span className="f-note">Otomatis terisi tanggal hari ini.</span>
              </div>
              <div className="f-field">
                <label htmlFor="fHosting">Hosting demo</label>
                <select className="f-select" id="fHosting" value={hostingSel} onChange={(e) => setHostingSel(e.target.value)}>
                  <option value="">Ikut hosting default</option>
                  {hostings.map((h) => (
                    <option value={h.id} key={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
                <span className="f-note">
                  Pilih dari 10 hosting gratisan, atau tempel Custom Link di bawah — Custom Link selalu jadi jalur buka
                  utamanya.
                </span>
              </div>
              <div className="f-field">
                <label htmlFor="fCustom">
                  Custom Link demo <span className="f-note">(opsional)</span>
                </label>
                <input
                  className="f-input"
                  id="fCustom"
                  type="url"
                  inputMode="url"
                  placeholder="https://link-demo-kamu.com"
                  autoComplete="off"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                />
              </div>
              <div className="modal-actions" style={{ marginTop: 2 }}>
                <button className="btn btn-primary" type="submit">
                  Simpan &amp; Tampilkan
                </button>
                <button className="btn btn-ghost" type="button" onClick={onClose}>
                  Batal
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

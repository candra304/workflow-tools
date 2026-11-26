import { languages } from "@workflow-tools/data";

/**
 * Hero Demo Hub — angka dihitung dari data (jumlah demo & bahasa).
 * demoCount = demo bawaan + hasil tambahan user; onAdd membuka form
 * "Tambah Hasil".
 */
export function Hero({ demoCount, onAdd }: { demoCount?: number; onAdd: () => void }) {
  return (
    <header className="hero">
      <div className="hero-top">
        <span className="live-dot">
          <i />
          Demo Hub Aktif
        </span>
        <span className="hero-date">Terakhir diperbarui · 26 Nov 2026</span>
      </div>
      <h1>
        Semua hasil prompt, <span className="hl">tampil di satu tempat.</span>
      </h1>
      <p className="hero-sub">
        Kamu kasih perintah lewat aplikasi Muse, perintah itu dieksekusi di berbagai tools di balik layar —{" "}
        <strong>hasil jadinya muncul di sini</strong> sebagai demo yang bisa langsung dibuka lewat hosting
        pilihanmu, lengkap dengan prompt, stack, dan tanggalnya.
      </p>
      <div className="stats">
        <div className="stat">
          <b>{demoCount ?? 0}</b>
          <span>Demo tampil</span>
        </div>
        <div className="stat">
          <b>
            {languages.length}
            <em>+</em>
          </b>
          <span>Bahasa &amp; stack ditampung</span>
        </div>
        <div className="stat">
          <b>3</b>
          <span>Langkah dari prompt ke demo</span>
        </div>
      </div>
      <div className="flow" aria-label="Alur kerja">
        <span className="step">
          <b>01</b> Prompt di aplikasi Muse
        </span>
        <span className="arrow">→</span>
        <span className="step">
          <b>02</b> Eksekusi di tools di balik layar
        </span>
        <span className="arrow">→</span>
        <span className="step">
          <b>03</b> Hasil tampil di Demo Hub ini
        </span>
      </div>
      <div className="add-cta">
        <button className="btn btn-primary" type="button" onClick={onAdd} style={{ flex: "none" }}>
          ＋ Tambah Hasil
        </button>
        <span className="hint">
          Hasil yang sudah jadi bisa kamu tambahkan sendiri — langsung muncul sebagai kartu demo baru, tersimpan di
          browser ini, dan bisa kamu hapus kapan saja.
        </span>
      </div>
    </header>
  );
}

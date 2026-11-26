import { hostings } from "@workflow-tools/data";
import { getDefaultHosting, setDefaultHostingId } from "../lib/hosting";

/**
 * Pilih Hosting — grid 10 hosting gratisan populer.
 * Klik satu kartu = jadikan hosting default (tersimpan di localStorage
 * kunci mdh_default_hosting). Link "Kunjungi situs" membuka situs
 * hosting tanpa mengubah pilihan.
 */
export function HostingPicker({ onDefaultChange }: { onDefaultChange: () => void }) {
  const current = getDefaultHosting();
  return (
    <section className="hosting-section" aria-labelledby="hostingTitle">
      <h2 id="hostingTitle">Pilih Hosting — bebas sesuai maumu</h2>
      <p className="lead">
        Pilih 1 dari 10 hosting gratisan populer di bawah ini sebagai <strong>hosting default</strong>. Tempel
        hasil deploy kamu sebagai <strong>Custom Link</strong> di tiap kartu — setelah itu semua tombol{" "}
        <strong>Lihat Demo</strong> langsung membuka link tersebut lewat hosting pilihanmu. Kalau link untuk
        hosting default belum ada, Lihat Demo membuka preview di halaman ini dan Custom Link jadi jalur bukanya.
      </p>
      <div className="hosting-current">
        Hosting default saat ini: <b>{current.name}</b> — {current.note}{" "}
        <a href={current.url} target="_blank" rel="noopener">
          Kunjungi {current.name}
        </a>
      </div>
      <div className="hosting-grid">
        {hostings.map((h, idx) => (
          <button
            type="button"
            className={`host-card${h.id === current.id ? " active" : ""}`}
            key={h.id}
            aria-pressed={h.id === current.id}
            onClick={() => {
              setDefaultHostingId(h.id);
              onDefaultChange();
            }}
          >
            <span className="h-name">
              {idx + 1}. {h.name}
              <span className="h-badge">Default</span>
            </span>
            <span className="h-note">{h.note}</span>
            <span
              className="h-visit"
              role="link"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(h.url, "_blank", "noopener");
              }}
            >
              Kunjungi situs ↗
            </span>
          </button>
        ))}
      </div>
      <p className="lead" style={{ marginTop: 12 }}>
        Di tiap kartu demo kamu juga bisa pilih hosting yang beda khusus untuk demo itu, plus tempel{" "}
        <strong>Custom Link</strong> sendiri (URL apa saja). Custom Link tersimpan otomatis di browser ini dan
        bisa diedit atau dihapus kapan saja.
      </p>
    </section>
  );
}

import { demos, languages, themesData, type Demo } from "@workflow-tools/data";

/** Legenda tema — data dari packages/data/themes.json. */
export function ThemeLegend() {
  return (
    <section className="block" aria-labelledby="themeTitle">
      <div className="block-head">
        <h2 id="themeTitle">Tema ngikutin niche-nya</h2>
        <p>Base hub ini netral premium — yang berubah warna adalah tiap kartu, sesuai kategori demonya.</p>
      </div>
      <div className="theme-grid">
        {themesData.demoHub.map((t) => (
          <div className="theme-card" key={t.name}>
            <div className="swatches">
              <i style={{ background: t.swatches[0] }} />
              <i style={{ background: t.swatches[1] }} />
            </div>
            <div>
              <b>{t.name}</b>
              <span>{t.note}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Semua bahasa ditampung — data dari packages/data/languages.json.
 * Klik satu bahasa langsung memfilter demo (bahasa tanpa filter hanya
 * menampilkan "siap dipakai"). Hitungan per bahasa memakai semua demo
 * yang tampil (bawaan + hasil tambahan user).
 */
export function LanguageGrid({ onFilter, demos: allDemos }: { onFilter: (f: string) => void; demos?: Demo[] }) {
  const shown = allDemos ?? demos;
  return (
    <section className="block" aria-labelledby="langTitle">
      <div className="block-head">
        <h2 id="langTitle">Semua bahasa ditampung</h2>
        <p>Demo dari tools mana pun bisa masuk — klik satu bahasa buat langsung memfilter demonya.</p>
      </div>
      <div className="lang-grid" id="langGrid">
        {languages.map((l) => {
          const count = l.filter ? shown.filter((d) => d.stacks.includes(l.filter!)).length : 0;
          const inner = (
            <>
              <b>
                <i style={{ background: l.color }} />
                {l.name}
              </b>
              <span>{l.note}</span>
              {l.filter ? <span className="cnt">{count} demo</span> : <span className="cnt">siap dipakai</span>}
            </>
          );
          return l.filter ? (
            <button
              type="button"
              className="lang"
              data-langfilter={l.filter}
              key={l.name}
              onClick={() => {
                onFilter(l.filter!);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {inner}
            </button>
          ) : (
            <div className="lang" key={l.name}>
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Cara demo baru masuk — 3 langkah (copy halaman, bukan data katalog). */
export function HowItWorks() {
  return (
    <section className="block" aria-labelledby="howTitle">
      <div className="block-head">
        <h2 id="howTitle">Cara demo baru masuk ke sini</h2>
      </div>
      <div className="steps">
        <div className="step-card">
          <span className="num">LANGKAH 01</span>
          <h3>Tulis prompt di Muse</h3>
          <p>
            Cukup perintah biasa, misalnya “buatkan katalog tools dengan filter dan generator stack”. Nggak perlu
            tahu kodenya.
          </p>
        </div>
        <div className="step-card">
          <span className="num">LANGKAH 02</span>
          <h3>Muse eksekusi di tools</h3>
          <p>
            Di balik layar Muse memilih tools yang pas — HTML, React, Python, 3D, animasi — lalu membangun
            hasilnya sampai jadi.
          </p>
        </div>
        <div className="step-card">
          <span className="num">LANGKAH 03</span>
          <h3>Demo tampil di hub ini</h3>
          <p>
            Hasilnya jadi kartu baru di halaman ini, lengkap dengan prompt aslinya, stack yang dipakai, pilihan
            hosting, dan kolom custom link buat link demo versi kamu sendiri.
          </p>
        </div>
      </div>
    </section>
  );
}

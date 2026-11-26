import { patterns, type Pattern, type PatternId } from "@workflow-tools/data";
import { Chip } from "@workflow-tools/ui";

/**
 * Animasi mini tiap pola — presentasi murni, dipilih berdasarkan id pola.
 * (Di versi single-file animasi ini tersimpan sebagai string HTML di data;
 * di sini ia tinggal di komponen, tempat presentasi seharusnya berada.)
 */
function PatternAnim({ id }: { id: PatternId }) {
  if (id === "drive") return <span className="anim-car">🛻</span>;
  if (id === "scroll")
    return (
      <>
        <div className="anim-film" />
        <div className="anim-film-txt">SCROLL</div>
      </>
    );
  if (id === "config") return <div className="anim-conf" />;
  return (
    <div className="anim-keys">
      <i />
      <i />
      <i />
      <i />
      <i />
      <i />
    </div>
  );
}

export function PatternCard({
  pattern,
  active,
  onSelect,
}: {
  pattern: Pattern;
  active: boolean;
  onSelect: (p: Pattern) => void;
}) {
  return (
    <button
      type="button"
      className={`pattern pattern--${pattern.id}${active ? " active" : ""}`}
      aria-pressed={active}
      onClick={() => onSelect(pattern)}
    >
      <div className="p-anim">
        <PatternAnim id={pattern.id} />
      </div>
      <h3>{pattern.name}</h3>
      <p className="p-like">{pattern.like}</p>
      <p>{pattern.desc}</p>
      <div className="p-meta">
        <Chip tone="lime">{pattern.stack.length} tools optimal</Chip>
        <Chip>Estimasi {pattern.time}</Chip>
        <Chip tone="warn">Level: {pattern.level}</Chip>
      </div>
      <span className="p-cta">{active ? "✓ Stack pola ini aktif" : "Pakai stack pola ini →"}</span>
    </button>
  );
}

export function PatternPicker({
  activePattern,
  onSelect,
}: {
  activePattern: PatternId | null;
  onSelect: (p: Pattern) => void;
}) {
  return (
    <section id="pola">
      <div className="sec-head">
        <span className="sec-num">01</span>
        <h2>Pattern Picker</h2>
      </div>
      <p className="sec-desc">
        Pilih 1 pola super interaktif yang sudah terbukti jalan di web pemenang penghargaan. Sekali klik, Stack
        Generator langsung terisi stack optimalnya (7–9 tools). Setelah itu kamu boleh tukar 1–2 tools manual
        dari katalog.
      </p>
      <div className="patterns" id="patterns">
        {patterns.map((p) => (
          <PatternCard key={p.id} pattern={p} active={activePattern === p.id} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}

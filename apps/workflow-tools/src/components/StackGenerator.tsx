import { patternNames, toolsById, type PatternId } from "@workflow-tools/data";
import { useClipboard } from "@workflow-tools/ui";
import { buildChecklist, buildCommand, conflicts, MAX_STACK } from "../lib/stack";

export interface StackGeneratorProps {
  stack: string[];
  activePattern: PatternId | null;
  doneSteps: Record<number, boolean>;
  onToggleDone: (i: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  showToast: (msg: string) => void;
}

/**
 * Stack Generator — perintah npm install gabungan + checklist build +
 * conflict check otomatis (2 UI Kit / 2 set 3D / >12 tools).
 * Logika ada di src/lib/stack.ts; komponen ini hanya menampilkan.
 */
export function StackGenerator({
  stack,
  activePattern,
  doneSteps,
  onToggleDone,
  onRemove,
  onClear,
  showToast,
}: StackGeneratorProps) {
  const copy = useClipboard();
  const warns = conflicts(stack);
  const cmd = stack.length ? buildCommand(stack) : "# Pilih pola di atas, atau tambah tools dari katalog…";
  const checklist = buildChecklist(stack, activePattern);

  const copyCmd = () => {
    if (!stack.length) return;
    copy(cmd, () => showToast("Perintah install tersalin"));
  };

  return (
    <section id="generator">
      <div className="sec-head">
        <span className="sec-num">02</span>
        <h2>Stack Generator</h2>
      </div>
      <p className="sec-desc">
        Stack aktif kamu. Generator mengeluarkan satu perintah <span className="mono">npm install</span> gabungan
        + checklist build. Ada conflict check otomatis: tidak boleh 2 UI Kit, tidak boleh 2 set 3D.
      </p>
      <div className="gen">
        <div className="gen-top">
          <div className={`gen-count${stack.length > MAX_STACK ? " over" : ""}`} id="genCount">
            Stack: <b>{stack.length}</b> / {MAX_STACK} tools
            {activePattern ? (
              <>
                {" "}
                &middot; Pola aktif: <b style={{ fontSize: 14 }}>{patternNames[activePattern]}</b>
              </>
            ) : null}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn" id="clearStack" type="button" onClick={onClear}>
              Bersihkan stack
            </button>
            <button className="btn lime" id="copyCmdTop" type="button" onClick={copyCmd}>
              Salin perintah install
            </button>
          </div>
        </div>
        <div className="stack-chips" id="stackChips">
          {stack.length === 0 ? (
            <span className="stack-empty">
              Stack masih kosong — pilih pola di atas, atau tekan “+ Stack” pada kartu tools di katalog.
            </span>
          ) : (
            stack.map((id) => {
              const t = toolsById[id];
              if (!t) return null;
              return (
                <span className="s-chip" key={id}>
                  {t.name}{" "}
                  <button type="button" aria-label={`Hapus ${t.name} dari stack`} onClick={() => onRemove(id)}>
                    ×
                  </button>
                </span>
              );
            })
          )}
        </div>
        <div className={`warn-box${warns.length ? " show" : ""}`} id="warnBox">
          {warns.map((w, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: `⚠ ${w}` }} />
          ))}
        </div>
        <div className="cmd-box">
          <button className="copy-btn" id="copyCmd" type="button" onClick={copyCmd}>
            Salin
          </button>
          <pre id="cmdOut">{cmd}</pre>
        </div>
        <div className="gen-grid">
          <div>
            <h4>Checklist build</h4>
            <ul className="checklist" id="checklist">
              {checklist.map((s, i) => (
                <li
                  key={i}
                  role="button"
                  tabIndex={0}
                  className={doneSteps[i] ? "done" : ""}
                  onClick={() => onToggleDone(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onToggleDone(i);
                    }
                  }}
                >
                  <span className="box">{doneSteps[i] ? "✓" : ""}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Aturan main</h4>
            <p className="gen-note">
              <b>Katalog boleh 42, build harus ramping.</b> Bundler hanya membungkus yang di-
              <span className="mono">import</span> — tools di katalog yang tidak dipilih tidak ikut ke build dan
              tidak membuat web berat. Yang membuat berat adalah <span className="mono">npm install</span>{" "}
              semuanya ke satu project. Makanya generator ini hanya mengeluarkan yang terpilih, maksimal 12.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { PAD_NOTES, playNote } from "../lib/audio";

/**
 * Demo mini pola Game / Instrument di Hero — tekan pad atau tombol
 * keyboard, tiap tombol bunyi + bentuk berbeda (konsep Patatap).
 * Warna tiap pad berasal dari CSS `.pad:nth-child(n)` di app.css.
 */
export function PatatapPads() {
  const [hitKey, setHitKey] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)) return;
      const k = e.key.toUpperCase();
      const note = PAD_NOTES.find((n) => n.key === k);
      if (note) hit(note.key, note.freq);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const hit = (key: string, freq: number) => {
    playNote(freq);
    setHitKey(key);
    window.setTimeout(() => setHitKey((cur) => (cur === key ? null : cur)), 180);
  };

  return (
    <div className="demo" aria-label="Demo mini pola Game Instrument">
      <div className="demo-head">
        <h3>Coba sendiri: pola Game / Instrument</h3>
        <p>
          Tekan pad atau tombol keyboard <span className="mono">A S D F J K L ;</span> — tiap tombol bunyi +
          bentuk berbeda, persis konsep Patatap.
        </p>
      </div>
      <div className="pads" id="pads">
        {PAD_NOTES.map((n) => (
          <button
            key={n.key}
            type="button"
            className={`pad${hitKey === n.key ? " hit" : ""}`}
            data-key={n.key}
            aria-label={`Pad nada ${n.key}`}
            onClick={() => hit(n.key, n.freq)}
          >
            {n.key}
            <span className="ring" />
          </button>
        ))}
      </div>
      <p className="demo-note">
        Ini bukti bedanya “interaktif” vs “animasi”: input kamu yang mengubah apa yang terjadi. WebAudio +
        Canvas/CSS, tanpa library tambahan.
      </p>
    </div>
  );
}

/**
 * Demo mini Patatap-style (WebAudio) di Hero — dipindah dari versi single-file.
 * Tiap pad = satu tombol keyboard (A S D F J K L ;) + satu nada + satu warna
 * tema kategori. Tanpa library tambahan.
 */

export interface PadNote {
  key: string;
  freq: number;
}

export const PAD_NOTES: PadNote[] = [
  { key: "A", freq: 261.63 },
  { key: "S", freq: 293.66 },
  { key: "D", freq: 329.63 },
  { key: "F", freq: 349.23 },
  { key: "J", freq: 392.0 },
  { key: "K", freq: 440.0 },
  { key: "L", freq: 493.88 },
  { key: ";", freq: 523.25 },
];

let ctx: AudioContext | null = null;

function ensureCtx(): AudioContext | null {
  if (!ctx) {
    try {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Mainkan satu nada segitiga 0,6 detik. Mengembalikan false bila audio tak tersedia. */
export function playNote(freq: number): boolean {
  const c = ensureCtx();
  if (!c) return false;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "triangle";
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.22, c.currentTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.55);
  o.connect(g);
  g.connect(c.destination);
  o.start();
  o.stop(c.currentTime + 0.6);
  return true;
}

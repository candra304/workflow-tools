import { useCallback } from "react";

/**
 * Salin teks ke clipboard, dengan fallback textarea untuk browser
 * tanpa Clipboard API — sama seperti `copyText()` di versi single-file.
 * Mengembalikan fungsi salin yang memanggil `onDone` bila berhasil.
 */
export function useClipboard() {
  return useCallback((text: string, onDone: () => void, onFail?: () => void) => {
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        onDone();
      } catch {
        onFail?.();
      }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(onDone).catch(fallback);
    } else {
      fallback();
    }
  }, []);
}

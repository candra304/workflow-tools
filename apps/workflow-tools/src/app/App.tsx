import { useCallback, useEffect, useRef, useState } from "react";
import { type Pattern, type PatternId } from "@workflow-tools/data";
import { Toast } from "@workflow-tools/ui";
import { Hero } from "../components/Hero";
import { PatternPicker } from "../components/PatternPicker";
import { StackGenerator } from "../components/StackGenerator";
import { Catalog } from "../components/Catalog";
import { NicheSection } from "../components/NicheSection";
import { conflicts } from "../lib/stack";
import type { CatalogFilter } from "../lib/filters";
import type { NicheSortMode } from "../lib/filters";

/**
 * Workflow Tools — komposisi halaman.
 * State (stack, pola aktif, filter, checklist) tinggal di sini dan
 * diteruskan ke komponen per seksi. Data dibaca dari @workflow-tools/data.
 */
export function App() {
  const [stack, setStack] = useState<string[]>([]);
  const [activePattern, setActivePattern] = useState<PatternId | null>(null);
  const [doneSteps, setDoneSteps] = useState<Record<number, boolean>>({});
  const [filter, setFilter] = useState<CatalogFilter>({
    query: "",
    pattern: "",
    weight: "",
    license: "",
    category: "Semua",
  });
  const [nicheSort, setNicheSort] = useState<NicheSortMode>("laris");
  const [activeNiche, setActiveNiche] = useState("Semua");
  const [toastMsg, setToastMsg] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(""), 2200);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const selectPattern = useCallback(
    (p: Pattern) => {
      setActivePattern(p.id);
      setStack([...p.stack]);
      setDoneSteps({});
      showToast(`Stack pola ${p.name} dimuat: ${p.stack.length} tools`);
      document.getElementById("generator")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [showToast],
  );

  const toggleStack = useCallback(
    (id: string) => {
      setStack((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        const next = [...prev, id];
        if (conflicts(next).length) showToast("Ditambahkan — tapi ada konflik, cek Stack Generator");
        return next;
      });
    },
    [showToast],
  );

  const removeFromStack = useCallback((id: string) => {
    setStack((prev) => prev.filter((x) => x !== id));
  }, []);

  return (
    <div className="wrap">
      <Hero />
      <PatternPicker activePattern={activePattern} onSelect={selectPattern} />
      <StackGenerator
        stack={stack}
        activePattern={activePattern}
        doneSteps={doneSteps}
        onToggleDone={(i) => setDoneSteps((prev) => ({ ...prev, [i]: !prev[i] }))}
        onRemove={removeFromStack}
        onClear={() => {
          setStack([]);
          setActivePattern(null);
          setDoneSteps({});
        }}
        showToast={showToast}
      />
      <Catalog
        filter={filter}
        onFilterChange={setFilter}
        stack={stack}
        onToggleStack={toggleStack}
        showToast={showToast}
      />
      <NicheSection
        sort={nicheSort}
        onSortChange={setNicheSort}
        activeNiche={activeNiche}
        onActiveNicheChange={setActiveNiche}
      />
      <footer>
        Workflow Tools — katalog sumber daya web premium super interaktif berbasis React. Angka bintang GitHub
        adalah snapshot perkiraan saat katalog disusun; berat paket adalah perkiraan gzip. Referensi web live
        adalah milik kreatornya masing-masing — pakai untuk ATM (Amati, Tiru, Modifikasi), bukan menyalin kode
        atau aset mereka.
      </footer>
      <Toast message={toastMsg} />
    </div>
  );
}

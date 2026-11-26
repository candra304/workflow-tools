import { useCallback, useEffect, useRef, useState } from "react";
import { demos, type Demo } from "@workflow-tools/data";
import { Toast } from "@workflow-tools/ui";
import { Hero } from "../components/Hero";
import { Toolbar } from "../components/Toolbar";
import { DemoCard, type DemoAction } from "../components/DemoCard";
import { HowItWorks, LanguageGrid, ThemeLegend } from "../components/Sections";
import { Modals } from "../components/Modals";
import { matchesDemo, sortDemos, type DemoSort } from "../lib/filter";

/**
 * Muse Demo Hub — komposisi halaman.
 * State (filter, cari, urutan, modal) tinggal di sini; data dibaca
 * dari @workflow-tools/data (demos.json / languages.json / themes.json).
 */
export function App() {
  const [filter, setFilter] = useState("Semua");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<DemoSort>("baru");
  const [current, setCurrent] = useState<Demo | null>(null);
  const [modal, setModal] = useState<"preview" | "code" | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(""), 2400);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModal(null);
        setCurrent(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal]);

  const list = sortDemos(
    demos.filter((d) => matchesDemo(d, filter, query.trim().toLowerCase())),
    sort,
  );

  const openAction = useCallback((action: DemoAction, demo: Demo) => {
    setCurrent(demo);
    setModal(action);
  }, []);

  const resetFilter = useCallback(() => {
    setQuery("");
    setFilter("Semua");
  }, []);

  return (
    <div className="wrap">
      <Hero />
      <Toolbar
        query={query}
        onQueryChange={setQuery}
        sort={sort}
        onSortChange={setSort}
        filter={filter}
        onFilterChange={setFilter}
        shown={list.length}
        total={demos.length}
      />
      <main>
        <div className="grid" id="demoGrid">
          {list.map((d) => (
            <DemoCard key={d.id} demo={d} onAction={openAction} showToast={showToast} />
          ))}
        </div>
        <div className={`empty${list.length === 0 ? " show" : ""}`} id="emptyState">
          <h3>Nggak ada demo yang cocok</h3>
          <p>Coba kata kunci lain, atau reset filter bahasanya.</p>
          <button className="btn btn-primary" id="resetBtn" type="button" style={{ flex: "none" }} onClick={resetFilter}>
            Reset Filter
          </button>
        </div>
        <ThemeLegend />
        <LanguageGrid onFilter={setFilter} />
        <HowItWorks />
      </main>
      <footer>
        <span>
          <b>Muse Demo Hub</b> — galeri hasil kerja Muse agent.
        </span>
        <span>Base netral premium — aksen ngikutin tema tiap niche · Ringan di HP</span>
      </footer>
      <Modals
        demo={current}
        modal={modal}
        onClose={() => {
          setModal(null);
          setCurrent(null);
        }}
        onSwitch={(m) => setModal(m)}
        showToast={showToast}
      />
      <Toast message={toastMsg} />
    </div>
  );
}

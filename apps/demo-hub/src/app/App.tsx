import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { demos, type Demo } from "@workflow-tools/data";
import { Toast } from "@workflow-tools/ui";
import { Hero } from "../components/Hero";
import { HostingPicker } from "../components/HostingPicker";
import { Toolbar } from "../components/Toolbar";
import { DemoCard, type DemoAction } from "../components/DemoCard";
import { HowItWorks, LanguageGrid, ThemeLegend } from "../components/Sections";
import { TemplateSection } from "../components/TemplateSection";
import { AddResultModal } from "../components/AddResultModal";
import { Modals } from "../components/Modals";
import { matchesDemo, sortDemos, type DemoSort } from "../lib/filter";
import { deleteCustomLink, getDefaultHostingId } from "../lib/hosting";
import { loadUserDemos, saveUserDemos } from "../lib/userDemos";

/**
 * Muse Demo Hub — komposisi halaman.
 * State (filter, cari, urutan, modal) tinggal di sini; data dibaca
 * dari @workflow-tools/data (demos.json / languages.json / themes.json).
 * Hasil tambahan user dimuat dari localStorage (mdh_user_demos) dan
 * digabung di depan demo bawaan — 9 demo bawaan tidak pernah diubah.
 */
export function App() {
  const [filter, setFilter] = useState("Semua");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<DemoSort>("baru");
  const [current, setCurrent] = useState<Demo | null>(null);
  const [modal, setModal] = useState<"preview" | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [defaultHostingId, setDefaultHostingId] = useState(() => getDefaultHostingId());
  const [toastMsg, setToastMsg] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);

  const builtinIds = useMemo(() => new Set(demos.map((d) => d.id)), []);
  const [userDemos, setUserDemos] = useState<Demo[]>(() => loadUserDemos(builtinIds));

  const allDemos = useMemo(() => [...userDemos, ...demos], [userDemos, demos]);

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
        setAddOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = modal || addOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal, addOpen]);

  const list = sortDemos(
    allDemos.filter((d) => matchesDemo(d, filter, query.trim().toLowerCase())),
    sort,
  );

  const openAction = useCallback((action: DemoAction, demo: Demo) => {
    setCurrent(demo);
    setModal(action);
  }, []);

  const openPreview = useCallback((demo: Demo) => {
    setCurrent(demo);
    setModal("preview");
  }, []);

  const findDemo = useCallback(
    (id: string): Demo | null => allDemos.find((d) => d.id === id) ?? null,
    [allDemos],
  );

  const handleAdded = useCallback(
    (demo: Demo) => {
      setUserDemos((prev) => {
        const next = [demo, ...prev];
        saveUserDemos(next);
        return next;
      });
      setAddOpen(false);
      setQuery("");
      setFilter("Semua");
    },
    [],
  );

  const handleDeleteUserDemo = useCallback(
    (demo: Demo) => {
      setUserDemos((prev) => {
        const next = prev.filter((d) => d.id !== demo.id);
        saveUserDemos(next);
        return next;
      });
      deleteCustomLink(demo.id);
      try {
        localStorage.removeItem(`mdh_host_${demo.id}`);
      } catch {
        /* abaikan */
      }
      showToast(`Hasil "${demo.title}" dihapus`);
    },
    [showToast],
  );

  const resetFilter = useCallback(() => {
    setQuery("");
    setFilter("Semua");
  }, []);

  return (
    <div className="wrap">
      <Hero demoCount={allDemos.length} onAdd={() => setAddOpen(true)} />
      <HostingPicker onDefaultChange={() => setDefaultHostingId(getDefaultHostingId())} />
      <Toolbar
        query={query}
        onQueryChange={setQuery}
        sort={sort}
        onSortChange={setSort}
        filter={filter}
        onFilterChange={setFilter}
        shown={list.length}
        total={allDemos.length}
      />
      <main>
        <div className="grid" id="demoGrid">
          {list.map((d) => (
            <DemoCard
              key={d.id}
              demo={d}
              onAction={openAction}
              onDelete={d.custom ? handleDeleteUserDemo : undefined}
              showToast={showToast}
              defaultHostingId={defaultHostingId}
            />
          ))}
        </div>
        <div className={`empty${list.length === 0 ? " show" : ""}`} id="emptyState">
          <h3>Nggak ada demo yang cocok</h3>
          <p>Coba kata kunci lain, atau reset filter bahasanya.</p>
          <button className="btn btn-primary" id="resetBtn" type="button" style={{ flex: "none" }} onClick={resetFilter}>
            Reset Filter
          </button>
        </div>
        <TemplateSection onOpenDemo={openPreview} findDemo={findDemo} showToast={showToast} />
        <ThemeLegend />
        <LanguageGrid onFilter={setFilter} demos={allDemos} />
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
        showToast={showToast}
      />
      <AddResultModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdded={handleAdded}
        showToast={showToast}
      />
      <Toast message={toastMsg} />
    </div>
  );
}

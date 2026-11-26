import type { Demo } from "@workflow-tools/data";
import { demoThemeStyle, useClipboard } from "@workflow-tools/ui";
import { ThumbArt } from "../lib/thumb";
import { demoLink } from "../lib/filter";

export type DemoAction = "preview" | "code";

/** Satu kartu demo — tema ikut kategori demo (variabel --a* dari data). */
export function DemoCard({
  demo,
  onAction,
  showToast,
}: {
  demo: Demo;
  onAction: (action: DemoAction, demo: Demo) => void;
  showToast: (msg: string) => void;
}) {
  const copy = useClipboard();
  const statusCls = demo.status === "Live" ? "" : " proses";
  return (
    <article className="card" id={`demo-${demo.id}`} style={demoThemeStyle(demo.theme)}>
      <div className="thumb" aria-hidden="true">
        <ThumbArt type={demo.thumb} />
        <span className={`badge-status${statusCls}`}>{demo.status}</span>
        <span className="cat-badge">{demo.cat}</span>
      </div>
      <div className="card-body">
        <div className="card-head">
          <h3>{demo.title}</h3>
          <span className="card-date">{demo.dateLabel}</span>
        </div>
        <p className="card-desc">{demo.desc}</p>
        <div className="prompt-box">
          <span className="p-label">Prompt</span>
          <p>“{demo.prompt}”</p>
        </div>
        <div className="tags">
          {demo.stacks.map((s, i) => (
            <span className={`tag${i === 0 ? " hot" : ""}`} key={s}>
              {s}
            </span>
          ))}
        </div>
        <div className="card-actions">
          <button className="btn btn-primary" type="button" onClick={() => onAction("preview", demo)}>
            <svg viewBox="0 0 24 24">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Lihat Demo
          </button>
          <button className="btn btn-ghost" type="button" onClick={() => onAction("code", demo)}>
            <svg viewBox="0 0 24 24">
              <path d="M8 6l-6 6 6 6M16 6l6 6-6 6" />
            </svg>
            Kode
          </button>
          <button
            className="btn btn-ghost btn-icon"
            type="button"
            aria-label={`Salin link demo ${demo.title}`}
            title="Salin Link"
            onClick={() => copy(demoLink(demo), () => showToast(`Link demo ${demo.title} disalin`))}
          >
            <svg viewBox="0 0 24 24">
              <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
              <path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

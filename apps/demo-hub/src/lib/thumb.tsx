import type { ThumbType } from "@workflow-tools/data";

/**
 * Miniatur abstrak tiap demo — port JSX dari `thumbHTML()` versi single-file.
 * Bukan screenshot asli, melainkan pola bar & sel dengan warna tema demo.
 */
export function ThumbArt({ type }: { type: ThumbType }) {
  if (type === "trading")
    return (
      <>
        <div className="row">
          <div className="cell on" />
          <div className="cell" />
          <div className="cell" />
        </div>
        <div className="bar acc long" />
        <div className="bar mid" />
        <div className="row">
          <div className="cell" />
          <div className="cell on" />
        </div>
      </>
    );
  if (type === "stock")
    return (
      <>
        <div className="bar long" />
        <div className="bar acc mid" />
        <div className="bar long" />
        <div className="bar acc short" />
        <div className="bar mid" />
      </>
    );
  if (type === "motion")
    return (
      <>
        <div className="row">
          <div className="cell on" />
          <div className="cell on" />
        </div>
        <div className="bar acc mid" />
        <div className="row">
          <div className="cell" />
          <div className="cell" />
          <div className="cell on" />
        </div>
      </>
    );
  if (type === "chart")
    return (
      <>
        <div className="bar short" />
        <div className="bar acc long" />
        <div className="bar mid" />
        <div className="bar acc long" />
        <div className="bar short" />
      </>
    );
  if (type === "review")
    return (
      <>
        <div className="row">
          <div className="cell" />
          <div className="cell on" />
          <div className="cell" />
        </div>
        <div className="bar mid" />
        <div className="bar acc short" />
      </>
    );
  return (
    <>
      <div className="bar acc mid" />
      <div className="row">
        <div className="cell on" />
        <div className="cell" />
        <div className="cell" />
      </div>
      <div className="bar long" />
      <div className="bar short" />
    </>
  );
}

import { Bar } from "@/components/primitives";

type BottomBarProps = {
  words: number;
  characters: number;
  readingMinutes: number;
  date: Date;
  fileName: string | null;
  dirty: boolean;
  alert: boolean;
  onToggleAlert: () => void;
};

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function BottomBar({
  words,
  characters,
  readingMinutes,
  date,
  fileName,
  dirty,
  alert,
  onToggleAlert,
}: BottomBarProps) {
  return (
    <Bar color="tan" roundRight className="lcars-bottombar">
      <div className="lcars-bottombar__stats">
        <span className="lcars-bottombar__stat">
          <span className="lcars-bottombar__stat-label">WORDS</span>
          <span>{words}</span>
        </span>
        <span className="lcars-bottombar__stat">
          <span className="lcars-bottombar__stat-label">CHARS</span>
          <span>{characters}</span>
        </span>
        <span className="lcars-bottombar__stat">
          <span className="lcars-bottombar__stat-label">READ</span>
          <span>{readingMinutes} MIN</span>
        </span>
      </div>

      <div className="lcars-bottombar__file">
        {dirty ? (
          <span
            className="lcars-bottombar__dirty"
            aria-label="Unsaved changes"
            title="Unsaved changes"
          >
            ●
          </span>
        ) : null}
        {fileName ? (
          <span className="lcars-bottombar__filename">{fileName}</span>
        ) : null}
      </div>

      <span className="lcars-bottombar__date">{formatDate(date)}</span>
      <button
        type="button"
        className="lcars-bar__id lcars-bottombar__alert-trigger"
        onClick={onToggleAlert}
        aria-label={alert ? "Stand down from red alert" : "Sound red alert"}
        title={alert ? "Stand down" : "Red alert"}
      >
        {alert ? "ALERT — STAND DOWN" : "LCARS 47-A"}
      </button>
    </Bar>
  );
}

import { Bar } from "@/components/primitives";

type BottomBarProps = {
  words: number;
  characters: number;
  readingMinutes: number;
  date: Date;
  fileName: string | null;
  dirty: boolean;
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
}: BottomBarProps) {
  return (
    <Bar
      color="tan"
      roundRight
      refId="LCARS 47-A"
      className="lcars-bottombar"
    >
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
    </Bar>
  );
}

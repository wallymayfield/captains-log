type BottomBarProps = {
  words: number;
  characters: number;
  readingMinutes: number;
  date: Date;
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
}: BottomBarProps) {
  return (
    <div className="lcars-bar lcars-bottombar">
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
      <span className="lcars-bottombar__date">{formatDate(date)}</span>
      <span className="lcars-bar__id">LCARS 47-A</span>
    </div>
  );
}

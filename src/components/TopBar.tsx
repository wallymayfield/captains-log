import { formatStardate } from "@/lib/stardate";

type TopBarProps = {
  documentTitle: string;
  status: string;
  date: Date;
};

export function TopBar({ documentTitle, status, date }: TopBarProps) {
  return (
    <div className="lcars-bar lcars-topbar">
      <div className="lcars-bar__title">
        <span>Captain&apos;s Log</span>
        <span className="lcars-bar__doc">{documentTitle}</span>
      </div>
      <div className="lcars-topbar__stardate">
        <span className="lcars-topbar__stardate-label">STARDATE</span>
        <span>{formatStardate(date)}</span>
      </div>
      <span className="lcars-bar__id">{status}</span>
    </div>
  );
}

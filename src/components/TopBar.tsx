import { Bar } from "@/components/primitives";
import { formatStardate } from "@/lib/stardate";

type TopBarProps = {
  documentTitle: string;
  status: string;
  date: Date;
};

export function TopBar({ documentTitle, status, date }: TopBarProps) {
  return (
    <Bar color="orange" roundRight refId={status} showId className="lcars-topbar">
      <div className="lcars-bar__title">
        <span>Captain&apos;s Log</span>
        <span className="lcars-bar__doc">{documentTitle}</span>
      </div>
      <div className="lcars-topbar__stardate">
        <span className="lcars-topbar__stardate-label">STARDATE</span>
        <span>{formatStardate(date)}</span>
      </div>
    </Bar>
  );
}

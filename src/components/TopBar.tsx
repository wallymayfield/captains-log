import { Bar } from "@/components/primitives";
import { formatStardate } from "@/lib/stardate";

type TopBarProps = {
  documentTitle: string;
  status: string;
  date: Date;
};

export function TopBar({ documentTitle, status, date }: TopBarProps) {
  return (
    <Bar color="orange" roundRight className="lcars-topbar">
      <div className="lcars-bar__title">
        <span>Captain&apos;s Log</span>
        <span className="lcars-bar__doc">{documentTitle}</span>
      </div>
      <div className="lcars-topbar__meta">
        <span className="lcars-topbar__field">
          <span className="lcars-topbar__field-label">STARDATE</span>
          <span>{formatStardate(date)}</span>
        </span>
        <span className="lcars-topbar__field">
          <span className="lcars-topbar__field-label">STATUS</span>
          <span>{status}</span>
        </span>
      </div>
    </Bar>
  );
}

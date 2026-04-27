import { Bar, Pill } from "@/components/primitives";
import { navigate } from "@/lib/use-hash-route";

export type ViewMode = "write" | "preview";
export type Status = "READY" | "MODIFIED" | "PREVIEW" | "STANDBY" | "ALERT";

type LeftRailProps = {
  viewMode: ViewMode;
  status: Status;
  alert: boolean;
  onToggleViewMode: () => void;
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onOpenSettings: () => void;
  onToggleAlert: () => void;
};

const STATUS_COLOR: Record<Status, "violet" | "red" | "blue" | "peach"> = {
  READY: "violet",
  MODIFIED: "red",
  PREVIEW: "blue",
  STANDBY: "peach",
  ALERT: "red",
};

export function LeftRail({
  viewMode,
  status,
  alert,
  onToggleViewMode,
  onNew,
  onOpen,
  onSave,
  onSaveAs,
  onOpenSettings,
  onToggleAlert,
}: LeftRailProps) {
  return (
    <div className="lcars-rail" role="navigation" aria-label="Primary">
      <Bar label="NEW" color="orange" onClick={onNew} />
      <Bar label="OPEN" color="peach" onClick={onOpen} />
      <Bar label="SAVE" color="peach" onClick={onSave} />
      <Bar label="SAVE AS" color="tan" onClick={onSaveAs} />
      <Bar color="pink" grow showId={false} />
      <Bar label={status} color={STATUS_COLOR[status]} />
      <Pill
        label={viewMode === "preview" ? "WRITE" : "PREVIEW"}
        color={viewMode === "preview" ? "orange" : "violet"}
        onClick={onToggleViewMode}
        ariaLabel={
          viewMode === "preview" ? "Back to editor" : "Show markdown preview"
        }
      />
      <Pill label="SETTINGS" color="blue" onClick={onOpenSettings} />
      <Pill
        label={alert ? "STAND DOWN" : "ALERT"}
        color={alert ? "tan" : "red"}
        onClick={onToggleAlert}
        ariaLabel={alert ? "Stand down from red alert" : "Sound red alert"}
      />
      {import.meta.env.DEV ? (
        <Pill
          label="PRIMITIVES"
          color="blue"
          onClick={() => navigate("showcase")}
        />
      ) : null}
    </div>
  );
}

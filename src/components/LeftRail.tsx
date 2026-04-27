import { Bar } from "@/components/primitives";
import { navigate } from "@/lib/use-hash-route";

export type ViewMode = "write" | "preview";
export type Status = "READY" | "MODIFIED" | "PREVIEW" | "STANDBY" | "ALERT";

type LeftRailProps = {
  viewMode: ViewMode;
  status: Status;
  onToggleViewMode: () => void;
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onOpenSettings: () => void;
};

const STATUS_COLOR: Record<Status, "orange" | "violet" | "red" | "blue" | "peach"> = {
  READY: "orange",
  MODIFIED: "red",
  PREVIEW: "blue",
  STANDBY: "peach",
  ALERT: "red",
};

export function LeftRail({
  viewMode,
  status,
  onToggleViewMode,
  onNew,
  onOpen,
  onSave,
  onSaveAs,
  onOpenSettings,
}: LeftRailProps) {
  return (
    <div className="lcars-rail" role="navigation" aria-label="Primary">
      <Bar label="NEW" color="orange" onClick={onNew} />
      <Bar label="OPEN" color="peach" onClick={onOpen} />
      <Bar label="SAVE" color="violet" onClick={onSave} />
      <Bar label="SAVE AS" color="tan" onClick={onSaveAs} />
      <Bar color="pink" grow showId={false} />
      <Bar label={status} color={STATUS_COLOR[status]} />
      <Bar
        label={viewMode === "preview" ? "WRITE" : "PREVIEW"}
        color={viewMode === "preview" ? "orange" : "peach"}
        onClick={onToggleViewMode}
        ariaLabel={
          viewMode === "preview" ? "Back to editor" : "Show markdown preview"
        }
      />
      <Bar label="SETTINGS" color="violet" onClick={onOpenSettings} />
      {import.meta.env.DEV ? (
        <Bar
          label="PRIMITIVES"
          color="blue"
          onClick={() => navigate("showcase")}
        />
      ) : null}
    </div>
  );
}

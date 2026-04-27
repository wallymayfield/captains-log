import { Bar } from "@/components/primitives";
import { navigate, type Route } from "@/lib/use-hash-route";

export type ViewMode = "write" | "preview";
export type Status = "READY" | "MODIFIED" | "PREVIEW" | "STANDBY" | "ALERT";

type LeftRailProps = {
  viewMode: ViewMode;
  status: Status;
  route: Route;
  onToggleViewMode: () => void;
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onOpenSettings: () => void;
};

const STATUS_COLOR: Record<
  Status,
  "orange" | "violet" | "red" | "blue" | "peach"
> = {
  READY: "orange",
  MODIFIED: "red",
  PREVIEW: "blue",
  STANDBY: "peach",
  ALERT: "red",
};

export function LeftRail({
  viewMode,
  status,
  route,
  onToggleViewMode,
  onNew,
  onOpen,
  onSave,
  onSaveAs,
  onOpenSettings,
}: LeftRailProps) {
  const onSchematic = route === "schematic";
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
      <Bar
        label={onSchematic ? "EDITOR" : "SCHEMATIC"}
        color={onSchematic ? "orange" : "blue"}
        onClick={() => navigate(onSchematic ? "editor" : "schematic")}
        ariaLabel={
          onSchematic ? "Back to editor" : "Show ship schematic"
        }
      />
    </div>
  );
}

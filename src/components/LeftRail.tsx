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
  onOpenHelp: () => void;
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
  onOpenHelp,
}: LeftRailProps) {
  const onSchematic = route === "schematic";
  const showsWrite = onSchematic || viewMode === "preview";

  const togglePreview = () => {
    if (onSchematic) {
      if (viewMode === "preview") onToggleViewMode();
      navigate("editor");
      return;
    }
    onToggleViewMode();
  };
  return (
    <div className="lcars-rail" role="navigation" aria-label="Primary">
      <Bar label="NEW" color="orange" onClick={onNew} />
      <Bar label="OPEN" color="peach" onClick={onOpen} />
      <Bar label="SAVE" color="violet" onClick={onSave} />
      <Bar label="SAVE AS" color="tan" onClick={onSaveAs} />
      <Bar color="pink" grow showId={false} />
      <Bar label={status} color={STATUS_COLOR[status]} />
      <Bar
        label={showsWrite ? "WRITE" : "PREVIEW"}
        color={showsWrite ? "orange" : "peach"}
        onClick={togglePreview}
        ariaLabel={showsWrite ? "Back to editor" : "Show markdown preview"}
      />
      <Bar label="HELP" color="tan" onClick={onOpenHelp} />
      <Bar label="SETTINGS" color="violet" onClick={onOpenSettings} />
      <Bar
        label="SCHEMATIC"
        color="blue"
        onClick={() => navigate("schematic")}
        ariaLabel="Show ship schematic"
      />
    </div>
  );
}

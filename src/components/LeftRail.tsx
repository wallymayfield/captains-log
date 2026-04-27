import { Bar, Pill } from "@/components/primitives";
import { navigate } from "@/lib/use-hash-route";

export type ViewMode = "write" | "preview";
export type Status = "READY" | "MODIFIED" | "PREVIEW" | "STANDBY";

type LeftRailProps = {
  viewMode: ViewMode;
  status: Status;
  onToggleViewMode: () => void;
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onSaveAs: () => void;
};

const STATUS_COLOR: Record<Status, "violet" | "red" | "blue" | "peach"> = {
  READY: "violet",
  MODIFIED: "red",
  PREVIEW: "blue",
  STANDBY: "peach",
};

export function LeftRail({
  viewMode,
  status,
  onToggleViewMode,
  onNew,
  onOpen,
  onSave,
  onSaveAs,
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

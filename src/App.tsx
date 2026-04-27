import { useCallback, useState } from "react";
import { ask } from "@tauri-apps/plugin-dialog";
import { Shell } from "@/components/Shell";
import { Elbow } from "@/components/primitives";
import { LeftRail, type Status, type ViewMode } from "@/components/LeftRail";
import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";
import { CenterStage } from "@/components/CenterStage";
import { Showcase } from "@/components/Showcase";
import { Editor } from "@/components/Editor";
import { Preview } from "@/components/Preview";
import { ErrorBanner } from "@/components/ErrorBanner";
import { useHashRoute } from "@/lib/use-hash-route";
import { useTicker } from "@/lib/use-ticker";
import { useShortcuts } from "@/lib/use-shortcuts";
import {
  basename,
  docsEqual,
  newDoc,
  readingMinutes,
  wordCount,
  type Doc,
} from "@/lib/document";
import { pickAndOpen, pickAndSave, writeToPath } from "@/lib/file-ops";

const DISCARD_PROMPT =
  "You have unsaved changes. Discard them and continue?";

export function App() {
  const initial = newDoc();
  const [doc, setDoc] = useState<Doc>(initial);
  const [savedDoc, setSavedDoc] = useState<Doc>(initial);
  const [path, setPath] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("write");
  const [error, setError] = useState<string | null>(null);

  const route = useHashRoute();
  const now = useTicker(60_000);

  const dirty = !docsEqual(doc, savedDoc);
  const words = wordCount(doc.body);
  const chars = doc.body.length;
  const reading = readingMinutes(words);
  const docTitle = doc.title.trim() || "UNTITLED LOG ENTRY";

  const confirmDiscard = useCallback(async (): Promise<boolean> => {
    if (!dirty) return true;
    return await ask(DISCARD_PROMPT, {
      title: "Captain's Log",
      kind: "warning",
      okLabel: "Discard",
      cancelLabel: "Keep editing",
    });
  }, [dirty]);

  const handleNew = useCallback(async () => {
    if (!(await confirmDiscard())) return;
    const fresh = newDoc();
    setDoc(fresh);
    setSavedDoc(fresh);
    setPath(null);
    setError(null);
  }, [confirmDiscard]);

  const handleOpen = useCallback(async () => {
    if (!(await confirmDiscard())) return;
    try {
      const result = await pickAndOpen();
      if (!result) return;
      setDoc(result.doc);
      setSavedDoc(result.doc);
      setPath(result.path);
      setError(null);
    } catch (e) {
      setError(messageOf(e));
    }
  }, [confirmDiscard]);

  const handleSave = useCallback(async () => {
    try {
      if (!path) {
        const newPath = await pickAndSave(doc);
        if (newPath) {
          setPath(newPath);
          setSavedDoc(doc);
        }
      } else {
        await writeToPath(doc, path);
        setSavedDoc(doc);
      }
      setError(null);
    } catch (e) {
      setError(messageOf(e));
    }
  }, [doc, path]);

  const handleSaveAs = useCallback(async () => {
    try {
      const newPath = await pickAndSave(doc, path ?? undefined);
      if (newPath) {
        setPath(newPath);
        setSavedDoc(doc);
      }
      setError(null);
    } catch (e) {
      setError(messageOf(e));
    }
  }, [doc, path]);

  const toggleViewMode = useCallback(
    () => setViewMode((m) => (m === "write" ? "preview" : "write")),
    [],
  );

  useShortcuts({
    onNew: handleNew,
    onOpen: handleOpen,
    onSave: handleSave,
    onSaveAs: handleSaveAs,
    onTogglePreview: toggleViewMode,
  });

  const stageContent =
    route === "showcase" ? (
      <Showcase />
    ) : viewMode === "preview" ? (
      <Preview doc={doc} />
    ) : (
      <Editor doc={doc} onChange={setDoc} />
    );

  const status: Status =
    route === "showcase"
      ? "STANDBY"
      : viewMode === "preview"
        ? "PREVIEW"
        : dirty
          ? "MODIFIED"
          : "READY";

  const fileName = path ? basename(path) : null;

  return (
    <Shell
      topLeft={<Elbow corner="tl" />}
      topBar={
        <TopBar
          documentTitle={
            route === "showcase"
              ? "PRIMITIVES SHOWCASE"
              : `${dirty ? "• " : ""}${docTitle.toUpperCase()}`
          }
          status={status}
          date={now}
        />
      }
      rail={
        <LeftRail
          viewMode={viewMode}
          status={status}
          onToggleViewMode={toggleViewMode}
          onNew={handleNew}
          onOpen={handleOpen}
          onSave={handleSave}
          onSaveAs={handleSaveAs}
        />
      }
      stage={
        <CenterStage>
          {error ? (
            <ErrorBanner message={error} onDismiss={() => setError(null)} />
          ) : null}
          {stageContent}
        </CenterStage>
      }
      bottomLeft={<Elbow corner="bl" color="tan" />}
      bottomBar={
        <BottomBar
          words={words}
          characters={chars}
          readingMinutes={reading}
          date={now}
          fileName={fileName}
          dirty={dirty}
        />
      }
    />
  );
}

function messageOf(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return "Unknown subspace anomaly.";
}

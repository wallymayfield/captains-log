import { useCallback, useEffect, useState } from "react";
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
import { SettingsPanel } from "@/components/Settings";
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
import { loadSettings, saveSettings, type Settings } from "@/lib/settings";
import {
  play,
  setActiveSettings,
  startRedAlert,
  stopRedAlert,
} from "@/lib/sound";

const DISCARD_PROMPT =
  "You have unsaved changes. Discard them and continue?";

export function App() {
  const initial = newDoc();
  const [doc, setDoc] = useState<Doc>(initial);
  const [savedDoc, setSavedDoc] = useState<Doc>(initial);
  const [path, setPath] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("write");
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [alert, setAlert] = useState(false);

  const route = useHashRoute();
  const now = useTicker(60_000);

  // Push settings into the sound module + persist.
  useEffect(() => {
    setActiveSettings(settings);
    saveSettings(settings);
  }, [settings]);

  // Tear down the klaxon if alert flips off, sound is muted, or unmount.
  useEffect(() => {
    if (alert && settings.soundsEnabled) {
      startRedAlert();
    } else {
      stopRedAlert();
    }
    return () => stopRedAlert();
  }, [alert, settings.soundsEnabled]);

  const dirty = !docsEqual(doc, savedDoc);
  const words = wordCount(doc.body);
  const chars = doc.body.length;
  const reading = readingMinutes(words);
  const docTitle = doc.title.trim() || "MISSION DESIGNATION PENDING";

  const confirmDiscard = useCallback(async (): Promise<boolean> => {
    if (!dirty) return true;
    setAlert(true);
    try {
      return await ask(DISCARD_PROMPT, {
        title: "Captain's Log",
        kind: "warning",
        okLabel: "Discard",
        cancelLabel: "Keep editing",
      });
    } finally {
      setAlert(false);
    }
  }, [dirty]);

  const handleNew = useCallback(async () => {
    play("select");
    if (!(await confirmDiscard())) return;
    const fresh = newDoc();
    setDoc(fresh);
    setSavedDoc(fresh);
    setPath(null);
    setError(null);
  }, [confirmDiscard]);

  const handleOpen = useCallback(async () => {
    play("select");
    if (!(await confirmDiscard())) return;
    try {
      const result = await pickAndOpen();
      if (!result) return;
      setDoc(result.doc);
      setSavedDoc(result.doc);
      setPath(result.path);
      setError(null);
      play("success");
    } catch (e) {
      play("failure");
      setError(messageOf(e));
    }
  }, [confirmDiscard]);

  const handleSave = useCallback(async () => {
    play("select");
    try {
      if (!path) {
        const newPath = await pickAndSave(doc);
        if (newPath) {
          setPath(newPath);
          setSavedDoc(doc);
          play("success");
        }
      } else {
        await writeToPath(doc, path);
        setSavedDoc(doc);
        play("success");
      }
      setError(null);
    } catch (e) {
      play("failure");
      setError(messageOf(e));
    }
  }, [doc, path]);

  const handleSaveAs = useCallback(async () => {
    play("select");
    try {
      const newPath = await pickAndSave(doc, path ?? undefined);
      if (newPath) {
        setPath(newPath);
        setSavedDoc(doc);
        play("success");
      }
      setError(null);
    } catch (e) {
      play("failure");
      setError(messageOf(e));
    }
  }, [doc, path]);

  const toggleViewMode = useCallback(() => {
    play("chirp");
    setViewMode((m) => (m === "write" ? "preview" : "write"));
  }, []);

  const openSettings = useCallback(() => {
    play("chirp");
    setSettingsOpen(true);
  }, []);

  useShortcuts({
    onNew: handleNew,
    onOpen: handleOpen,
    onSave: handleSave,
    onSaveAs: handleSaveAs,
    onTogglePreview: toggleViewMode,
    onOpenSettings: openSettings,
  });

  const stageContent =
    route === "showcase" ? (
      <Showcase />
    ) : viewMode === "preview" ? (
      <Preview doc={doc} />
    ) : (
      <Editor doc={doc} onChange={setDoc} />
    );

  const status: Status = alert
    ? "ALERT"
    : route === "showcase"
      ? "STANDBY"
      : viewMode === "preview"
        ? "PREVIEW"
        : dirty
          ? "MODIFIED"
          : "READY";

  const fileName = path ? basename(path) : null;

  return (
    <>
      <Shell
        alert={alert}
        topLeft={<Elbow corner="tl" color={alert ? "red" : "orange"} />}
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
            onOpenSettings={openSettings}
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
        bottomLeft={<Elbow corner="bl" color={alert ? "red" : "tan"} />}
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
      <SettingsPanel
        open={settingsOpen}
        settings={settings}
        onChange={setSettings}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}

function messageOf(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return "Unknown subspace anomaly.";
}

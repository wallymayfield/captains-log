import { useState } from "react";
import { Shell } from "@/components/Shell";
import { Elbow } from "@/components/primitives";
import { LeftRail, type ViewMode } from "@/components/LeftRail";
import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";
import { CenterStage } from "@/components/CenterStage";
import { Showcase } from "@/components/Showcase";
import { Editor } from "@/components/Editor";
import { Preview } from "@/components/Preview";
import { ErrorBanner } from "@/components/ErrorBanner";
import { useHashRoute } from "@/lib/use-hash-route";
import { newDoc, readingMinutes, wordCount } from "@/lib/document";
import { pickAndOpen, pickAndSave, writeToPath } from "@/lib/file-ops";

export function App() {
  const [doc, setDoc] = useState(() => newDoc());
  const [path, setPath] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("write");
  const [error, setError] = useState<string | null>(null);
  const route = useHashRoute();
  const now = new Date();

  const words = wordCount(doc.body);
  const chars = doc.body.length;
  const reading = readingMinutes(words);
  const docTitle = doc.title.trim() || "UNTITLED LOG ENTRY";

  const handleNew = () => {
    setDoc(newDoc());
    setPath(null);
    setError(null);
  };

  const handleOpen = async () => {
    try {
      const result = await pickAndOpen();
      if (!result) return;
      setDoc(result.doc);
      setPath(result.path);
      setError(null);
    } catch (e) {
      setError(messageOf(e));
    }
  };

  const handleSave = async () => {
    try {
      if (!path) {
        const newPath = await pickAndSave(doc);
        if (newPath) setPath(newPath);
      } else {
        await writeToPath(doc, path);
      }
      setError(null);
    } catch (e) {
      setError(messageOf(e));
    }
  };

  const handleSaveAs = async () => {
    try {
      const newPath = await pickAndSave(doc, path ?? undefined);
      if (newPath) setPath(newPath);
      setError(null);
    } catch (e) {
      setError(messageOf(e));
    }
  };

  const stageContent =
    route === "showcase" ? (
      <Showcase />
    ) : viewMode === "preview" ? (
      <Preview doc={doc} />
    ) : (
      <Editor doc={doc} onChange={setDoc} />
    );

  const status =
    route === "showcase"
      ? "STANDBY"
      : viewMode === "preview"
        ? "PREVIEW"
        : "STANDBY";

  return (
    <Shell
      topLeft={<Elbow corner="tl" />}
      topBar={
        <TopBar
          documentTitle={
            route === "showcase"
              ? "PRIMITIVES SHOWCASE"
              : docTitle.toUpperCase()
          }
          status={status}
          date={now}
        />
      }
      rail={
        <LeftRail
          viewMode={viewMode}
          onToggleViewMode={() =>
            setViewMode((m) => (m === "write" ? "preview" : "write"))
          }
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

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
import { useHashRoute } from "@/lib/use-hash-route";
import { newDoc, readingMinutes, wordCount } from "@/lib/document";

export function App() {
  const [doc, setDoc] = useState(() => newDoc());
  const [viewMode, setViewMode] = useState<ViewMode>("write");
  const route = useHashRoute();
  const now = new Date();

  const words = wordCount(doc.body);
  const chars = doc.body.length;
  const reading = readingMinutes(words);
  const docTitle = doc.title.trim() || "UNTITLED LOG ENTRY";

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
        />
      }
      stage={<CenterStage>{stageContent}</CenterStage>}
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

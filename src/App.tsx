import { useState } from "react";
import { Shell } from "@/components/Shell";
import { Elbow } from "@/components/primitives";
import { LeftRail } from "@/components/LeftRail";
import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";
import { CenterStage } from "@/components/CenterStage";
import { Showcase } from "@/components/Showcase";
import { Editor } from "@/components/Editor";
import { useHashRoute } from "@/lib/use-hash-route";
import { newDoc, readingMinutes, wordCount } from "@/lib/document";

export function App() {
  const [doc, setDoc] = useState(() => newDoc());
  const route = useHashRoute();
  const now = new Date();

  const words = wordCount(doc.body);
  const chars = doc.body.length;
  const reading = readingMinutes(words);
  const docTitle = doc.title.trim() || "UNTITLED LOG ENTRY";

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
          status="STANDBY"
          date={now}
        />
      }
      rail={<LeftRail />}
      stage={
        <CenterStage>
          {route === "showcase" ? (
            <Showcase />
          ) : (
            <Editor doc={doc} onChange={setDoc} />
          )}
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

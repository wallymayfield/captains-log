import { Shell } from "@/components/Shell";
import { Elbow } from "@/components/primitives";
import { LeftRail } from "@/components/LeftRail";
import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";
import { CenterStage } from "@/components/CenterStage";
import { Showcase } from "@/components/Showcase";
import { useHashRoute } from "@/lib/use-hash-route";

export function App() {
  const now = new Date();
  const route = useHashRoute();

  return (
    <Shell
      topLeft={<Elbow corner="tl" />}
      topBar={
        <TopBar
          documentTitle={
            route === "showcase" ? "PRIMITIVES SHOWCASE" : "UNTITLED LOG ENTRY"
          }
          status="STANDBY"
          date={now}
        />
      }
      rail={<LeftRail />}
      stage={
        <CenterStage>
          {route === "showcase" ? <Showcase /> : null}
        </CenterStage>
      }
      bottomLeft={<Elbow corner="bl" color="tan" />}
      bottomBar={
        <BottomBar words={0} characters={0} readingMinutes={0} date={now} />
      }
    />
  );
}

import { Shell } from "@/components/Shell";
import { Elbow } from "@/components/Elbow";
import { LeftRail } from "@/components/LeftRail";
import { TopBar } from "@/components/TopBar";
import { BottomBar } from "@/components/BottomBar";
import { CenterStage } from "@/components/CenterStage";

export function App() {
  const now = new Date();

  return (
    <Shell
      topLeft={<Elbow corner="tl" label="01-A" />}
      topBar={
        <TopBar
          documentTitle="UNTITLED LOG ENTRY"
          status="STANDBY"
          date={now}
        />
      }
      rail={<LeftRail />}
      stage={<CenterStage />}
      bottomLeft={
        <Elbow corner="bl" color="var(--lcars-tan)" label="02-B" />
      }
      bottomBar={
        <BottomBar words={0} characters={0} readingMinutes={0} date={now} />
      }
    />
  );
}

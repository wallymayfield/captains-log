import { useEffect, useState } from "react";

// Re-renders at intervalMs so live clocks (real date, stardate)
// stay current. Default interval is one minute — stardate at one
// decimal only changes every ~52 minutes, and the bottom-bar date
// only ticks at midnight, so anything finer is wasted work.
export function useTicker(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

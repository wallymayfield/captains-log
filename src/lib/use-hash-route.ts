import { useEffect, useState } from "react";

export type Route = "editor" | "schematic";

function parse(hash: string): Route {
  return hash === "#/schematic" ? "schematic" : "editor";
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parse(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

export function navigate(route: Route): void {
  window.location.hash = route === "schematic" ? "#/schematic" : "#/";
}

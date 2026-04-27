import { useEffect, useState } from "react";

export type Route = "editor" | "showcase";

function parse(hash: string): Route {
  return hash === "#/showcase" ? "showcase" : "editor";
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
  window.location.hash = route === "showcase" ? "#/showcase" : "#/";
}

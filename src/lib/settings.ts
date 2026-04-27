export type Settings = {
  soundsEnabled: boolean;
  volume: number; // 0..1
};

const DEFAULTS: Settings = { soundsEnabled: true, volume: 0.5 };
const KEY = "captains-log:settings";

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return DEFAULTS;
    const p = parsed as Record<string, unknown>;
    return {
      soundsEnabled: p["soundsEnabled"] === false ? false : true,
      volume:
        typeof p["volume"] === "number"
          ? Math.max(0, Math.min(1, p["volume"]))
          : DEFAULTS.volume,
    };
  } catch {
    return DEFAULTS;
  }
}

export function saveSettings(s: Settings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* localStorage unavailable; settings won't persist this session */
  }
}

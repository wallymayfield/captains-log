import { useEffect } from "react";
import { Pill } from "@/components/primitives";
import type { Settings } from "@/lib/settings";
import { play } from "@/lib/sound";

type SettingsPanelProps = {
  open: boolean;
  settings: Settings;
  onChange: (next: Settings) => void;
  onClose: () => void;
};

export function SettingsPanel({
  open,
  settings,
  onChange,
  onClose,
}: SettingsPanelProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const setEnabled = (v: boolean) =>
    onChange({ ...settings, soundsEnabled: v });
  const setVolume = (v: number) => onChange({ ...settings, volume: v });

  return (
    <div
      className="lcars-settings__backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="lcars-settings"
        role="dialog"
        aria-label="Settings"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="lcars-settings__header">
          <span className="lcars-settings__title">Settings</span>
          <span className="lcars-settings__id">07-1701</span>
        </header>

        <div className="lcars-settings__row">
          <span className="lcars-settings__label">Sounds</span>
          <Pill
            label={settings.soundsEnabled ? "ON" : "MUTED"}
            color={settings.soundsEnabled ? "orange" : "violet"}
            onClick={() => setEnabled(!settings.soundsEnabled)}
          />
        </div>

        <div className="lcars-settings__row">
          <label
            className="lcars-settings__label"
            htmlFor="lcars-volume"
          >
            Volume
          </label>
          <input
            id="lcars-volume"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="lcars-settings__slider"
            disabled={!settings.soundsEnabled}
          />
          <span className="lcars-settings__readout">
            {Math.round(settings.volume * 100)}%
          </span>
        </div>

        <div className="lcars-settings__row">
          <span className="lcars-settings__label">Test</span>
          <Pill
            label="CHIRP"
            color="peach"
            onClick={() => play("chirp")}
            disabled={!settings.soundsEnabled}
          />
          <Pill
            label="OK"
            color="blue"
            onClick={() => play("success")}
            disabled={!settings.soundsEnabled}
          />
          <Pill
            label="ERR"
            color="red"
            onClick={() => play("failure")}
            disabled={!settings.soundsEnabled}
          />
        </div>

        <p className="lcars-settings__note">
          Tip: the ship sounds red alert if you try to discard
          unsaved changes.
        </p>

        <footer className="lcars-settings__footer">
          <Pill label="DISMISS" color="orange" onClick={onClose} />
        </footer>
      </div>
    </div>
  );
}

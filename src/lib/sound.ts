// UI cues are synthesized with Web Audio (chirp / select / success / failure).
// The red alert klaxon is a CC0 sample (Kinoton, freesound.org) — synthesizing
// it convincingly turned out to be more work than it was worth.
// Settings are pushed in via setActiveSettings; play() reads the cached value
// so callers don't need to thread settings through every click.

import type { Settings } from "@/lib/settings";
import alertUrl from "@/assets/red-alert.mp3";

let active: Settings = { soundsEnabled: true, volume: 0.5 };
let ctx: AudioContext | null = null;
let alertAudio: HTMLAudioElement | null = null;

export function setActiveSettings(s: Settings): void {
  active = s;
  if (alertAudio) alertAudio.volume = s.volume;
  if (!s.soundsEnabled) stopRedAlert();
}

function getAlertAudio(): HTMLAudioElement {
  if (!alertAudio) {
    alertAudio = new Audio(alertUrl);
    alertAudio.loop = true;
    alertAudio.volume = active.volume;
    alertAudio.preload = "auto";
  }
  return alertAudio;
}

function getCtx(): AudioContext | null {
  if (ctx) return ctx;
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    return ctx;
  } catch {
    return null;
  }
}

export type SoundKind = "select" | "chirp" | "success" | "failure";

export function play(kind: SoundKind): void {
  if (!active.soundsEnabled) return;
  const c = getCtx();
  if (!c) return;
  // Browsers gate AudioContext until a user gesture; resume on demand.
  if (c.state === "suspended") void c.resume();
  switch (kind) {
    case "select":
      tone(c, 660, 50, active.volume * 0.8);
      break;
    case "chirp":
      tone(c, 880, 60, active.volume);
      break;
    case "success":
      sequence(c, [{ f: 523.25, d: 80 }, { f: 659.25, d: 140 }], active.volume);
      break;
    case "failure":
      sequence(c, [{ f: 329.63, d: 100 }, { f: 261.63, d: 220 }], active.volume);
      break;
  }
}

function tone(
  c: AudioContext,
  freq: number,
  durationMs: number,
  vol: number,
): void {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "triangle";
  osc.frequency.value = freq;
  const peak = Math.max(0.0001, vol * 0.3);
  gain.gain.value = 0;
  osc.connect(gain);
  gain.connect(c.destination);
  const now = c.currentTime;
  const seconds = durationMs / 1000;
  gain.gain.linearRampToValueAtTime(peak, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
  osc.start(now);
  osc.stop(now + seconds + 0.05);
}

function sequence(
  c: AudioContext,
  notes: { f: number; d: number }[],
  vol: number,
): void {
  let offset = 0;
  for (const n of notes) {
    const startAt = offset;
    setTimeout(() => tone(c, n.f, n.d, vol), startAt);
    offset += n.d;
  }
}

export function startRedAlert(): void {
  if (!active.soundsEnabled) return;
  const a = getAlertAudio();
  a.volume = active.volume;
  // Restart from the top so each engagement begins on the leading edge.
  a.currentTime = 0;
  void a.play().catch(() => {
    /* autoplay blocked until first user gesture; ignore */
  });
}

export function stopRedAlert(): void {
  if (!alertAudio) return;
  alertAudio.pause();
  alertAudio.currentTime = 0;
}

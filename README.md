# Captain's Log

A local-first markdown writer for blog posts and essays, themed entirely
after LCARS — the Library Computer Access and Retrieval System from
*Star Trek: The Next Generation*.

[Download](https://captainslog.xyz) ·
[Source](https://github.com/wallymayfield/captains-log) ·
[Report an issue](https://github.com/wallymayfield/captains-log/issues)

## What it is

Captain's Log is a single-purpose desktop app: it opens a markdown file,
lets you write, and saves it back. No accounts, no sync, no cloud. Files
live on disk where you put them. The app is offline by default and stays
that way.

The aesthetic is the bit. Okuda palette, Antonio type, soft confirmation
chirps, a working stardate readout, and an animated ship schematic that
can — for reasons of pure indulgence — engage warp.

## Install

Grab the latest installer for your platform from
[captainslog.xyz](https://captainslog.xyz).

| Platform               | File                  |
| ---------------------- | --------------------- |
| Windows 10/11          | `.msi` installer      |
| macOS (Apple Silicon)  | `.dmg`                |
| Linux                  | `.AppImage` or `.deb` |

Builds are unsigned. First launch will show one of these warnings; the
app is safe, just unblessed by Apple/Microsoft:

- **Windows.** SmartScreen says "Windows protected your PC." Click
  *More info* → *Run anyway*.
- **macOS.** Gatekeeper says it can't check the app for malicious
  software. Right-click the app in Finder → *Open* → *Open*. macOS
  remembers the choice.
- **Linux.** Make the AppImage executable: `chmod +x Captain*.AppImage`.

## Features

- Markdown editor with auto-grow and live preview toggle
- YAML frontmatter parsed and rendered out of the body
- File new / open / save / save-as via native dialogs
- Find and replace
- Stardate readout, status indicators, dirty-state tracking
- Synthesized UI tones with volume control and a mute switch
- Red alert klaxon if you try to discard unsaved work
- 3D ship schematic page with a working warp drive

## Keyboard shortcuts

All bindings use ⌘ on macOS, Ctrl on Windows and Linux.

| Action            | Shortcut             |
| ----------------- | -------------------- |
| New               | ⌘ / Ctrl + N         |
| Open              | ⌘ / Ctrl + O         |
| Save              | ⌘ / Ctrl + S         |
| Save As           | ⌘ / Ctrl + Shift + S |
| Toggle preview    | ⌘ / Ctrl + P         |
| Find              | ⌘ / Ctrl + F         |
| Markdown help     | ⌘ / Ctrl + /         |
| Settings          | ⌘ / Ctrl + ,         |

## Build from source

Requires Node 20+ and Rust (stable). Install Rust via
[rustup](https://rustup.rs).

```sh
npm install
npm run tauri:dev      # dev with hot reload
npm run tauri:build    # produces installers in src-tauri/target/release/bundle/
```

Linux additionally needs the WebKitGTK toolchain:

```sh
sudo apt-get install \
  libwebkit2gtk-4.1-dev \
  libsoup-3.0-dev \
  libjavascriptcoregtk-4.1-dev \
  libgtk-3-dev \
  librsvg2-dev \
  libappindicator3-dev \
  patchelf
```

## Tech stack

Tauri 2 (Rust core) wrapping a React + TypeScript + Vite frontend. The
3D ship is `react-three-fiber`. Markdown is rendered with `marked` plus
`marked-footnote` and `marked-highlight`, then sanitized with
`DOMPurify`. UI tones are synthesized live via the Web Audio API; sample
audio is CC-BY 4.0 (see [`src/assets/CREDITS.md`](./src/assets/CREDITS.md)).

## Releases

Releases are built by GitHub Actions on tag push and uploaded as a draft
to [Releases](https://github.com/wallymayfield/captains-log/releases).
The download page at [captainslog.xyz](https://captainslog.xyz) links
through to the latest published artifacts.

## Contributing

This app is deliberately small. Read
[CONTRIBUTING.md](./CONTRIBUTING.md) before opening a feature PR —
there's a one-question filter that decides what's in scope.

## License

MIT. See [LICENSE](./LICENSE). Audio assets are CC-BY 4.0 with
attribution in [`src/assets/CREDITS.md`](./src/assets/CREDITS.md).

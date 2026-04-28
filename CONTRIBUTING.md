# Contributing

Captain's Log is a hobby project with a deliberately narrow scope.
Pull requests and bug reports are welcome, but feature work runs through
one filter:

> **Does this make Captain's Log do its one job better, or does it add
> a second job?**

Its one job is to open a markdown file, let you write in it, and save
it. Anything that pushes toward "kitchen-sink editor" gets bounced.

There's also a parallel question for visual changes:

> **Does this respect LCARS, or does it cosplay it?**

LCARS has a real visual grammar — the Okuda palette, Antonio type,
elbow corners, no scanlines, no blinking text. Sticking close to that
grammar is part of the project's identity.

## In scope

- Editor improvements: typography, navigation, find/replace, frontmatter
  handling, keyboard shortcuts.
- File IO: better dialogs, error handling, reliability.
- LCARS polish: typography, color, sound, motion — within the
  established palette and constraints.
- Bug fixes.
- Build and install ergonomics across Windows, macOS, and Linux.
- Documentation and accessibility.

## Out of scope

These have been considered and ruled out. Don't write code for them
without opening an issue first; PRs that add them will likely be closed.

- Cloud sync, accounts, sharing
- Image management
- Theme customization (LCARS *is* the theme — that's the bit)
- Plugin systems
- Tabs or multiple posts open at once
- Mobile
- AI features

If you have a strong case for one of these, open an issue and make it
before writing the code. Implementations that arrive without a prior
conversation are nearly always rejected.

## Development

```sh
npm install
npm run tauri:dev
```

See [README.md](./README.md#build-from-source) for platform-specific
prerequisites.

### Style

- TypeScript strict mode. No `any`.
- React function components only.
- Components live in `src/components/`. Pure logic and hooks live in
  `src/lib/`.
- Tests sit next to the code they test (`*.test.ts`).
- Run `npm run lint` and `npm test` before opening a PR.
- Commit messages: short, present tense, sentence case
  ("Add X", "Fix Y", "Drop Z").

## Pull requests

- One feature or fix per PR.
- Include a clear description of the user-facing change.
- Screenshots for UI changes.
- Don't bundle unrelated refactors. They make review harder and slower.

## Reporting bugs

Open an issue with:

- What you did
- What you expected
- What actually happened
- OS and app version

A small reproduction repo or sample markdown file helps a lot.

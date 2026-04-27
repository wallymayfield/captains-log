# Icons

Tauri requires platform icon files at build time. Generate the full set
from a single source PNG (1024×1024 recommended) with:

```sh
npm run tauri icon path/to/source.png
```

Until then, this directory is a placeholder. The bundle config references:

- `32x32.png`
- `128x128.png`
- `128x128@2x.png`
- `icon.icns` (macOS)
- `icon.ico` (Windows)

`tauri dev` works without these; `tauri build` requires them.

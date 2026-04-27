import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import type { Doc } from "@/lib/document";
import { parseDoc, serializeDoc } from "@/lib/frontmatter";

const FILTERS = [
  { name: "Markdown", extensions: ["md", "markdown"] },
  { name: "All files", extensions: ["*"] },
];

export type LoadResult = { doc: Doc; path: string };

export async function pickAndOpen(): Promise<LoadResult | null> {
  const selected = await open({ filters: FILTERS, multiple: false });
  if (!selected) return null;
  const path = Array.isArray(selected) ? (selected[0] ?? null) : selected;
  if (!path) return null;
  const content = await readTextFile(path);
  return { doc: parseDoc(content), path };
}

export async function pickAndSave(
  doc: Doc,
  suggested?: string,
): Promise<string | null> {
  const path = await save({
    filters: FILTERS,
    defaultPath: suggested ?? defaultFileName(doc),
  });
  if (!path) return null;
  await writeTextFile(path, serializeDoc(doc));
  return path;
}

export async function writeToPath(doc: Doc, path: string): Promise<void> {
  await writeTextFile(path, serializeDoc(doc));
}

function defaultFileName(doc: Doc): string {
  const slug =
    (doc.title || "untitled")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "untitled";
  return `${doc.date}-${slug}.md`;
}

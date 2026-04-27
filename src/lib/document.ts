export type Doc = {
  title: string;
  date: string;
  excerpt: string;
  body: string;
};

export function formatISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function newDoc(date: Date = new Date()): Doc {
  return {
    title: "",
    date: formatISODate(date),
    excerpt: "",
    body: "",
  };
}

const WORD_RE = /\S+/g;

export function wordCount(text: string): number {
  return (text.match(WORD_RE) ?? []).length;
}

// 225 wpm baseline; 0 words → 0 minutes.
export function readingMinutes(words: number): number {
  return words === 0 ? 0 : Math.max(1, Math.ceil(words / 225));
}

export function docsEqual(a: Doc, b: Doc): boolean {
  return (
    a.title === b.title &&
    a.date === b.date &&
    a.excerpt === b.excerpt &&
    a.body === b.body
  );
}

export function basename(p: string): string {
  const parts = p.split(/[\\/]/);
  return parts[parts.length - 1] ?? p;
}

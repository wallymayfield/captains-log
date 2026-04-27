import { formatISODate, type Doc } from "@/lib/document";

const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

export function serializeDoc(doc: Doc): string {
  const title = escapeYamlDouble(doc.title);
  const excerpt = escapeYamlDouble(doc.excerpt);
  return `---\ntitle: "${title}"\ndate: ${doc.date}\nexcerpt: "${excerpt}"\n---\n${doc.body}`;
}

export function parseDoc(raw: string): Doc {
  const today = formatISODate(new Date());
  const m = raw.match(FM_RE);
  if (!m) {
    return { title: "", date: today, excerpt: "", body: raw };
  }
  const fm = m[1] ?? "";
  const body = m[2] ?? "";
  const data = parseSimpleYaml(fm);
  return {
    title: data.get("title") ?? "",
    date: data.get("date") ?? today,
    excerpt: data.get("excerpt") ?? "",
    body,
  };
}

function escapeYamlDouble(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

function unescapeYamlDouble(s: string): string {
  return s.replace(/\\(["\\nrt])/g, (_, c: string) => {
    if (c === "n") return "\n";
    if (c === "t") return "\t";
    if (c === "r") return "\r";
    return c;
  });
}

function parseSimpleYaml(fm: string): Map<string, string> {
  const result = new Map<string, string>();
  for (const line of fm.split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val.length >= 2 && val.startsWith('"') && val.endsWith('"')) {
      val = unescapeYamlDouble(val.slice(1, -1));
    }
    result.set(key, val);
  }
  return result;
}

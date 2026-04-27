import { describe, expect, it } from "vitest";
import type { Doc } from "./document";
import { parseDoc, serializeDoc } from "./frontmatter";

const sample: Doc = {
  title: "First Contact",
  date: "2161-04-05",
  excerpt: "Notes on the day everything changed.",
  body: "## Heading\n\nA paragraph with **emphasis**.\n",
};

describe("serializeDoc", () => {
  it("produces the exact expected format", () => {
    const out = serializeDoc(sample);
    expect(out).toBe(
      [
        "---",
        'title: "First Contact"',
        "date: 2161-04-05",
        'excerpt: "Notes on the day everything changed."',
        "---",
        "## Heading",
        "",
        "A paragraph with **emphasis**.",
        "",
      ].join("\n"),
    );
  });

  it("escapes embedded quotes and backslashes in title and excerpt", () => {
    const tricky: Doc = {
      title: 'A "quoted" \\ slash',
      date: "2161-04-05",
      excerpt: "Line 1\nLine 2",
      body: "x",
    };
    const out = serializeDoc(tricky);
    expect(out).toContain('title: "A \\"quoted\\" \\\\ slash"');
    expect(out).toContain('excerpt: "Line 1\\nLine 2"');
  });
});

describe("parseDoc", () => {
  it("round-trips a serialized doc byte-identical", () => {
    const out = serializeDoc(sample);
    const back = parseDoc(out);
    expect(back).toEqual(sample);
    expect(serializeDoc(back)).toBe(out);
  });

  it("round-trips a doc with escapes", () => {
    const tricky: Doc = {
      title: 'A "quoted" \\ slash',
      date: "2161-04-05",
      excerpt: "Line 1\nLine 2",
      body: "Body with --- inside that should not match a delimiter line.\n",
    };
    expect(parseDoc(serializeDoc(tricky))).toEqual(tricky);
  });

  it("falls back gracefully when there is no frontmatter", () => {
    const result = parseDoc("Just a body, no frontmatter.\n");
    expect(result.title).toBe("");
    expect(result.excerpt).toBe("");
    expect(result.body).toBe("Just a body, no frontmatter.\n");
  });

  it("preserves the body verbatim, including trailing newlines", () => {
    const doc: Doc = {
      title: "x",
      date: "2026-04-27",
      excerpt: "y",
      body: "line one\nline two\n\n",
    };
    const back = parseDoc(serializeDoc(doc));
    expect(back.body).toBe("line one\nline two\n\n");
  });
});

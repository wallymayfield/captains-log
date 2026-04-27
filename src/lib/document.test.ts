import { describe, expect, it } from "vitest";
import {
  formatISODate,
  newDoc,
  readingMinutes,
  wordCount,
} from "./document";

describe("formatISODate", () => {
  it("zero-pads month and day", () => {
    expect(formatISODate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("wordCount", () => {
  it("counts whitespace-separated runs", () => {
    expect(wordCount("hello  world\n\nthird line")).toBe(4);
  });

  it("returns 0 for empty/whitespace-only input", () => {
    expect(wordCount("")).toBe(0);
    expect(wordCount("   \n\t  ")).toBe(0);
  });
});

describe("readingMinutes", () => {
  it("returns 0 for 0 words", () => {
    expect(readingMinutes(0)).toBe(0);
  });

  it("rounds up to at least 1 minute for any non-zero count", () => {
    expect(readingMinutes(1)).toBe(1);
    expect(readingMinutes(225)).toBe(1);
    expect(readingMinutes(226)).toBe(2);
  });
});

describe("newDoc", () => {
  it("starts with empty fields and an ISO date", () => {
    const d = newDoc(new Date(2026, 3, 27));
    expect(d.title).toBe("");
    expect(d.excerpt).toBe("");
    expect(d.body).toBe("");
    expect(d.date).toBe("2026-04-27");
  });
});

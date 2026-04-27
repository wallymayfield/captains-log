import { describe, expect, it } from "vitest";
import { formatStardate, stardateFromDate } from "./stardate";

const utc = (y: number, m: number, d: number, h = 0, mi = 0) =>
  new Date(Date.UTC(y, m - 1, d, h, mi));

describe("stardateFromDate", () => {
  it("is exactly 0 at the epoch start (2323-01-01 UTC)", () => {
    expect(stardateFromDate(utc(2323, 1, 1))).toBe(0);
  });

  it("advances by exactly 1000 per year", () => {
    expect(stardateFromDate(utc(2324, 1, 1))).toBe(1000);
    expect(stardateFromDate(utc(2347, 1, 1))).toBe(24000);
  });

  it("hits the midpoint of a common year at ~500", () => {
    // 2326 is a common year (not divisible by 4).
    const sd = stardateFromDate(utc(2326, 7, 2, 12)); // ~midyear
    expect(sd).toBeGreaterThan(3000 + 499);
    expect(sd).toBeLessThan(3000 + 501);
  });

  it("hits the midpoint of a leap year at ~500 too", () => {
    // 2324 is divisible by 4 and not a Gregorian century rule exception.
    const sd = stardateFromDate(utc(2324, 7, 2, 0));
    expect(sd).toBeGreaterThan(1000 + 499);
    expect(sd).toBeLessThan(1000 + 501);
  });

  it("approaches but does not reach the next year's value", () => {
    const sd = stardateFromDate(utc(2323, 12, 31, 23, 59));
    expect(sd).toBeGreaterThan(998);
    expect(sd).toBeLessThan(1000);
  });

  it("returns negative values for pre-TNG dates", () => {
    expect(stardateFromDate(utc(2322, 1, 1))).toBe(-1000);
    expect(stardateFromDate(utc(2000, 1, 1))).toBe(-323000);
  });
});

describe("formatStardate", () => {
  it("formats with one decimal place", () => {
    expect(formatStardate(utc(2324, 1, 1))).toBe("1000.0");
  });

  it("uses a leading minus for pre-TNG dates", () => {
    expect(formatStardate(utc(2322, 1, 1))).toBe("-1000.0");
  });

  it("returns an em dash for invalid dates", () => {
    expect(formatStardate(new Date(NaN))).toBe("—");
  });
});

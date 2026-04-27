/**
 * TNG stardate formula: year 2323 = stardate 0, ~1000 units per year.
 * Step 1 uses this minimal version; step 6 adds tests and edge cases
 * (leap years, formatting, post dates pre-/post-TNG era).
 */

const TNG_EPOCH_YEAR = 2323;
const UNITS_PER_YEAR = 1000;

export function stardateFromDate(date: Date): number {
  const year = date.getUTCFullYear();
  const startOfYear = Date.UTC(year, 0, 1);
  const startOfNext = Date.UTC(year + 1, 0, 1);
  const fraction = (date.getTime() - startOfYear) / (startOfNext - startOfYear);
  return (year - TNG_EPOCH_YEAR) * UNITS_PER_YEAR + fraction * UNITS_PER_YEAR;
}

export function formatStardate(date: Date): string {
  const sd = stardateFromDate(date);
  return sd.toFixed(1);
}

// TNG-era stardate formula: 1000 units per Earth year, with year 2323
// as stardate 0. Year length is computed from actual UTC boundaries so
// leap years (366 days) and common years (365 days) both work out.

const TNG_EPOCH_YEAR = 2323;
const UNITS_PER_YEAR = 1000;

export function stardateFromDate(date: Date): number {
  const year = date.getUTCFullYear();
  const startOfYear = Date.UTC(year, 0, 1);
  const startOfNext = Date.UTC(year + 1, 0, 1);
  const fraction =
    (date.getTime() - startOfYear) / (startOfNext - startOfYear);
  return (year - TNG_EPOCH_YEAR) * UNITS_PER_YEAR + fraction * UNITS_PER_YEAR;
}

export function formatStardate(date: Date): string {
  const sd = stardateFromDate(date);
  if (Number.isNaN(sd)) return "—";
  // Round to 1 decimal; preserve sign for pre-TNG dates (decorative).
  const sign = sd < 0 ? "-" : "";
  return `${sign}${Math.abs(sd).toFixed(1)}`;
}

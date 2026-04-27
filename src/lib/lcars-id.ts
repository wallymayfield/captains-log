// Cosmetic numbered IDs ("01-2847") shown in the corner of LCARS bars.
// Must be deterministic from the seed so re-renders don't reshuffle them.

export function lcarsId(seed: string): string {
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) + hash + seed.charCodeAt(i)) | 0;
  }
  const u = Math.abs(hash);
  const prefix = String((u % 99) + 1).padStart(2, "0");
  const suffix = String(u % 10000).padStart(4, "0");
  return `${prefix}-${suffix}`;
}

// How many of `count` items to show in a `columns`-wide grid so the last
// row is never partly empty — e.g. 3 cards in a 2-column grid show 2,
// not 2 + one on its own. A single row (count <= columns) is kept as-is,
// since dropping cards there would only leave the grid emptier.
export function fullRowCount(count: number, columns: number): number {
  return count <= columns ? count : count - (count % columns);
}

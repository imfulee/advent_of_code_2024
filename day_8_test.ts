import { expect } from "jsr:@std/expect/expect";
import { calcAntinodePosition } from "./day_8.ts";

Deno.test("calc antinode position", () => {
  const mapPlot = [
    [".", ".", ".", "."],
    [".", "a", ".", "."],
    [".", ".", "a", "."],
    [".", ".", ".", "."],
  ];
  const antinodes = calcAntinodePosition(
    { row: 1, col: 1 },
    { row: 2, col: 2 },
    mapPlot
  );
  expect(antinodes).toHaveLength(2);
  expect(antinodes).toEqual([
    { row: 0, col: 0 },
    { row: 3, col: 3 },
  ]);
});

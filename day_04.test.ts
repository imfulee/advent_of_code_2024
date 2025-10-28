import { expect } from "jsr:@std/expect/expect";
import {
  calcXmasBackwardDiagnonal,
  calcXmasHorizontally,
  calcXmasInstance,
  isCrossXmasBlock,
  parse,
} from "./day_4.ts";

Deno.test("Parser", () => {
  const testData = `MMMSXXMASM
MSAMXMSMSA
AXSSXMAAMM`;
  const puzzle = parse(testData);
  expect(puzzle).toHaveLength(10);
  expect(puzzle).toEqual([
    ["M", "M", "M", "S", "X", "X", "M", "A", "S", "M"],
    ["M", "S", "A", "M", "X", "M", "S", "M", "S", "A"],
    ["A", "X", "S", "S", "X", "M", "A", "A", "M", "M"],
  ]);
});

Deno.test("Count horizontally", () => {
  expect(calcXmasHorizontally([["X", "M", "A", "S"]])).toBe(1);
});

Deno.test("Count backward diagonal", () => {
  expect(
    calcXmasBackwardDiagnonal([
      [".", ".", ".", "S"],
      [".", ".", "A", "."],
      [".", "M", ".", "."],
      ["X", ".", ".", "."],
    ]),
  ).toBe(1);
});

Deno.test("End to end count", () => {
  const testData = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX`;

  const puzzle = parse(testData);
  const count = calcXmasInstance(puzzle);
  expect(count).toBe(3);
});

Deno.test("isCrossXmasBlock", () => {
  expect(
    isCrossXmasBlock([
      [".", ".", "."],
      [".", ".", "A"],
      [".", "M", "."],
    ]),
  ).toBe(false);

  expect(
    isCrossXmasBlock([
      ["S", ".", "S"],
      [".", "A", "."],
      ["M", ".", "M"],
    ]),
  ).toBe(true);

  expect(
    isCrossXmasBlock([
      ["M", ".", "S"],
      [".", "A", "."],
      ["M", ".", "S"],
    ]),
  ).toBe(true);

  expect(
    isCrossXmasBlock([
      ["S", ".", "M"],
      [".", "A", "."],
      ["M", ".", "S"],
    ]),
  ).toBe(false);
});

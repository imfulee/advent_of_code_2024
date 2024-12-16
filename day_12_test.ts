import { expect } from "jsr:@std/expect/expect";
import { calcBorders, Border } from "./day_12.ts";

Deno.test("calc borders - only 1 tile", () => {
  const input = [["A"]];
  const borders = calcBorders(input, { row: 0, col: 0 });
  expect(borders).toEqual(
    expect.arrayContaining([
      Border.Top,
      Border.Left,
      Border.Right,
      Border.Bottom,
    ]),
  );
});

Deno.test("calc borders - angled tile", () => {
  const input = [
    ["A", "A"],
    ["A", "B"],
  ];
  const borders = calcBorders(input, { row: 0, col: 0 });
  expect(borders).toEqual(expect.arrayContaining([Border.Top, Border.Left]));
});

Deno.test("calc borders - donuted", () => {
  const input = [
    ["A", "A", "A"],
    ["A", "B", "A"],
    ["A", "A", "A"],
  ];

  expect(calcBorders(input, { row: 1, col: 0 })).toEqual(
    expect.arrayContaining([Border.Right, Border.Left]),
  );
});

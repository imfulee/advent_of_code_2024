import {
  parse,
  calcMultiplications,
  calcMultiplication,
  flaggedParse,
} from "./day_3.ts";
import { expect } from "jsr:@std/expect";

Deno.test("Parser", () => {
  const testData = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;
  const multiplications = parse(testData);
  expect(multiplications).toHaveLength(4);
  expect(multiplications[0]).toEqual([2, 4]);
  expect(multiplications[1]).toEqual([5, 5]);
  expect(multiplications[2]).toEqual([11, 8]);
  expect(multiplications[3]).toEqual([8, 5]);
});

Deno.test("Flagged parser", () => {
  const testData = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;
  const multiplications = flaggedParse(testData);
  expect(multiplications).toHaveLength(2);
  expect(multiplications[0]).toEqual([2, 4]);
  expect(multiplications[1]).toEqual([8, 5]);
});

Deno.test("Multiplication", () => {
  expect(calcMultiplication([2, 4])).toBe(8);
  expect(calcMultiplication([1, 2, 3, 4])).toBe(24);
});

Deno.test("Multiplications Sum", () => {
  expect(
    calcMultiplications([
      [2, 4],
      [5, 5],
      [11, 8],
      [8, 5],
    ]),
  ).toBe(161);
});

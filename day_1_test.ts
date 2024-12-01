import { expect } from "jsr:@std/expect";
import { parse, calcDistance, calcSimilarity } from "./day_1.ts";

Deno.test("Parser", () => {
  const testData = `3   4
4   3
2   5
1   3
3   9
3   3`;
  const { left, right } = parse(testData);
  expect(left).toEqual(expect.arrayContaining([3, 4, 2, 1, 3, 3]));
  expect(right).toEqual(expect.arrayContaining([4, 3, 5, 3, 9, 3]));
});

Deno.test("Distance counter", () => {
  const left = [3, 4, 2, 1, 3, 3];
  const right = [4, 3, 5, 3, 9, 3];
  const distance = calcDistance(left, right);

  expect(distance).toBe(11);
});

Deno.test("Similarity similarity", () => {
  const left = [3, 4, 2, 1, 3, 3];
  const right = [4, 3, 5, 3, 9, 3];
  const distance = calcSimilarity(left, right);

  expect(distance).toBe(31);
});

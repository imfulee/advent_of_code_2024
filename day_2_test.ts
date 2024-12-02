import { expect } from "jsr:@std/expect";
import {
  isNormalValidReport,
  parse,
  calcValidReports,
  isDampenedValidReport,
} from "./day_2.ts";

Deno.test("Parser", () => {
  const testData = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;
  const reports = parse(testData);
  expect(reports[0]).toEqual([7, 6, 4, 2, 1]);
  expect(reports[1]).toEqual([1, 2, 7, 8, 9]);
  expect(reports[2]).toEqual([9, 7, 6, 2, 1]);
  expect(reports[3]).toEqual([1, 3, 2, 4, 5]);
  expect(reports[4]).toEqual([8, 6, 4, 4, 1]);
  expect(reports[5]).toEqual([1, 3, 6, 7, 9]);
});

Deno.test("Valid report checker - normal", () => {
  expect(isNormalValidReport([7, 6, 4, 2, 1])).toBe(true);
  expect(isNormalValidReport([1, 2, 7, 8, 9])).toBe(false);
  expect(isNormalValidReport([9, 7, 6, 2, 1])).toBe(false);
  expect(isNormalValidReport([1, 3, 2, 4, 5])).toBe(false);
  expect(isNormalValidReport([8, 6, 4, 4, 1])).toBe(false);
  expect(isNormalValidReport([1, 3, 6, 7, 9])).toBe(true);
});

Deno.test("Valid report checker - dampened", () => {
  expect(isDampenedValidReport([7, 6, 4, 2, 1])).toBe(true);
  expect(isDampenedValidReport([1, 2, 7, 8, 9])).toBe(false);
  expect(isDampenedValidReport([9, 7, 6, 2, 1])).toBe(false);
  expect(isDampenedValidReport([1, 3, 2, 4, 5])).toBe(true);
  expect(isDampenedValidReport([8, 6, 4, 4, 1])).toBe(true);
  expect(isDampenedValidReport([1, 3, 6, 7, 9])).toBe(true);
});

Deno.test("Valid report count", () => {
  const testData = [
    [7, 6, 4, 2, 1],
    [1, 2, 7, 8, 9],
    [9, 7, 6, 2, 1],
    [1, 3, 2, 4, 5],
    [8, 6, 4, 4, 1],
    [1, 3, 6, 7, 9],
  ];

  expect(calcValidReports(testData, isNormalValidReport)).toBe(2);
  expect(calcValidReports(testData, isDampenedValidReport)).toBe(4);
});

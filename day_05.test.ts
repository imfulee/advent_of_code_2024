import { splitTextBodies, swapArrayIndex, fixReport } from "./day_5.ts";
import { expect } from "jsr:@std/expect/expect";

Deno.test("splitTextBodies", () => {
  const testData = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

  const { rules, reports } = splitTextBodies(testData);
  expect(rules).toEqual([
    "47|53",
    "97|13",
    "97|61",
    "97|47",
    "75|29",
    "61|13",
    "75|53",
    "29|13",
    "97|29",
    "53|29",
    "61|53",
    "97|53",
    "61|29",
    "47|13",
    "75|47",
    "97|75",
    "47|61",
    "75|61",
    "47|29",
    "75|13",
    "53|13",
  ]);

  expect(reports).toEqual([
    "75,47,61,53,29",
    "97,61,53,29,13",
    "75,29,13",
    "75,97,47,61,53",
    "61,13,29",
    "97,13,75,29,47",
  ]);
});

Deno.test("swap array index", () => {
  expect(swapArrayIndex([1, 2, 3], 0, 2)).toEqual([3, 2, 1]);
});

Deno.test("fix report", () => {
  const ruleMap = new Map([
    [47, new Set([53, 13, 61, 29])],
    [97, new Set([13, 61, 47, 29, 53, 75])],
    [75, new Set([29, 53, 47, 61, 13])],
    [61, new Set([13, 53, 29])],
    [29, new Set([13])],
    [53, new Set([29, 13])],
  ]);
  expect(fixReport([75, 97, 47, 61, 53], ruleMap)).toEqual([
    97, 75, 47, 61, 53,
  ]);
});

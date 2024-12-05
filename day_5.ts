import { assert } from "@std/assert/assert";
import { readFile } from "./reader.ts";

type RuleMap = Map<number, Set<number>>;

export function splitTextBodies(text: string): {
  rules: string[];
  reports: string[];
} {
  const lines = text.split("\n");
  const emptyLineIndex = lines.findIndex((l) => l === "");
  return {
    rules: lines.slice(0, emptyLineIndex),
    reports: lines.slice(emptyLineIndex + 1, lines.length),
  };
}

export function parseRules(lines: string[]) {
  const ruleMap: RuleMap = new Map();
  for (const line of lines) {
    const pages = line.split("|");
    assert(pages.length === 2, "must have two pages in a line");
    const before = parseInt(pages[0], 10);
    const after = parseInt(pages[1], 10);
    const afters = ruleMap.get(before) || new Set();
    afters.add(after);
    ruleMap.set(before, afters);
  }
  return ruleMap;
}

export function parseReports(lines: string[]) {
  const reports = lines.map((l) =>
    l.split(",").map((page) => parseInt(page.trim(), 10)),
  );
  return reports;
}

export function isValidReport(report: number[], ruleMap: RuleMap): boolean {
  for (let i = 0; i < report.length; i++) {
    const rule = ruleMap.get(report[i]);
    if (!rule) {
      continue;
    }
    const numbersBeforeCurrent = report.slice(0, i + 1);
    const hasInvalidNumber = !!numbersBeforeCurrent.find((n) => rule.has(n));
    if (hasInvalidNumber) {
      return false;
    }
  }

  return true;
}

export function getMiddleNumber(report: number[]) {
  assert(report.length !== 0, "report cannot be length 0");
  const middleIndex = Math.floor(report.length / 2);
  return report[middleIndex];
}

export function calcSumMiddleNumber(reports: number[][], ruleMap: RuleMap) {
  const sum = reports.reduce((currentSum, report) => {
    if (!isValidReport(report, ruleMap)) {
      return currentSum;
    }
    const middleNumber = getMiddleNumber(report);
    return currentSum + middleNumber;
  }, 0);
  return sum;
}

export function findWrongUpdate(
  report: number[],
  ruleMap: RuleMap,
): {
  wrongUpdateIndex: number;
  shouldBeAfterIndex: number;
} {
  const rtnObj = { wrongUpdateIndex: -1, shouldBeAfterIndex: -1 };

  for (let i = 0; i < report.length; i++) {
    const rule = ruleMap.get(report[i]);
    if (!rule) {
      continue;
    }
    const numbersBeforeCurrent = report.slice(0, i + 1);
    const invalidNumberIndex = numbersBeforeCurrent.findIndex((n) =>
      rule.has(n),
    );
    if (invalidNumberIndex !== -1) {
      return {
        wrongUpdateIndex: i,
        shouldBeAfterIndex: invalidNumberIndex,
      };
    }
  }

  return rtnObj;
}

export function swapArrayIndex<T>(
  array: T[],
  index1: number,
  index2: number,
): T[] {
  assert(
    0 <= index1 && index1 < array.length,
    "index1 is not within bounds of report",
  );
  assert(
    0 <= index2 && index2 < array.length,
    "index2 is not within bounds of report",
  );

  const swapped = structuredClone(array);
  [swapped[index1], swapped[index2]] = [swapped[index2], swapped[index1]];

  return swapped;
}

export function fixReport(report: number[], ruleMap: RuleMap): number[] {
  let cReport = structuredClone(report);
  let { wrongUpdateIndex, shouldBeAfterIndex } = findWrongUpdate(
    cReport,
    ruleMap,
  );

  while (wrongUpdateIndex !== -1) {
    cReport = swapArrayIndex(cReport, wrongUpdateIndex, shouldBeAfterIndex);
    const wrongUpdate = findWrongUpdate(cReport, ruleMap);
    wrongUpdateIndex = wrongUpdate.wrongUpdateIndex;
    shouldBeAfterIndex = wrongUpdate.shouldBeAfterIndex;
  }

  return cReport;
}

export function calcSumFixedMiddleNumber(
  reports: number[][],
  ruleMap: RuleMap,
): number {
  const sum = reports.reduce((currentSum, report) => {
    if (isValidReport(report, ruleMap)) {
      return currentSum;
    }
    const fixedReport = fixReport(report, ruleMap);
    const middleNumber = getMiddleNumber(fixedReport);
    return currentSum + middleNumber;
  }, 0);
  return sum;
}

if (import.meta.main) {
  let data = await readFile("./day_5_data.txt");
  data = data.slice(0, data.length - 1);
  const { rules: ruleLines, reports: reportLines } = splitTextBodies(data);
  const ruleMap = parseRules(ruleLines);
  const reports = parseReports(reportLines);
  console.log(calcSumMiddleNumber(reports, ruleMap));
  console.log(calcSumFixedMiddleNumber(reports, ruleMap));
}

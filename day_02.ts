import { readFile } from "./reader.ts";

export function parse(text: string): number[][] {
  const reports: number[][] = [];

  const lines = text.split("\n");
  for (const line of lines) {
    const levels = line
      .split(" ")
      .filter((t) => t !== "")
      .map((t) => parseInt(t, 10));
    reports.push(levels);
  }

  return reports;
}

export function isNormalValidReport(report: number[]): boolean {
  if (report.length === 0) {
    throw new Error("invalid report length");
  }
  if (report.length === 1) {
    return true;
  }

  const isIncreasing = report[1] - report[0] > 0;
  for (let i = 0; i < report.length - 1; i++) {
    const difference = report[i + 1] - report[i];
    if (isIncreasing && difference < 0) {
      return false;
    } else if (!isIncreasing && difference > 0) {
      return false;
    }

    const absDifference = Math.abs(difference);
    if (absDifference > 3 || absDifference < 1) {
      return false;
    }
  }

  return true;
}

export function isDampenedValidReport(report: number[]): boolean {
  if (isNormalValidReport(report)) {
    return true;
  }

  for (let i = 0; i < report.length; i++) {
    const dampenedReport = [
      ...report.slice(0, i),
      ...report.slice(i + 1, report.length),
    ];
    if (isNormalValidReport(dampenedReport)) {
      return true;
    }
  }

  return false;
}

interface IIsValidReport {
  (report: number[]): boolean;
}

export function calcValidReports(
  reports: number[][],
  isValidReport: IIsValidReport,
): number {
  const validReportCount = reports.reduce((count, report) => {
    if (isValidReport(report)) {
      return count + 1;
    }
    return count;
  }, 0);
  return validReportCount;
}

if (import.meta.main) {
  const testData = await readFile("./day_2_data.txt");
  const reports = parse(testData);
  const normalCount = calcValidReports(reports, isNormalValidReport);
  const dampenedCount = calcValidReports(reports, isDampenedValidReport);
  console.log(normalCount, dampenedCount);
}

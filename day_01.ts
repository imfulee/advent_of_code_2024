import { assert } from "jsr:@std/assert";
import { readFile } from "./reader.ts";

export function parse(text: string): { left: number[]; right: number[] } {
  const leftList: number[] = [];
  const rightList: number[] = [];

  const lines = text.split("\n");
  for (const line of lines) {
    const numbers = line.split(" ").filter((t) => t !== "");
    if (numbers.length != 2) {
      throw new Error("Bad input ::: more than 2 numbers in a row");
    }
    leftList.push(parseInt(numbers[0], 10));
    rightList.push(parseInt(numbers[1], 10));
  }

  return { left: leftList, right: rightList };
}

export function calcDistance(
  leftArray: number[],
  rightArray: number[],
): number {
  assert(
    leftArray.length === rightArray.length,
    "left and right array of not same length",
  );

  const sortedLeft = leftArray.toSorted();
  const sortedRight = rightArray.toSorted();
  let distance = 0;

  for (let i = 0; i < sortedLeft.length; i++) {
    distance += Math.abs(sortedLeft[i] - sortedRight[i]);
  }

  return distance;
}

export function calcSimilarity(
  leftArray: number[],
  rightArray: number[],
): number {
  assert(
    leftArray.length === rightArray.length,
    "left and right array of not same length",
  );

  let similarity = 0;

  const rightMap: Map<number, number> = new Map();
  for (const num of rightArray) {
    const count = rightMap.get(num);
    if (!count) {
      rightMap.set(num, 1);
      continue;
    }
    rightMap.set(num, count + 1);
  }

  for (const num of leftArray) {
    const count = rightMap.get(num);
    if (!count) {
      continue;
    }
    similarity += count * num;
  }

  return similarity;
}

if (import.meta.main) {
  const testData = await readFile("./day_1_data.txt");
  const { left, right } = parse(testData);
  const distance = calcDistance(left, right);
  const similarity = calcSimilarity(left, right);
  console.log(distance, similarity);
}

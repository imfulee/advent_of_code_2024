import { assert } from "@std/assert";
import { readFile } from "./reader.ts";

export function parse(text: string): { numbers: number[]; total: number }[] {
  const lines = text.split("\n").filter((t) => !!t);
  return lines.map((l) => {
    const [totalText, numberText] = l.split(":").map((t) => t.trim());
    assert(typeof totalText === "string", "sumText must be string");
    assert(typeof numberText === "string", "numberText must be string");
    const total = parseInt(totalText, 10);
    const numbers = numberText.split(" ").map((n) => parseInt(n, 10));
    return { total, numbers };
  });
}

function isPossiblePart1(numbers: number[], total: number): boolean {
  assert(numbers.length !== 0, "numbers could not be empty array");

  if (numbers.length === 1) {
    return total === numbers[0];
  }

  const current = numbers[numbers.length - 1];

  if (total % current !== 0) {
    return isPossiblePart1(
      numbers.slice(0, numbers.length - 1),
      total - current
    );
  } else {
    return (
      isPossiblePart1(numbers.slice(0, numbers.length - 1), total / current) ||
      isPossiblePart1(numbers.slice(0, numbers.length - 1), total - current)
    );
  }
}

function numberOfDigits(num: number): number {
  return num.toString().length;
}

function isPossiblePart2(numbers: number[], total: number): boolean {
  assert(numbers.length !== 0, "numbers could not be empty array");

  if (numbers.length === 1) {
    return total === numbers[0];
  }

  const current = numbers[numbers.length - 1];
  const noOfDigit = numberOfDigits(current);
  if (total % Math.pow(10, noOfDigit) === current) {
    return (
      isPossiblePart2(
        numbers.slice(0, numbers.length - 1),
        Math.floor(total / Math.pow(10, noOfDigit))
      ) ||
      isPossiblePart2(numbers.slice(0, numbers.length - 1), total / current) ||
      isPossiblePart2(numbers.slice(0, numbers.length - 1), total - current)
    );
  } else if (total % current === 0) {
    return (
      isPossiblePart2(numbers.slice(0, numbers.length - 1), total / current) ||
      isPossiblePart2(numbers.slice(0, numbers.length - 1), total - current)
    );
  } else {
    return isPossiblePart2(
      numbers.slice(0, numbers.length - 1),
      total - current
    );
  }
}

interface IIsPossible {
  (numbers: number[], total: number): boolean;
}

function sumPossibilities(
  possibilities: {
    total: number;
    numbers: number[];
  }[],
  isPossible: IIsPossible
): number {
  return possibilities.reduce(
    (subTotal, possibility) =>
      isPossible(possibility.numbers, possibility.total)
        ? subTotal + possibility.total
        : subTotal,
    0
  );
}

if (import.meta.main) {
  const text = await readFile("./day_7_data.txt");
  // const text = await readFile("./day_7_example_data.txt");
  const possibilities = parse(text);
  const part1 = sumPossibilities(possibilities, isPossiblePart1);
  console.log(part1);
  const part2 = sumPossibilities(possibilities, isPossiblePart2);
  console.log(part2);
}

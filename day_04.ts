import { assert } from "@std/assert/assert";
import { readFile } from "./reader.ts";

export function parse(text: string): string[][] {
  const matrix = text
    .trim()
    .split("\n")
    .map((l) => l.split(""));
  return matrix;
}

export function isXmas(word: string): boolean {
  assert(word.length === 4, "characters not of length 4");
  return word === "XMAS" || word === "SAMX";
}

export function calcXmasHorizontally(puzzle: string[][]): number {
  let count = 0;

  for (let i = 0; i < puzzle.length; i++) {
    for (let j = 0; j < puzzle[i].length - 3; j++) {
      const word = puzzle[i].slice(j, j + 4).join("");
      if (isXmas(word)) {
        count++;
      }
    }
  }

  return count;
}
export function calcXmasVertically(puzzle: string[][]): number {
  let count = 0;

  for (let i = 0; i < puzzle.length - 3; i++) {
    for (let j = 0; j < puzzle[i].length; j++) {
      const word = [
        puzzle[i][j],
        puzzle[i + 1][j],
        puzzle[i + 2][j],
        puzzle[i + 3][j],
      ].join("");
      if (isXmas(word)) {
        count++;
      }
    }
  }

  return count;
}
export function calcXmasForwardDiagnonal(puzzle: string[][]): number {
  let count = 0;

  for (let i = 0; i < puzzle.length - 3; i++) {
    for (let j = 0; j < puzzle[i].length - 3; j++) {
      const word = [
        puzzle[i][j],
        puzzle[i + 1][j + 1],
        puzzle[i + 2][j + 2],
        puzzle[i + 3][j + 3],
      ].join("");
      if (isXmas(word)) {
        count++;
      }
    }
  }

  return count;
}
export function calcXmasBackwardDiagnonal(puzzle: string[][]): number {
  let count = 0;

  for (let i = 3; i < puzzle.length; i++) {
    for (let j = 0; j < puzzle[i].length - 3; j++) {
      const word = [
        puzzle[i][j],
        puzzle[i - 1][j + 1],
        puzzle[i - 2][j + 2],
        puzzle[i - 3][j + 3],
      ].join("");
      if (isXmas(word)) {
        count++;
      }
    }
  }

  return count;
}

export function calcXmasInstance(puzzle: string[][]): number {
  const count =
    calcXmasHorizontally(puzzle) +
    calcXmasVertically(puzzle) +
    calcXmasForwardDiagnonal(puzzle) +
    calcXmasBackwardDiagnonal(puzzle);

  return count;
}

function isMas(word: string): boolean {
  return word === "MAS" || word === "SAM";
}

export function isCrossXmasBlock(block: string[][]): boolean {
  assert(block.length === 3, "block height not 3");
  block.forEach((l) => assert(l.length === 3, "block width not 3"));

  const forwardDiagnoalWord = [block[0][0], block[1][1], block[2][2]].join("");
  const backwardDiagnoalWord = [block[0][2], block[1][1], block[2][0]].join("");
  return isMas(forwardDiagnoalWord) && isMas(backwardDiagnoalWord);
}

export function calcCrossMasInstance(puzzle: string[][]): number {
  let count = 0;

  for (let i = 0; i < puzzle.length - 2; i++) {
    for (let j = 0; j < puzzle[i].length - 2; j++) {
      const block = [
        puzzle[i].slice(j, j + 3),
        puzzle[i + 1].slice(j, j + 3),
        puzzle[i + 2].slice(j, j + 3),
      ];
      if (isCrossXmasBlock(block)) {
        count++;
      }
    }
  }

  return count;
}

if (import.meta.main) {
  const data = await readFile("./day_4_data.txt");
  const puzzle = parse(data);
  const count = calcXmasInstance(puzzle);
  console.log(count);
  console.log(calcCrossMasInstance(puzzle));
}

import { assert } from "@std/assert";
import { readFile } from "./reader.ts";

type Stone = string;

const ZeroStone = "0";
const OneStone = "1";

export function parse(test: string): Stone[] {
  return test.split(" ");
}

export function isEvenNumberOfDigits(stone: Stone): boolean {
  return stone.length % 2 === 0;
}

export function multiply(stone: Stone, factor: number): Stone {
  const number = parseInt(stone, 10);
  return `${number * factor}`;
}

export function split(stone: Stone): Stone[] {
  assert(isEvenNumberOfDigits(stone), "stone is not even number of digits");
  const firstHalf = stone.slice(0, stone.length / 2);
  const secondHalf = stone.slice(stone.length / 2, stone.length);
  return [`${parseInt(firstHalf, 10)}`, `${parseInt(secondHalf, 10)}`];
}

export function blink(stones: Stone[]): Stone[] {
  const rtnStones: Stone[] = [];

  for (const stone of stones) {
    if (stone === ZeroStone) {
      rtnStones.push(OneStone);
    } else if (isEvenNumberOfDigits(stone)) {
      rtnStones.push(...split(stone));
    } else {
      rtnStones.push(multiply(stone, 2024));
    }
  }

  return rtnStones;
}

export function blinkHash(stoneMap: Map<Stone, number>): Map<Stone, number> {
  const hashMap: Map<Stone, number> = new Map();

  stoneMap.forEach((repeat, stone) => {
    const newValues = [];
    if (stone === ZeroStone) {
      newValues.push(OneStone);
    } else if (isEvenNumberOfDigits(stone)) {
      newValues.push(...split(stone));
    } else {
      newValues.push(multiply(stone, 2024));
    }

    newValues.forEach((stone) => {
      const hRepeat = hashMap.get(stone) || 0;
      hashMap.set(stone, hRepeat + repeat);
    });
  });

  return hashMap;
}

if (import.meta.main) {
  // const text = await readFile("./day_11_example_data.txt");
  const text = await readFile("./day_11_data.txt");
  const stones = parse(text).map((s) => s.trim());
  {
    let part1Stones = [...stones];
    for (let i = 0; i < 25; i++) {
      part1Stones = blink(part1Stones);
    }
    console.log(part1Stones.length);
  }
  {
    const part2Stones = [...stones];
    let stoneMap: Map<Stone, number> = new Map();
    for (const stone of part2Stones) {
      const repeat = stoneMap.get(stone) || 0;
      stoneMap.set(stone, repeat + 1);
    }

    for (let i = 0; i < 75; i++) {
      stoneMap = blinkHash(stoneMap);
    }

    const sum = Array.from(stoneMap.values()).reduce(
      (total, cur) => total + cur,
      0,
    );
    console.log(sum);
  }
}

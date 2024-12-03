import { readFile } from "./reader.ts";

export function isNumber(text: string): boolean {
  return !Number.isNaN(Number(text));
}

export function parse(text: string): number[][] {
  if (text.length < 8) {
    // mul(x,y) is at least 8 characters
    throw new Error("bad input string");
  }

  const multiplications: number[][] = [];

  const characters = text.split("");
  for (let i = 0; i < characters.length - 8; i++) {
    if (characters.slice(i, i + 4).join("") !== "mul(") {
      continue;
    }

    // find the end of the multiplication => )
    let closingBracketLoc = i + 4;
    while (
      characters[closingBracketLoc] !== ")" && // find the closing brakcet
      (isNumber(characters[closingBracketLoc]) || // however if its a number of comma keep it going
        characters[closingBracketLoc] === ",")
    ) {
      closingBracketLoc++;
      if (closingBracketLoc === characters.length - 1) {
        break;
      }
    }

    // if the while loop stopped at not a ) position then it means something didn't fit the format
    if (characters[closingBracketLoc] !== ")") {
      continue;
    }

    const tokens = characters
      .slice(i + 4, closingBracketLoc)
      .join("")
      .split(",");

    // ignore if the string ends up like mul(x,y,)
    if (tokens.find((t) => t === "")) {
      continue;
    }
    // ignore if the string ends up like mul(,) or mul(1)
    if (tokens.length < 2) {
      continue;
    }
    const numbers = tokens.map((t) => parseInt(t, 10));

    multiplications.push(numbers);
  }

  return multiplications;
}

export function flaggedParse(text: string): number[][] {
  if (text.length < 8) {
    // mul(x,y) is at least 8 characters
    throw new Error("bad input string");
  }

  const multiplications: number[][] = [];

  const characters = text.split("");
  let isAllowed = true;

  for (let i = 0; i < characters.length - 8; i++) {
    if (characters.slice(i, i + 4).join("") === "do()") {
      isAllowed = true;
    }

    if (characters.slice(i, i + 7).join("") === "don't()") {
      isAllowed = false;
    }

    if (!isAllowed) {
      continue;
    }

    if (characters.slice(i, i + 4).join("") !== "mul(") {
      continue;
    }

    // find the end of the multiplication => )
    let closingBracketLoc = i + 4;
    while (
      characters[closingBracketLoc] !== ")" && // find the closing brakcet
      (isNumber(characters[closingBracketLoc]) || // however if its a number of comma keep it going
        characters[closingBracketLoc] === ",")
    ) {
      closingBracketLoc++;
      if (closingBracketLoc === characters.length - 1) {
        break;
      }
    }

    // if the while loop stopped at not a ) position then it means something didn't fit the format
    if (characters[closingBracketLoc] !== ")") {
      continue;
    }

    const tokens = characters
      .slice(i + 4, closingBracketLoc)
      .join("")
      .split(",");

    // ignore if the string ends up like mul(x,y,)
    if (tokens.find((t) => t === "")) {
      continue;
    }
    // ignore if the string ends up like mul(,) or mul(1)
    if (tokens.length < 2) {
      continue;
    }
    const numbers = tokens.map((t) => parseInt(t, 10));

    multiplications.push(numbers);
  }

  return multiplications;
}

export function calcMultiplication(multiplication: number[]): number {
  return multiplication.reduce((multiplier, num) => multiplier * num, 1);
}

export function calcMultiplications(multiplications: number[][]) {
  const sum = multiplications.reduce(
    (total, nums) => total + calcMultiplication(nums),
    0
  );
  return sum;
}

if (import.meta.main) {
  const data = await readFile("./day_3_data.txt");
  {
    const multiplications = parse(data);
    const sum = calcMultiplications(multiplications);
    console.log(sum);
  }
  {
    const multiplications = flaggedParse(data);
    const sum = calcMultiplications(multiplications);
    console.log(sum);
  }
}

import { assert } from "@std/assert";

type Vector = number[];

type Puzzle = { a: Vector; b: Vector; prize: Vector };

class Parser {
  static parseButton(line: string) {
    const [buttonPart, vectorParts] = line.split(": ");

    const [_, button] = buttonPart.split("Button ");
    assert(!!button);

    const [xPart, yPart] = vectorParts.split(", ").map((s) => s.trim());
    assert(!!xPart);
    assert(!!yPart);
    function parseBasis(line: string): { plane: string; scalar: number } {
      const [plane, scalar] = line.split("+");
      assert(!!plane);
      assert(!!scalar);

      return { plane, scalar: parseInt(scalar, 10) };
    }

    return { button, x: parseBasis(xPart).scalar, y: parseBasis(yPart).scalar };
  }

  static parsePrize(line: string) {
    const [_, vectorParts] = line.split("Prize: ");
    assert(!!vectorParts);

    const [xPart, yPart] = vectorParts.split(", ").map((s) => s.trim());
    assert(!!xPart);
    assert(!!yPart);
    function parseBasis(line: string): { plane: string; scalar: number } {
      const [plane, scalar] = line.split("=");
      assert(!!plane);
      assert(!!scalar);

      return { plane, scalar: parseInt(scalar, 10) };
    }

    return { x: parseBasis(xPart).scalar, y: parseBasis(yPart).scalar };
  }

  static parsePuzzle(lines: string[]): Puzzle {
    assert(lines.length === 3);

    const btnA = this.parseButton(lines[0]);
    const btnB = this.parseButton(lines[1]);
    const prize = this.parsePrize(lines[2]);

    return {
      a: [btnA.x, btnA.y],
      b: [btnB.x, btnB.y],
      prize: [prize.x, prize.y],
    };
  }

  static parse(input: string) {
    assert(!!input);
    const lines = input.split("\n");

    const puzzles: Puzzle[] = [];
    let index = 0;
    while (true) {
      const a = lines[index];
      const b = lines[index + 1];
      const prize = lines[index + 2];

      const puzzle = this.parsePuzzle([a, b, prize]);
      puzzles.push(puzzle);

      if (index + 4 >= lines.length) break;
      index = index + 4;
    }

    return puzzles;
  }
}

class Solver {
  static solve(puzzle: Puzzle) {
    const input = structuredClone(puzzle);
    const rref = this.rref([input.a, input.b, input.prize]);
    return rref[2];
  }

  static rref(vector: number[][]) {
    assert(vector.length === 3);
    for (const column of vector) {
      assert(column.length === vector[0].length);
    }

    const topLeft = vector[0][0];
    for (let column = 0; column < vector.length; column++) {
      vector[column][0] = vector[column][0] / topLeft;
    }

    const scalarFromTopLeft = vector[0][1] / vector[0][0];
    for (let column = 0; column < vector.length; column++) {
      vector[column][1] = vector[column][1] -
        scalarFromTopLeft * vector[column][0];
    }

    const scalarFromBtmRight = vector[1][1];
    for (let column = 0; column < vector.length; column++) {
      vector[column][1] = vector[column][1] / scalarFromBtmRight;
    }

    if (vector[1][0] !== 0) {
      const scalarFromTopRight = vector[1][0];
      for (let column = 0; column < vector.length; column++) {
        vector[column][0] = vector[column][0] -
          scalarFromTopRight * vector[column][1];
      }
    }

    return vector;
  }
}

function main() {
  const question = Deno.readTextFileSync("./day_13.txt");

  const costA = 3;
  const costB = 1;
  const puzzles = Parser.parse(question);

  {
    let totalCost = 0;
    for (const puzzle of puzzles) {
      const [a, b] = Solver.solve(puzzle);
      const rA = Math.round(a);
      const rB = Math.round(b);

      if (
        rA * puzzle.a[0] + rB * puzzle.b[0] === puzzle.prize[0] &&
        rA * puzzle.a[1] + rB * puzzle.b[1] === puzzle.prize[1]
      ) {
        totalCost += costA * rA + costB * rB;
      }
    }

    console.log(totalCost);
  }

  {
    let totalCost = 0;
    for (const puzzle of puzzles) {
      const modPuzzle = structuredClone(puzzle);
      modPuzzle.prize = modPuzzle.prize.map((p) => p + 10000000000000);
      const [a, b] = Solver.solve(modPuzzle);
      const rA = Math.round(a);
      const rB = Math.round(b);

      if (
        rA * modPuzzle.a[0] + rB * modPuzzle.b[0] === modPuzzle.prize[0] &&
        rA * modPuzzle.a[1] + rB * modPuzzle.b[1] === modPuzzle.prize[1]
      ) {
        totalCost += costA * rA + costB * rB;
      }
    }

    console.log(totalCost);
  }
}

main();

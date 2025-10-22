import { assert } from "@std/assert/assert";

const TileType = {
  Fish: "@",
  Wall: "#",
  Box: "O",
  Empty: ".",
};

class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  move(movement: { x: number; y: number }) {
    this.x += movement.x;
    this.y += movement.y;
  }

  clone(): Position {
    return new Position(this.x, this.y);
  }

  toString() {
    return [this.x, this.y].join(",");
  }
}

class Grid {
  grid: string[][];

  constructor(input: string) {
    this.grid = [];

    const rows = input.split("\n");
    for (const row of rows) {
      this.grid.push(row.split(""));
    }
  }

  get fish() {
    let fishX = -1;
    let fishY = -1;

    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.grid[y][x] === TileType.Fish) {
          fishX = x;
          fishY = y;
        }
      }
    }

    return { position: new Position(fishX, fishY) };
  }

  get boxPositions(): Position[] {
    const positions: Position[] = [];

    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.getTile({ x, y }) === TileType.Box) {
          positions.push(new Position(x, y));
        }
      }
    }

    return positions;
  }

  getTile(position: { x: number; y: number }): string {
    return this.grid[position.y][position.x];
  }

  swapTiles(src: Position, dst: Position) {
    const toSrc = this.grid[dst.y][dst.x];
    const toDst = this.grid[src.y][src.x];
    this.grid[dst.y][dst.x] = toDst;
    this.grid[src.y][src.x] = toSrc;
  }

  print() {
    assert(this.grid.length > 0);

    for (const row of this.grid) {
      console.log(row.join(""));
    }
  }
}

class Puzzle {
  grid: Grid;
  movements: string[];
  fishPosition: Position;

  constructor(input: string) {
    const lines = input.split("\n");
    const breakIdx = lines.findIndex((line) => line === "");
    assert(breakIdx != -1);

    this.grid = new Grid(lines.slice(0, breakIdx).join("\n"));
    this.fishPosition = this.grid.fish.position;
    assert(this.fishPosition.x !== -1);
    assert(this.fishPosition.y !== -1);

    this.movements = [];
    for (let idx = breakIdx + 1; idx < lines.length; idx++) {
      assert(lines[idx]);
      this.movements.push(...lines[idx].split(""));
    }
  }

  movementVector(movement: string): { x: number; y: number } {
    switch (movement) {
      case "^":
        return { x: 0, y: -1 };
      case "v":
        return { x: 0, y: 1 };
      case ">":
        return { x: 1, y: 0 };
      case "<":
        return { x: -1, y: 0 };
      default:
        throw new Error("Unsupported movement");
    }
  }

  moveFish(movement: string) {
    assert(
      this.grid.getTile(this.fishPosition) === TileType.Fish,
      `${this.fishPosition} = ${this.grid.getTile(this.fishPosition)}`,
    );

    const moveVector = this.movementVector(movement);
    const towardsPosition = this.fishPosition.clone();
    towardsPosition.move(moveVector);
    const towardsTile = this.grid.getTile(towardsPosition);

    switch (towardsTile) {
      case TileType.Wall:
        return;
      case TileType.Empty:
        this.grid.swapTiles(this.fishPosition, towardsPosition);
        this.fishPosition.move(moveVector);
        return;
      case TileType.Box: {
        const shouldMovePositions: Position[] = [
          this.fishPosition.clone(),
          towardsPosition.clone(),
        ];

        while (true) {
          towardsPosition.move(moveVector);

          switch (this.grid.getTile(towardsPosition)) {
            case TileType.Wall:
              return;
            case TileType.Empty: {
              shouldMovePositions.push(towardsPosition);
              for (
                let idx = shouldMovePositions.length - 1;
                idx > 0;
                idx--
              ) {
                if (
                  this.grid.getTile(shouldMovePositions[idx - 1]) ===
                    TileType.Fish
                ) {
                  this.fishPosition = shouldMovePositions[idx].clone();
                }

                this.grid.swapTiles(
                  shouldMovePositions[idx],
                  shouldMovePositions[idx - 1],
                );
              }
              break;
            }
            case TileType.Box:
              shouldMovePositions.push(towardsPosition.clone());
              continue;
            default:
              throw new Error(`Unable to process tile ${towardsTile}`);
          }

          break;
        }

        break;
      }
      default:
        throw new Error(`Unable to process tile ${towardsTile}`);
    }
  }

  finishMoves() {
    for (const movement of this.movements) {
      this.moveFish(movement);
    }

    console.log(
      this.grid.boxPositions.reduce(
        (cnt, pos) => cnt + (pos.x + 100 * pos.y),
        0,
      ),
    );
  }
}

function main() {
  const input = Deno.readTextFileSync("./day_15.txt");
  const puzzle = new Puzzle(input);
  puzzle.finishMoves();
}

main();

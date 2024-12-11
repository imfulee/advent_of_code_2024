import { assert } from "@std/assert/assert";
import { readFile } from "./reader.ts";

enum Direction {
  Up,
  Down,
  Left,
  Right,
}
type Floor = string[][];
type Position = { row: number; col: number };
type Movement = { row: number; col: number; direction: Direction };
const Obstruction = "#";
const Guard = "^";
const DirectionMovementMap = new Map([
  [Direction.Up, { row: -1, col: 0 }],
  [Direction.Right, { row: 0, col: 1 }],
  [Direction.Down, { row: 1, col: 0 }],
  [Direction.Left, { row: 0, col: -1 }],
]);
const TurnedRightDirectionMap = new Map([
  [Direction.Up, Direction.Right],
  [Direction.Right, Direction.Down],
  [Direction.Down, Direction.Left],
  [Direction.Left, Direction.Up],
]);

export function parse(text: string): Floor {
  const floor = text.split("\n").map((l) => l.split(""));
  return floor;
}

function getStartingPosition(floor: Floor, guardCharacter: string): Position {
  for (let row = 0; row < floor.length; row++) {
    for (let col = 0; col < floor[row].length; col++) {
      if (floor[row][col] === guardCharacter) {
        return { row, col };
      }
    }
  }
  throw new Error("no guard found");
}

function isOutOfBoundsMove(floor: Floor, position: Position): boolean {
  if (position.row >= floor.length || position.row < 0) {
    return true;
  } else if (position.col >= floor[position.row].length || position.col < 0) {
    return true;
  }
  return false;
}

function hitsObstruction(floor: Floor, position: Position): boolean {
  assert(!isOutOfBoundsMove(floor, position), "invalid move");
  return floor[position.row][position.col] === Obstruction;
}

function getNextPosition(
  direction: Direction,
  originalPosition: Position,
): {
  newPosition: Position;
  movement: { row: number; col: number };
} {
  const movement = DirectionMovementMap.get(direction)!;
  const newPosition = {
    row: originalPosition.row + movement.row,
    col: originalPosition.col + movement.col,
  };
  return { newPosition, movement };
}

function getNextMove(
  floor: Floor,
  currentPosition: Position,
  currentDirection: Direction,
): Movement {
  let direction = currentDirection;
  let result = getNextPosition(direction, currentPosition);
  let movement = result.movement;
  let newPosition = result.newPosition;

  if (isOutOfBoundsMove(floor, newPosition)) {
    return { ...movement, direction: direction };
  }

  let turnCount = 0;
  while (hitsObstruction(floor, newPosition)) {
    if (turnCount === 4) {
      throw new Error("turned around hitting obstructions");
    }
    turnCount++;
    direction = TurnedRightDirectionMap.get(direction)!;
    result = getNextPosition(direction, currentPosition);
    movement = result.movement;
    newPosition = result.newPosition;
  }

  return { ...movement, direction };
}

function visitedMapKey(position: Position, direction: Direction) {
  return `${position.row},${position.col},${direction}`;
}

function getGuardVisited(floor: Floor): {
  visitedPositions: Position[];
  visitedOrder: Position[];
  hasCycle: boolean;
} {
  const visitedMap: Map<
    string,
    { row: number; col: number; direction: Direction }
  > = new Map();
  const visitedOrder: Position[] = [];
  let hasCycle = false;
  let currentDirection = Direction.Up;
  let currentPosition = getStartingPosition(floor, Guard);
  let nextMove = getNextMove(floor, currentPosition, currentDirection);
  let newPosition = {
    row: currentPosition.row + nextMove.row,
    col: currentPosition.col + nextMove.col,
  };
  currentDirection = nextMove.direction;

  while (true) {
    const mapKey = visitedMapKey(newPosition, currentDirection);
    if (visitedMap.get(mapKey)) {
      hasCycle = true;
      break;
    }
    visitedMap.set(mapKey, { ...newPosition, direction: currentDirection });
    visitedOrder.push(newPosition);
    currentPosition = newPosition;
    nextMove = getNextMove(floor, currentPosition, currentDirection);
    newPosition = {
      row: currentPosition.row + nextMove.row,
      col: currentPosition.col + nextMove.col,
    };
    currentDirection = nextMove.direction;
    if (isOutOfBoundsMove(floor, newPosition)) {
      break;
    }
  }

  const visitedPositions: Map<string, Position> = new Map();
  for (const position of visitedMap.values()) {
    visitedPositions.set(`${position.row},${position.col}`, {
      row: position.row,
      col: position.col,
    });
  }

  return {
    visitedPositions: Array.from(visitedPositions.values()),
    visitedOrder,
    hasCycle,
  };
}

if (import.meta.main) {
  // const text = await readFile("./day_6_example_data.txt");
  const text = await readFile("./day_6_data.txt");
  const floor = parse(text);
  const { visitedPositions } = getGuardVisited(floor);
  console.log("Part 1:", visitedPositions.length);

  let cycles = 0;
  const guardPosition = getStartingPosition(floor, Guard);
  const possibleObstructionPositions = visitedPositions.filter(
    (vp) => vp.row !== guardPosition.row || vp.col !== guardPosition.col,
  );
  for (const position of possibleObstructionPositions) {
    const cFloor = structuredClone(floor);
    cFloor[position.row][position.col] = Obstruction;
    const { hasCycle } = getGuardVisited(cFloor);
    if (hasCycle) {
      cycles++;
    }
  }
  console.log("Part 2:", cycles);
}

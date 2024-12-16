import { assert } from "@std/assert";
import { readFile } from "./reader.ts";
import { popHead, popTail } from "./utils.ts";

type TopographicMap = string[][];
type Coordinate = {
  row: number;
  col: number;
};

export function parse(text: string): TopographicMap {
  return text.split("\n").map((l) => l.split(""));
}

export function getTrailheadCoordinates(
  topographicMap: TopographicMap,
): Coordinate[] {
  const trailheads: Coordinate[] = [];

  for (let row = 0; row < topographicMap.length; row++) {
    for (let col = 0; col < topographicMap[row].length; col++) {
      if (topographicMap[row][col] === "0") {
        trailheads.push({ row, col });
      }
    }
  }

  return trailheads;
}

export function isPathFound(
  topographicMap: TopographicMap,
  path: readonly Coordinate[],
): boolean {
  if (path.length === 0) {
    return false;
  }
  const coordinate = path[path.length - 1];
  return topographicMap[coordinate.row][coordinate.col] === "9";
}

export function isAllPathsFound(
  topographicMap: TopographicMap,
  paths: readonly Coordinate[][],
) {
  return paths.filter((p) => !isPathFound(topographicMap, p)).length === 0;
}

export function isValidCoordinate(
  coordinate: Coordinate,
  topographicMap: TopographicMap,
): boolean {
  return (
    0 <= coordinate.row &&
    coordinate.row < topographicMap.length &&
    0 <= coordinate.col &&
    coordinate.col < topographicMap[coordinate.row].length
  );
}

export function isNextStep(
  from: Coordinate,
  to: Coordinate,
  topographicMap: TopographicMap,
) {
  assert(
    topographicMap[from.row][from.col] !== ".",
    "from coordinates should not be unwalkable",
  );

  if (topographicMap[to.row][to.col] === ".") {
    return false;
  }

  const fromInt = parseInt(topographicMap[from.row][from.col], 10);
  const toInt = parseInt(topographicMap[to.row][to.col], 10);
  return toInt - fromInt === 1;
}

// For Debug
function _printPath(path: Coordinate[], topographicMap: TopographicMap) {
  const cMap = structuredClone(topographicMap);
  path.forEach((c) => (cMap[c.row][c.col] = "X"));
  console.log(cMap.map((r) => r.join("")).join("\n"));
}

export function calcPaths(
  topographicMap: TopographicMap,
  trailheadCoordinate: Coordinate,
): Coordinate[][] {
  const directions = [
    { row: 1, col: 0 },
    { row: -1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];
  let paths = [[trailheadCoordinate]];

  while (!isAllPathsFound(topographicMap, paths)) {
    const { head: path, remainingArray } = popHead(paths);
    assert(path !== null, "path should not be null");

    if (isPathFound(topographicMap, path)) {
      continue;
    }
    paths = remainingArray;

    const { tail: lastCoordinate } = popTail(path);
    assert(lastCoordinate !== null, "lastCoordinate should not be null");
    const possibleSteps = directions.map((d) => ({
      row: lastCoordinate.row + d.row,
      col: lastCoordinate.col + d.col,
    }));
    const validSteps = possibleSteps.filter((s) =>
      isValidCoordinate(s, topographicMap),
    );
    const nextSteps = validSteps.filter((s) =>
      isNextStep(lastCoordinate, s, topographicMap),
    );

    const newPaths = nextSteps.map((s) => [...path, s]);
    paths.push(...newPaths);
  }

  return paths;
}

if (import.meta.main) {
  // const text = await readFile("./day_10_example_data.txt");
  const text = await readFile("./day_10_data.txt");
  const topographicMap = parse(text);
  const trailheads = getTrailheadCoordinates(topographicMap);
  {
    // part 1
    let sum = 0;
    trailheads.forEach((trailhead) => {
      const ends = new Set();
      const paths = calcPaths(topographicMap, trailhead);
      paths.forEach((p) => {
        const summit = p[p.length - 1];
        const key = `${summit.row},${summit.col}`;
        ends.add(key);
      });
      sum += ends.size;
    });
    console.log(sum);
  }
  {
    // part 2
    const sum = trailheads.reduce(
      (total, trailhead) => total + calcPaths(topographicMap, trailhead).length,
      0,
    );
    console.log(sum);
  }
}

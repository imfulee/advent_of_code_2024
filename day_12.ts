import { assert } from "@std/assert";
import { readFile } from "./reader.ts";

export enum Border {
  Top = "top",
  Bottom = "bottom",
  Left = "left",
  Right = "right",
}

enum Corner {
  TopLeft = "topleft",
  TopRight = "topright",
  BottomLeft = "bottomleft",
  BottomRight = "bottomright",
}

type Position = {
  row: number;
  col: number;
};

type Coordinate = {
  row: number;
  col: number;
};

type Tile = {
  character: string;
  position: Position;
  borders: Border[];
  corners: Corner[];
};

type Region = {
  character: string;
  tiles: Tile[];
};

export function calcBorders(input: string[][], position: Position): Border[] {
  assert(
    0 <= position.row &&
      position.row < input.length &&
      0 <= position.col &&
      position.col < input[position.row].length,
    "invalid position"
  );

  const directions = new Map([
    [Border.Top, { row: -1, col: 0 }],
    [Border.Bottom, { row: 1, col: 0 }],
    [Border.Left, { row: 0, col: -1 }],
    [Border.Right, { row: 0, col: 1 }],
  ]);

  const currentCharacter = input[position.row][position.col];

  const borders: Border[] = [];
  directions.forEach((direction, border) => {
    const row = position.row + direction.row;
    const col = position.col + direction.col;
    const positionWithinBounds =
      0 <= row && row < input.length && 0 <= col && col < input[row].length;
    if (!positionWithinBounds || input[row][col] !== currentCharacter) {
      borders.push(border);
    }
  });

  return borders;
}

function getCornerKey(coordinate: Coordinate): string {
  return `${coordinate.row},${coordinate.col}`;
}

export function parse(text: string): Tile[][] {
  const input = text.split("\n").map((l) => l.split(""));
  const tileGrid: Tile[][] = [];

  function calcCornerCoordinates(
    position: Position,
    borders: Border[]
  ): Corner[] {
    const corners: Corner[] = [];

    {
      // calc infold corners
      const connectedCount = {
        [Corner.TopLeft]: 0,
        [Corner.TopRight]: 0,
        [Corner.BottomLeft]: 0,
        [Corner.BottomRight]: 0,
      };
      for (const border of borders) {
        if (border === Border.Bottom) {
          connectedCount[Corner.BottomLeft]++;
          connectedCount[Corner.BottomRight]++;
        } else if (border === Border.Top) {
          connectedCount[Corner.TopLeft]++;
          connectedCount[Corner.TopRight]++;
        } else if (border === Border.Left) {
          connectedCount[Corner.TopLeft]++;
          connectedCount[Corner.BottomLeft]++;
        } else if (border === Border.Right) {
          connectedCount[Corner.BottomRight]++;
          connectedCount[Corner.TopRight]++;
        }
      }
      corners.push(
        ...Object.entries(connectedCount)
          .filter(([_corner, connected]) => connected === 2)
          .map(([corner]) => corner as Corner)
      );
    }

    {
      // calc outfold corners
      const currentTile = tileGrid[position.row][position.col];

      const topRightTile = tileGrid[position.row - 1]?.[position.col + 1];
      if (
        topRightTile &&
        topRightTile.borders.includes(Border.Bottom) &&
        topRightTile.borders.includes(Border.Left) &&
        !(
          currentTile.borders.includes(Border.Top) ||
          currentTile.borders.includes(Border.Right)
        )
      ) {
        corners.push(Corner.TopRight);
      }

      const topLeftTile = tileGrid[position.row - 1]?.[position.col - 1];
      if (
        topLeftTile &&
        topLeftTile.borders.includes(Border.Bottom) &&
        topLeftTile.borders.includes(Border.Right) &&
        !(
          currentTile.borders.includes(Border.Top) ||
          currentTile.borders.includes(Border.Left)
        )
      ) {
        corners.push(Corner.TopLeft);
      }

      const bottomRightTile = tileGrid[position.row + 1]?.[position.col + 1];
      if (
        bottomRightTile &&
        bottomRightTile.borders.includes(Border.Top) &&
        bottomRightTile.borders.includes(Border.Left) &&
        !(
          currentTile.borders.includes(Border.Bottom) ||
          currentTile.borders.includes(Border.Right)
        )
      ) {
        corners.push(Corner.BottomRight);
      }

      const bottomLeftTile = tileGrid[position.row + 1]?.[position.col - 1];
      if (
        bottomLeftTile &&
        bottomLeftTile.borders.includes(Border.Top) &&
        bottomLeftTile.borders.includes(Border.Right) &&
        !(
          currentTile.borders.includes(Border.Bottom) ||
          currentTile.borders.includes(Border.Left)
        )
      ) {
        corners.push(Corner.BottomLeft);
      }
    }

    return Array.from(new Set(corners));
  }

  for (let row = 0; row < input.length; row++) {
    const tileRow: Tile[] = [];
    for (let col = 0; col < input[row].length; col++) {
      tileRow.push({
        character: input[row][col],
        position: { row, col },
        borders: calcBorders(input, { row, col }),
        corners: [],
      });
    }
    tileGrid.push(tileRow);
  }

  // fill corners
  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      const tile = tileGrid[row][col];
      tile.corners = calcCornerCoordinates({ row, col }, tile.borders);
      tileGrid[row][col] = tile;
    }
  }

  return tileGrid;
}

export function calcRegions(tileGrid: Tile[][]): Region[] {
  const regions: Region[] = [];
  const seenPositions: Set<string> = new Set();

  function getPositionKey(position: Position): string {
    return `${position.row},${position.col}`;
  }

  function isValidPosition(position: Position): boolean {
    return (
      0 <= position.row &&
      position.row < tileGrid.length &&
      0 <= position.col &&
      position.col < tileGrid[position.row].length &&
      !seenPositions.has(getPositionKey(position))
    );
  }

  function calcAdjacentPositions(
    position: Position,
    character: string
  ): Position[] {
    const directions = [
      { row: 1, col: 0 },
      { row: -1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: 1 },
    ];
    return directions
      .map((d) => ({
        row: position.row + d.row,
        col: position.col + d.col,
      }))
      .filter((p) => isValidPosition(p))
      .filter((p) => tileGrid[p.row][p.col].character === character);
  }

  for (let row = 0; row < tileGrid.length; row++) {
    for (let col = 0; col < tileGrid[row].length; col++) {
      const rootTile = tileGrid[row][col];
      const posKey = getPositionKey(rootTile.position);

      if (seenPositions.has(posKey)) {
        continue;
      }

      const region: Region = {
        character: rootTile.character,
        tiles: [rootTile],
      };
      seenPositions.add(posKey);
      let adjacentPositions = calcAdjacentPositions(
        rootTile.position,
        region.character
      );

      while (adjacentPositions.length !== 0) {
        region.tiles.push(
          ...adjacentPositions.map((p) => tileGrid[p.row][p.col])
        );
        adjacentPositions.forEach((p) => seenPositions.add(getPositionKey(p)));
        adjacentPositions = Array.from(
          new Map(
            adjacentPositions
              .map((p) => calcAdjacentPositions(p, region.character))
              .flat()
              .map((p) => [getPositionKey(p), p])
          ).values()
        );
      }

      regions.push(region);
    }
  }

  return regions;
}

export function calcCostPart1(regions: Region[]): number {
  return regions.reduce((total, region) => {
    const perimeter = region.tiles.reduce(
      (perimeterTotal, tile) => tile.borders.length + perimeterTotal,
      0
    );
    const area = region.tiles.length;
    return total + perimeter * area;
  }, 0);
}

export function calcCostPart2(regions: Region[]): number {
  return regions.reduce((total, region) => {
    const cornerCoordinateSet: Set<string> = new Set();
    region.tiles.forEach((tile) =>
      tile.corners.forEach((corner) => {
        let cornerCoordinate = tile.position;
        switch (corner) {
          case Corner.TopLeft:
            cornerCoordinate = {
              row: tile.position.row,
              col: tile.position.col,
            };
            break;
          case Corner.TopRight:
            cornerCoordinate = {
              row: tile.position.row,
              col: tile.position.col + 1,
            };
            break;
          case Corner.BottomLeft:
            cornerCoordinate = {
              row: tile.position.row + 1,
              col: tile.position.col,
            };
            break;
          case Corner.BottomRight:
            cornerCoordinate = {
              row: tile.position.row + 1,
              col: tile.position.col + 1,
            };
            break;
        }
        const cornerKey = getCornerKey(cornerCoordinate);
        cornerCoordinateSet.add(cornerKey);
      })
    );
    cornerCoordinateSet.forEach((corner) => console.log(corner));
    console.log(region.character, cornerCoordinateSet.size);
    const area = region.tiles.length;
    return total + cornerCoordinateSet.size * area;
  }, 0);
}

if (import.meta.main) {
  const text = await readFile("./day_12_example_data.txt");
  // const text = await readFile("./day_12_data.txt");
  const tileGrid = parse(text);
  const regions = calcRegions(tileGrid);
  {
    const cost = calcCostPart1(regions);
    console.log(cost);
  }
  {
    const cost = calcCostPart2(regions);
    console.log(cost);
  }
}

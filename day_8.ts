import { readFile } from "./reader.ts";

export type Position = {
  row: number;
  col: number;
};
/** key is the frequency, value is the  */
type FrequencyAntennasMap = Map<string, Position[]>;
type MapPlot = string[][];

const Blank = ".";

export function parse(text: string): MapPlot {
  return text.split("\n").map((line) => line.split(""));
}

export function getFrequencyAntennaMap(mapPlot: MapPlot): FrequencyAntennasMap {
  const frequencyAntennasMap: FrequencyAntennasMap = new Map();

  for (let row = 0; row < mapPlot.length; row++) {
    for (let col = 0; col < mapPlot[row].length; col++) {
      if (mapPlot[row][col] !== Blank) {
        const frequency = mapPlot[row][col];
        const antennas = frequencyAntennasMap.get(frequency) || [];
        antennas.push({ row, col });
        frequencyAntennasMap.set(frequency, antennas);
      }
    }
  }

  return frequencyAntennasMap;
}

type Vector = { row: number; col: number };
function calcVector(
  antennaAPosition: Position,
  antennaBPosition: Position
): Vector {
  return {
    row: antennaAPosition.row - antennaBPosition.row,
    col: antennaAPosition.col - antennaBPosition.col,
  };
}

function calcPositionByVector(position: Position, vector: Vector): Position {
  return { row: position.row + vector.row, col: position.col + vector.col };
}

function flipVector(vector: Vector): Vector {
  return { row: -vector.row, col: -vector.col };
}

function validPosition(position: Position, mapPlot: MapPlot): boolean {
  return (
    0 <= position.row &&
    position.row < mapPlot.length &&
    0 <= position.col &&
    position.col < mapPlot[position.row].length
  );
}

export function calcUniqueAntinodes(positions: Position[]): Position[] {
  const uniquePositionMap = new Map(
    positions.map((p) => [`${p.row},${p.col}`, p])
  );
  return Array.from(uniquePositionMap.values());
}

export function calcAntinodePosition(
  antennaAPosition: Position,
  antennaBPosition: Position,
  mapPlot: MapPlot
): Position[] {
  const antinodes: Position[] = [];
  const vector = calcVector(antennaAPosition, antennaBPosition);

  const antinodeA = calcPositionByVector(antennaAPosition, vector);
  if (validPosition(antinodeA, mapPlot)) {
    antinodes.push(antinodeA);
  }

  const flippedVector = flipVector(vector);
  const antinodeB = calcPositionByVector(antennaBPosition, flippedVector);
  if (validPosition(antinodeB, mapPlot)) {
    antinodes.push(antinodeB);
  }

  return antinodes;
}

export function calcAntinodePositions(
  antennaPositions: Position[],
  mapPlot: MapPlot
): Position[] {
  const antinodes: Position[] = [];

  if (antennaPositions.length === 1) {
    return [];
  }

  for (let i = 0; i < antennaPositions.length; i++) {
    for (let j = i; j < antennaPositions.length; j++) {
      if (i === j) {
        continue;
      }

      const antennaA = antennaPositions[i];
      const antennaB = antennaPositions[j];
      antinodes.push(...calcAntinodePosition(antennaA, antennaB, mapPlot));
    }
  }

  return calcUniqueAntinodes(antinodes);
}

export function calcHarmonicAntinodePosition(
  antennaAPosition: Position,
  antennaBPosition: Position,
  mapPlot: MapPlot
): Position[] {
  const antinodes: Position[] = [antennaAPosition, antennaBPosition];
  const vector = calcVector(antennaAPosition, antennaBPosition);

  let cAntennaA = { ...antennaAPosition };
  let antinodeA = calcPositionByVector(cAntennaA, vector);
  while (validPosition(antinodeA, mapPlot)) {
    antinodes.push(antinodeA);
    cAntennaA = { ...antinodeA };
    antinodeA = calcPositionByVector(cAntennaA, vector);
  }

  const flippedVector = flipVector(vector);
  let cAntennaB = { ...antennaBPosition };
  let antinodeB = calcPositionByVector(cAntennaB, flippedVector);
  while (validPosition(antinodeB, mapPlot)) {
    antinodes.push(antinodeB);
    cAntennaB = { ...antinodeB };
    antinodeB = calcPositionByVector(cAntennaB, flippedVector);
  }

  return antinodes;
}

export function calcHarmonicAntinodePositions(
  antennaPositions: Position[],
  mapPlot: MapPlot
): Position[] {
  const antinodes: Position[] = [];

  if (antennaPositions.length === 1) {
    return [];
  }

  for (let i = 0; i < antennaPositions.length; i++) {
    for (let j = i; j < antennaPositions.length; j++) {
      if (i === j) {
        continue;
      }

      const antennaA = antennaPositions[i];
      const antennaB = antennaPositions[j];
      antinodes.push(
        ...calcHarmonicAntinodePosition(antennaA, antennaB, mapPlot)
      );
    }
  }

  return calcUniqueAntinodes(antinodes);
}

function _plot(mapPlot: MapPlot, antinodePositions: Position[]) {
  const cMapPlot = structuredClone(mapPlot);
  antinodePositions.forEach((position) => {
    if (cMapPlot[position.row][position.col] === Blank) {
      cMapPlot[position.row][position.col] = "#";
    }
  });
  console.log(cMapPlot.map((l) => l.join("")).join("\n"));
}

if (import.meta.main) {
  // const text = await readFile("./day_8_example_data.txt");
  const text = await readFile("./day_8_data.txt");
  const mapPlot = parse(text);
  const frequencyAntennasMap = getFrequencyAntennaMap(mapPlot);
  const antinodePositions: Position[] = [];
  frequencyAntennasMap.forEach((antennaPositions, _frequnecy) => {
    antinodePositions.push(...calcAntinodePositions(antennaPositions, mapPlot));
  });
  const uniqueAntinodes = calcUniqueAntinodes(antinodePositions);
  console.log("Part 1: ", uniqueAntinodes.length);

  const harmonicAntinodePositions: Position[] = [];
  frequencyAntennasMap.forEach((antennaPositions, _frequnecy) => {
    harmonicAntinodePositions.push(
      ...calcHarmonicAntinodePositions(antennaPositions, mapPlot)
    );
  });
  const uniqueHarmonicAntinodes = calcUniqueAntinodes(
    harmonicAntinodePositions
  );
  console.log("Part 2: ", uniqueHarmonicAntinodes.length);
}

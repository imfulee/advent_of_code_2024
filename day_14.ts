import { assert } from "@std/assert/assert";

type Position = {
  x: number;
  y: number;
};

type Velocity = {
  x: number;
  y: number;
};

type Robot = {
  position: Position;
  velocity: Velocity;
};

function parse(input: string): Robot[] {
  const lines = input.split("\n");

  const robots = lines.map((line) => {
    const [positionPart, velocityPart] = line.split(" ");
    assert(positionPart);
    assert(velocityPart);

    const [_prefixPosition, positionXY] = positionPart.split("=");
    assert(positionXY);
    const [pX, pY] = positionXY.split(",");
    assert(pX);
    assert(pY);
    const position: Position = {
      x: parseInt(pX, 10),
      y: parseInt(pY, 10),
    };

    const [_prefixVelocity, velocityXY] = velocityPart.split("=");
    assert(velocityXY);
    const [vX, vY] = velocityXY.split(",");
    assert(vX);
    assert(vY);
    const velocity: Velocity = {
      x: parseInt(vX, 10),
      y: parseInt(vY, 10),
    };

    return { position, velocity };
  });

  return robots;
}

const limitX = 101;
const limitY = 103;

function predict(robot: Robot, steps: number): Position {
  let x = (robot.position.x + robot.velocity.x * steps) % limitX;
  if (x < 0) x = limitX + x;
  let y = (robot.position.y + robot.velocity.y * steps) % limitY;
  if (y < 0) y = limitY + y;

  return { x, y };
}

function print(positions: Position[]) {
  const grid: number[][] = [];
  for (let y = 0; y < limitY; y++) {
    const line = [];
    for (let x = 0; x < limitX; x++) {
      line.push(0);
    }
    grid.push(line);
  }

  for (const position of positions) {
    grid[position.y][position.x] += 1;
  }

  for (let y = 0; y < grid.length; y++) {
    let line = "";
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 0) {
        line += ".";
        continue;
      }
      line += `${grid[y][x]}`;
    }
    console.log(line);
  }
}

function safetyNumbers(positions: Position[]) {
  const middleX = Math.floor(limitX / 2);
  const middleY = Math.floor(limitY / 2);

  let topLeft = 0;
  let topRight = 0;
  let bottomLeft = 0;
  let bottomRight = 0;

  for (const position of positions) {
    const { x, y } = position;
    if (x === middleX || y === middleY) continue;
    if (x < middleX && y < middleY) topLeft += 1;
    if (x > middleX && y < middleY) topRight += 1;
    if (x < middleX && y > middleY) bottomLeft += 1;
    if (x > middleX && y > middleY) bottomRight += 1;
  }

  return [topLeft, topRight, bottomLeft, bottomRight];
}

function main() {
  const input = Deno.readTextFileSync("day_14.txt");

  const robots = parse(input);
  const positions = robots.map((r) => predict(r, 100));
  console.log(safetyNumbers(positions).reduce((p, n) => p * n));

  let localMinima = 100000000000;
  let localMinStep = 0;
  for (let steps = 1; steps <= 100000; steps++) {
    robots.forEach((r) => {
      r.position = predict(r, 1);
    });

    const s = safetyNumbers(robots.map((r) => r.position)).reduce((p, n) =>
      p * n
    );
    if (s < localMinima) {
      localMinima = s;
      localMinStep = steps;
      print(robots.map((r) => r.position));
      console.log(localMinima, localMinStep);
      console.log();
    }
  }
}

main();

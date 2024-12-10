import { expect } from "jsr:@std/expect";
import {
  compactMemory,
  constructMemory,
  swapBlocks,
  compactBlocks,
  mergeEmptyBlocks,
  BlockType,
  Block,
} from "./day_9.ts";

Deno.test("compact", () => {
  const testData = ["0", "0", ".", "1", ".", "1"];
  const compacted = compactMemory(testData);
  expect(compacted).toEqual(["0", "0", "1", "1", ".", "."]);
});

Deno.test("construct memory", () => {
  const blocks: Block[] = [
    { type: BlockType.File, id: 0, repeat: 2 },
    { type: BlockType.Free, repeat: 2 },
  ];

  const memory = constructMemory(blocks);
  expect(memory).toEqual(["0", "0", ".", "."]);
});

Deno.test("swap block - same size", () => {
  const blocks: Block[] = [
    { type: BlockType.File, id: 0, repeat: 2 },
    { type: BlockType.Free, repeat: 2 },
    { type: BlockType.File, id: 0, repeat: 2 },
  ];

  const swappedBlocks = swapBlocks(blocks, 2, 1);
  expect(swappedBlocks).toEqual([
    { type: BlockType.File, id: 0, repeat: 2 },
    { type: BlockType.File, id: 0, repeat: 2 },
    { type: BlockType.Free, repeat: 2 },
  ]);
});

Deno.test("swap block - unequal size", () => {
  const blocks: Block[] = [
    { type: BlockType.File, id: 0, repeat: 2 },
    { type: BlockType.Free, repeat: 3 },
    { type: BlockType.File, id: 0, repeat: 2 },
  ];

  const swappedBlocks = swapBlocks(blocks, 2, 1);
  expect(swappedBlocks).toEqual([
    { type: BlockType.File, id: 0, repeat: 2 },
    { type: BlockType.File, id: 0, repeat: 2 },
    { type: BlockType.Free, repeat: 3 },
  ]);
});

Deno.test("compact block - unequal size", () => {
  const blocks: Block[] = [
    { type: BlockType.File, id: 0, repeat: 2 },
    { type: BlockType.Free, repeat: 3 },
    { type: BlockType.File, id: 0, repeat: 2 },
  ];

  const compacted = compactBlocks(blocks);
  expect(compacted).toEqual([
    { type: BlockType.File, id: 0, repeat: 2 },
    { type: BlockType.File, id: 0, repeat: 2 },
    { type: BlockType.Free, repeat: 3 },
  ]);
});

Deno.test("merge empty block", () => {
  const blocks: Block[] = [
    { type: BlockType.Free, repeat: 3 },
    { type: BlockType.Free, repeat: 2 },
    { type: BlockType.File, repeat: 2 },
    { type: BlockType.Free, repeat: 2 },
    { type: BlockType.Free, repeat: 1 },
    { type: BlockType.Free, repeat: 4 },
    { type: BlockType.File, repeat: 2 },
    { type: BlockType.File, repeat: 2 },
    { type: BlockType.Free, repeat: 3 },
  ];

  const merged = mergeEmptyBlocks(blocks);
  expect(merged).toEqual([
    { type: BlockType.Free, repeat: 5 },
    { type: BlockType.File, repeat: 2 },
    { type: BlockType.Free, repeat: 7 },
    { type: BlockType.File, repeat: 2 },
    { type: BlockType.File, repeat: 2 },
    { type: BlockType.Free, repeat: 3 },
  ]);
});

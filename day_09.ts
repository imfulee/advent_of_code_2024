import { assert } from "@std/assert";
import { readFile } from "./reader.ts";

export enum BlockType {
  Free = "free",
  File = "file",
}
export type Block = {
  type: BlockType;
  repeat: number;
  id?: number;
};
type Memory = string[];

const EmptyMemory = ".";

function getNextBlockType(currentBlockType: BlockType): BlockType {
  return currentBlockType === BlockType.Free ? BlockType.File : BlockType.Free;
}

export function parse(text: string): Block[] {
  const blocks: Block[] = [];
  const characters = text.split("");

  let blockType = BlockType.File;
  let id = 0;

  for (const character of characters) {
    const repeat = parseInt(character, 10);
    if (blockType === BlockType.File) {
      blocks.push({ type: blockType, repeat, id });
      id++;
    } else {
      blocks.push({ type: blockType, repeat });
    }
    blockType = getNextBlockType(blockType);
  }

  return blocks;
}

export function constructMemory(blocks: Block[]): Memory {
  const memory: Memory = [];
  for (const block of blocks) {
    const character =
      block.type === BlockType.File ? `${block.id}` : EmptyMemory;
    memory.push(...Array(block.repeat).fill(character));
  }
  return memory;
}

export function compactMemory(memory: Memory): Memory {
  const cMemory = [...memory];
  let start = 0;
  let end = cMemory.length - 1;
  while (end > start) {
    while (cMemory[start] !== EmptyMemory) {
      start++;
      if (start === cMemory.length - 1) {
        break;
      }
    }

    while (cMemory[end] === EmptyMemory) {
      end--;
      if (end === 0) {
        break;
      }
    }

    if (start >= end) {
      break;
    }

    const temp = cMemory[start];
    cMemory[start] = cMemory[end];
    cMemory[end] = temp;
  }

  return cMemory;
}

export function calcChecksum(memory: Memory): number {
  let total = 0;
  for (let index = 0; index < memory.length; index++) {
    if (memory[index] === EmptyMemory) {
      continue;
    }
    total += index * parseInt(memory[index], 10);
  }
  return total;
}

export function swapBlocks(
  blocks: Block[],
  fileBlock: number,
  freeBlock: number
) {
  assert(
    0 <= fileBlock && fileBlock < blocks.length,
    "fileBlock is invalid index"
  );
  assert(
    0 <= freeBlock && freeBlock < blocks.length,
    "freeBlock is invalid index"
  );
  assert(
    blocks[freeBlock].repeat >= blocks[fileBlock].repeat,
    "freeBlock must be equal or greater than fileBlock"
  );
  assert(
    blocks[freeBlock].type === BlockType.Free,
    "block at freeBlock index not free block"
  );
  assert(
    blocks[fileBlock].type === BlockType.File,
    "block at fileBlock index not file block"
  );

  const cFileBlock = { ...blocks[fileBlock] };
  const cFreeBlock = { ...blocks[freeBlock] };
  const remainderOfEmptyBlock =
    blocks[freeBlock].repeat - blocks[fileBlock].repeat;
  if (remainderOfEmptyBlock > 0) {
    return [
      ...blocks.slice(0, freeBlock),
      cFileBlock,
      { type: BlockType.Free, repeat: remainderOfEmptyBlock },
      ...blocks.slice(freeBlock + 1, fileBlock),
      { type: BlockType.Free, repeat: cFileBlock.repeat },
      ...blocks.slice(fileBlock + 1, blocks.length),
    ];
  } else {
    return [
      ...blocks.slice(0, freeBlock),
      cFileBlock,
      ...blocks.slice(freeBlock + 1, fileBlock),
      cFreeBlock,
      ...blocks.slice(fileBlock + 1, blocks.length),
    ];
  }
}

export function mergeEmptyBlocks(blocks: Block[]): Block[] {
  const cBlocks: Block[] = [];

  let start = 0;
  let end = 0;
  while (start < blocks.length) {
    if (blocks[start].type !== BlockType.Free) {
      cBlocks.push(blocks[start]);
      start++;
      end++;
      continue;
    }

    while (end < blocks.length && blocks[end].type === BlockType.Free) {
      end++;
    }
    end--;

    if (start === end) {
      cBlocks.push(blocks[start]);
      start++;
      end++;
      continue;
    }

    cBlocks.push({
      type: BlockType.Free,
      repeat: blocks
        .slice(start, end + 1)
        .reduce((total, b) => total + b.repeat, 0),
    });

    start = end + 1;
    end = start;
  }

  return cBlocks;
}

export function compactBlocks(blocks: Block[]): Block[] {
  let cBlocks = [...blocks];

  let file = cBlocks.length - 1;
  while (file >= 0) {
    while (file >= 0 && cBlocks[file].type !== BlockType.File) {
      file--;
    }

    let free = 0;
    let noneToSwap = false;
    while (
      cBlocks[free].type !== BlockType.Free ||
      cBlocks[free].repeat < cBlocks[file].repeat
    ) {
      if (free === file) {
        noneToSwap = true;
        break;
      }
      free++;
    }

    if (noneToSwap) {
      file--;
      continue;
    }

    if (cBlocks[free].repeat >= cBlocks[file].repeat) {
      const swapped = swapBlocks(cBlocks, file, free);
      const merged = mergeEmptyBlocks(swapped);
      file--;
      cBlocks = merged;
    }
  }

  return cBlocks;
}

if (import.meta.main) {
  // const text = await readFile("./day_9_example_data.txt");
  const text = await readFile("./day_9_data.txt");
  const blocks = parse(text);

  {
    const memory = constructMemory(blocks);
    const compactedMemory = compactMemory(memory);
    const checksum = calcChecksum(compactedMemory);
    console.log("Part 1: ", checksum);
  }

  {
    const compactedBlocks = compactBlocks(blocks);
    const memory = constructMemory(compactedBlocks);
    const checksum = calcChecksum(memory);
    console.log("Part 2: ", checksum);
  }
}

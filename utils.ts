export function popHead<T>(array: readonly T[]): {
  head: T | null;
  remainingArray: T[];
} {
  if (array.length === 0) {
    return { head: null, remainingArray: [] };
  }

  const head = array[0];
  const remainingArray = array.slice(1);
  return { head, remainingArray };
}

export function popTail<T>(array: readonly T[]): {
  remainingArray: T[];
  tail: T | null;
} {
  if (array.length === 0) {
    return { tail: null, remainingArray: [] };
  }

  const tail = array[array.length - 1];
  const remainingArray = array.slice(0, array.length - 1);
  return { tail, remainingArray };
}

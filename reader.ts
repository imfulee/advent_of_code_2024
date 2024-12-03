export async function readFile(filepath: string): Promise<string> {
  const text = await Deno.readTextFile(filepath);
  return text;
}

export async function writeFile(filePath: string, text: string) {
  await Deno.writeTextFile(filePath, text);
}

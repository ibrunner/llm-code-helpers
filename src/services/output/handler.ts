import { writeFile } from "fs/promises";
import { join } from "path";
import clipboard from "clipboardy";
import type { MRContextOptions } from "../../types";

export async function handleOutput(
  content: string,
  options: MRContextOptions
): Promise<void> {
  if (options.outputPath) {
    await writeFile(options.outputPath, content, "utf-8");
  }

  if (options.copyToClipboard) {
    await clipboard.write(content);
  }

  if (!options.outputPath && !options.copyToClipboard) {
    // If no output options specified, print to console
    console.log(content);
  }
}

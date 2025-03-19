import { writeFile } from "fs/promises";
import { join } from "path";
import clipboard from "clipboardy";
import type { MRContextOptions } from "../../types";

/**
 * Handles the output of content based on provided options
 * @param {string} content - The content to be output
 * @param {MRContextOptions} options - Configuration options for output handling
 * @param {string} [options.outputPath] - Optional file path to write the content to
 * @param {boolean} [options.copyToClipboard] - Whether to copy the content to clipboard
 * @returns {Promise<void>} A promise that resolves when the output handling is complete
 * @throws {Error} If file writing or clipboard operations fail
 */
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

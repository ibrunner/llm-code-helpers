import simpleGit from "simple-git";
import { parse } from "@typescript-eslint/parser";
import type { MRContextOptions, FileContext, DiffContext } from "../../types";
import { extractDeclarations } from "../parser/typescript";

/**
 * Analyzes git changes between branches to extract file contexts and diffs
 * @param {MRContextOptions} options - Configuration options including repository path and branch information
 * @returns {Promise<{files: FileContext[], diffs: DiffContext[]}>} Object containing parsed file contexts and diffs
 * @throws {Error} If git operations fail or no diff output is received
 */
export async function analyzeChanges(options: MRContextOptions): Promise<{
  files: FileContext[];
  diffs: DiffContext[];
}> {
  const git = simpleGit(options.repoPath);

  try {
    // Ensure we're on the right branch
    if (options.branch) {
      console.log(`Checking out branch: ${options.branch}`);
      await git.checkout(options.branch);
    }

    // Get the base branch or use default
    const base = options.base || (await determineDefaultBase(git));
    console.log(`Using base branch/ref: ${base}`);

    // Get modified files
    console.log("Getting modified files...");
    const diff = await git.diff([base, "--name-only"]);
    if (!diff) {
      throw new Error("No diff output received from git");
    }

    const modifiedFiles = diff
      .split("\n")
      .filter(Boolean) // Remove empty lines
      .filter((file: string) => file.endsWith(".ts"));

    console.log(`Found ${modifiedFiles.length} modified TypeScript files`);

    if (modifiedFiles.length === 0) {
      return { files: [], diffs: [] };
    }

    const results = await Promise.all(
      modifiedFiles.map(async (file: string) => {
        try {
          console.log(`Processing file: ${file}`);

          // Get file content
          const content = await git.show([
            `${options.branch || "HEAD"}:${file}`,
          ]);
          if (!content) {
            console.warn(`No content found for file: ${file}`);
            return null;
          }

          // Parse TypeScript
          console.log(`Parsing TypeScript for file: ${file}`);
          const ast = parse(content, {
            sourceType: "module",
            ecmaVersion: 2020,
          });

          // Extract declarations and modified functions
          console.log(`Extracting declarations for file: ${file}`);
          const fileContext = await extractDeclarations(ast, content);

          // Get diff for this file
          console.log(`Getting diff for file: ${file}`);
          const fileDiff = await git.diff([base, "HEAD", "--", file]);
          if (!fileDiff) {
            console.warn(`No diff found for file: ${file}`);
            return null;
          }

          const hunks = parseHunks(fileDiff);
          console.log(`Found ${hunks.length} diff hunks for file: ${file}`);

          return {
            file: {
              path: file,
              ...fileContext,
            },
            diff: {
              filePath: file,
              diff: fileDiff,
              hunks,
            },
          };
        } catch (error) {
          console.error(`Error processing file ${file}:`, error);
          return null;
        }
      })
    );

    // Filter out null results and handle errors
    const validResults = results.filter(
      (r): r is NonNullable<typeof r> => r !== null
    );
    console.log(
      `Successfully processed ${validResults.length} out of ${modifiedFiles.length} files`
    );

    return {
      files: validResults.map((r) => r.file),
      diffs: validResults.map((r) => r.diff),
    };
  } catch (error) {
    console.error("Error in analyzeChanges:", error);
    throw error;
  }
}

/**
 * Determines the default base branch for the repository
 * @param {ReturnType<typeof simpleGit>} git - SimpleGit instance
 * @returns {Promise<string>} Name of the default branch ('main' or 'master')
 */
async function determineDefaultBase(
  git: ReturnType<typeof simpleGit>
): Promise<string> {
  // Try to find the default branch (main or master)
  try {
    const branches = await git.branch();
    if (branches.all.includes("main")) {
      return "main";
    }
    if (branches.all.includes("master")) {
      return "master";
    }
  } catch (error) {
    // Fall back to master if we can't determine
    return "master";
  }
  return "master";
}

/**
 * Parses git diff output into structured hunk objects
 * @param {string} diff - Raw git diff output
 * @returns {DiffContext["hunks"]} Array of parsed diff hunks containing position and content information
 */
function parseHunks(diff: string): DiffContext["hunks"] {
  try {
    // Basic hunk parsing - this could be enhanced
    const hunks = [];
    const lines = diff.split("\n");
    let currentHunk: any = null;

    for (const line of lines) {
      const hunkHeader = line.match(/@@ -(\d+),(\d+) \+(\d+),(\d+) @@/);
      if (hunkHeader) {
        if (currentHunk) {
          hunks.push(currentHunk);
        }
        currentHunk = {
          content: line + "\n",
          oldStart: parseInt(hunkHeader[1], 10),
          oldLines: parseInt(hunkHeader[2], 10),
          newStart: parseInt(hunkHeader[3], 10),
          newLines: parseInt(hunkHeader[4], 10),
        };
      } else if (currentHunk) {
        currentHunk.content += line + "\n";
      }
    }

    if (currentHunk) {
      hunks.push(currentHunk);
    }

    return hunks;
  } catch (error) {
    console.error("Error parsing hunks:", error);
    return [];
  }
}

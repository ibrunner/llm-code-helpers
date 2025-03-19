import { Command } from "commander";
import chalk from "chalk";
import simpleGit from "simple-git";
import clipboardy from "clipboardy";
import { PromptService } from "../services/llm/promptService";

// Default files to exclude from the diff
const DEFAULT_EXCLUDE_PATTERNS = [
  "yarn.lock",
  "package-lock.json",
  "pnpm-lock.yaml",
  "*.d.ts",
  "dist/*",
  "build/*",
  "node_modules/*",
];

/**
 * Creates and configures the 'analyze' command for comparing git branches
 * @returns {Command} Configured Commander command object for git analysis
 *
 * @example
 * // Basic usage
 * analyze
 *
 * // Compare specific branch with main
 * analyze -b feature-branch
 *
 * // Compare with custom base branch
 * analyze -b feature-branch --base develop
 *
 * // Include dependency files in diff
 * analyze -v
 *
 * // Copy result to clipboard
 * analyze -c
 */
export function createAnalyzeCommand(): Command {
  const command = new Command("analyze");

  command
    .description("Show diff between current branch and master/main")
    /**
     * @param {string} [repoPath] - Path to the git repository. Defaults to current working directory
     * @param {Object} options - Command options
     * @param {string} [options.branch] - Branch to analyze (defaults to current branch)
     * @param {string} [options.base] - Base branch/commit for comparison (defaults to main/master)
     * @param {boolean} [options.clipboard] - Whether to copy the result to clipboard
     * @param {boolean} [options.verbose] - Whether to include dependency files in the diff
     */
    .argument("[repo-path]", "Path to the git repository", process.cwd())
    .option("-b, --branch <branch>", "Branch to analyze (defaults to current)")
    .option(
      "--base <base>",
      "Base branch/commit for comparison (defaults to main/master)"
    )
    .option("-c, --clipboard", "Copy result to clipboard")
    .option("-v, --verbose", "Include dependency files in the diff")
    .action(
      async (
        repoPath: string,
        options: {
          branch?: string;
          base?: string;
          clipboard?: boolean;
          verbose?: boolean;
        }
      ) => {
        try {
          const git = simpleGit(repoPath);

          // Get current branch if not specified
          const currentBranch =
            options.branch || (await git.revparse(["--abbrev-ref", "HEAD"]));

          // Determine base branch (main or master)
          const base =
            options.base ||
            (await (async () => {
              const branches = await git.branch();
              return branches.all.includes("main") ? "main" : "master";
            })());

          // Build diff command with exclude patterns
          const diffArgs = [base, currentBranch];
          if (!options.verbose) {
            DEFAULT_EXCLUDE_PATTERNS.forEach((pattern) => {
              diffArgs.push(":(exclude)" + pattern);
            });
          }

          // Get and display the full diff
          const diff = await git.diff(diffArgs);
          if (!diff) {
            console.log(chalk.yellow("No changes found"));
            return;
          }

          // Generate the prompt with the diff
          const prompt = PromptService.generateReviewPrompt(diff, {
            verbose: options.verbose,
          });

          // Copy to clipboard if requested
          if (options.clipboard) {
            await clipboardy.write(prompt);
            console.log(chalk.green("Prompt copied to clipboard"));
          }

          console.log(prompt);
        } catch (error) {
          console.error(
            chalk.red(error instanceof Error ? error.message : "Unknown error")
          );
          process.exit(1);
        }
      }
    );

  return command;
}

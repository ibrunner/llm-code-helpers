import { Command } from "commander";
import chalk from "chalk";
import simpleGit from "simple-git";
import clipboardy from "clipboardy";

export function createAnalyzeCommand(): Command {
  const command = new Command("analyze");

  command
    .description("Show diff between current branch and master/main")
    .argument("[repo-path]", "Path to the git repository", process.cwd())
    .option("-b, --branch <branch>", "Branch to analyze (defaults to current)")
    .option(
      "--base <base>",
      "Base branch/commit for comparison (defaults to main/master)"
    )
    .option("-c, --clipboard", "Copy result to clipboard")
    .action(
      async (
        repoPath: string,
        options: { branch?: string; base?: string; clipboard?: boolean }
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

          // Get and display the full diff
          const diff = await git.diff([base, currentBranch]);
          if (!diff) {
            console.log(chalk.yellow("No changes found"));
            return;
          }

          // Copy to clipboard if requested
          if (options.clipboard) {
            await clipboardy.write(diff);
            console.log(chalk.green("Diff copied to clipboard"));
          }

          console.log(diff);
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

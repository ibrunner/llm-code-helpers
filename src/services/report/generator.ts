import type { FileContext, DiffContext } from "../../types";

export async function generateReport(data: {
  files: FileContext[];
  diffs: DiffContext[];
}): Promise<string> {
  const sections = [
    generateHeader(),
    generateFileOverview(data.files),
    generateDiffs(data.diffs),
    generatePrompt(),
  ];

  return sections.join("\n\n");
}

function generateHeader(): string {
  return [
    "# Merge Request Context",
    "",
    "This report provides context for reviewing the merge request changes.",
    "",
  ].join("\n");
}

function generateFileOverview(files: FileContext[]): string {
  const sections = ["## Modified Files Overview", ""];

  files.forEach((file) => {
    sections.push(`### ${file.path}`);
    sections.push("");

    if (file.declarations.length > 0) {
      sections.push("#### Declarations");
      sections.push("");
      file.declarations.forEach((decl) => {
        sections.push(`- ${decl.type}: \`${decl.name}\``);
      });
      sections.push("");
    }

    if (file.modifiedFunctions.length > 0) {
      sections.push("#### Modified Functions");
      sections.push("");
      file.modifiedFunctions.forEach((func) => {
        sections.push(`<details>`);
        sections.push(`<summary>\`${func.name}\`</summary>`);
        sections.push("");
        sections.push("```typescript");
        sections.push(func.content);
        sections.push("```");
        sections.push("");
        sections.push("</details>");
        sections.push("");
      });
    }
  });

  return sections.join("\n");
}

function generateDiffs(diffs: DiffContext[]): string {
  const sections = ["## Changes", ""];

  diffs.forEach((diff) => {
    sections.push(`### ${diff.filePath}`);
    sections.push("");
    sections.push("<details>");
    sections.push("<summary>View changes</summary>");
    sections.push("");
    sections.push("```diff");
    sections.push(diff.diff);
    sections.push("```");
    sections.push("");
    sections.push("</details>");
    sections.push("");
  });

  return sections.join("\n");
}

function generatePrompt(): string {
  return [
    "## Review Request",
    "",
    "Please review these changes with attention to:",
    "- Code correctness and potential bugs",
    "- Design patterns and architecture",
    "- Performance implications",
    "- Security considerations",
    "- Test coverage",
    "",
    "Provide specific, actionable feedback and suggestions for improvement if needed.",
  ].join("\n");
}

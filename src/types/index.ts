/** Options for configuring merge request context analysis */
export interface MRContextOptions {
  repoPath: string;
  branch?: string;
  base?: string;
  output?: string;
  outputPath?: string;
  clipboard?: boolean;
  copyToClipboard?: boolean;
}

/** Represents the context of a file being analyzed, including its declarations and modified functions */
export interface FileContext {
  path: string;
  declarations: Declaration[];
  modifiedFunctions: FunctionContext[];
}

/** Describes a code declaration (function, variable, class, etc.) and its location in the file */
export interface Declaration {
  type: "function" | "variable" | "class" | "interface" | "type";
  name: string;
  location: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
}

/** Contains information about a function's name, content, and location in the file */
export interface FunctionContext {
  name: string;
  content: string;
  location: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
}

/** Represents the diff context for a modified file */
export interface DiffContext {
  filePath: string;
  diff: string;
  hunks: DiffHunk[];
}

/** Describes a single chunk of changes within a diff */
export interface DiffHunk {
  content: string;
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
}

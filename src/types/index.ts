export interface MRContextOptions {
  repoPath: string;
  branch?: string;
  base?: string;
  output?: string;
  outputPath?: string;
  clipboard?: boolean;
  copyToClipboard?: boolean;
}

export interface FileContext {
  path: string;
  declarations: Declaration[];
  modifiedFunctions: FunctionContext[];
}

export interface Declaration {
  type: "function" | "variable" | "class" | "interface" | "type";
  name: string;
  location: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
}

export interface FunctionContext {
  name: string;
  content: string;
  location: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
}

export interface DiffContext {
  filePath: string;
  diff: string;
  hunks: DiffHunk[];
}

export interface DiffHunk {
  content: string;
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
}

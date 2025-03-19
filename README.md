# llm-code-helpers

CLI tools for gathering and analyzing code for LLM processing, with a focus on merge request reviews.

## Features

- Analyzes local git branches/commits
- Extracts TypeScript declarations and modified functions
- Generates a markdown report with:
  - File overview with declarations
  - Modified function details
  - Git diffs in collapsible sections
  - Review prompt
- Supports output to file or clipboard

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/llm-code-helpers.git
cd llm-code-helpers

# Install dependencies
yarn install

# Build the project
yarn build

# For development (recommended):
# This will run the CLI directly without installing globally
yarn dev analyze ./path/to/repo [options]

# For global installation (optional):
# This makes the 'mr-context' command available system-wide
npm install -g .
# Or using yarn:
yarn global add file:$PWD
```

## Usage

```bash
# Using yarn (recommended for development)
yarn dev analyze ./path/to/repo
yarn dev analyze ./path/to/repo -b feature/branch
yarn dev analyze ./path/to/repo --base main
yarn dev analyze ./path/to/repo -o output.md
yarn dev analyze ./path/to/repo -c

# Or if you've installed globally:
mr-context analyze ./path/to/repo
mr-context analyze ./path/to/repo -b feature/branch
mr-context analyze ./path/to/repo --base main
mr-context analyze ./path/to/repo -o output.md
mr-context analyze ./path/to/repo -c
```

## Known Limitations

- TypeScript parsing may show warnings for complex arrow functions
- Some TypeScript features may not be fully supported in the analysis
- The tool will still generate a report with the changes it can successfully parse

## Project Structure

```
src/
├── index.ts                 # Main CLI entry point
├── commands/
│   └── analyze.ts          # Main analyze command implementation
└── services/
    ├── git/                # Git operations and diff analysis
    ├── parser/             # TypeScript AST parsing
    ├── report/             # Markdown report generation
    └── output/             # Output handling (file/clipboard)
```

## Development

```bash
# Build the project
yarn build

# Run in development mode with hot reload
yarn dev

# Run tests
yarn test

# Check for linting issues
yarn lint

# Type check
yarn typecheck
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[Add your chosen license here]

export const DEFAULT_REVIEW_PROMPT = `
Please review the following code changes:

## Project Context
The changes are made in a TypeScript project. Below you'll find:
1. A summary of changed files
2. The full diff of the changes

## Changes
{diffContent}

Please provide your feedback in the following format:

1. High-Level Summary
-------------------- 
Provide a brief overview of the changes and their purpose.

2. File-by-File Analysis
-----------------------
For each file that needs attention, use this structure:

### [filename]
#### Issue 1
**Description**: [Clear description of the issue]

**Current Code**:
\`\`\`[language]
[problematic code snippet]
\`\`\`

**Suggested Fix**:
\`\`\`[language]
[corrected code]
\`\`\`

**Explanation**: [Detailed explanation of why this change is needed and how it improves the code]

[Repeat this structure for each issue in the file]

3. Security Considerations
-------------------------
List any security implications or concerns.

4. Questions for the Author
--------------------------
List any clarifying questions that would help improve the code further.

Focus on:
- Code correctness
- Performance implications
- Security considerations
- Best practices
- Maintainability
`;

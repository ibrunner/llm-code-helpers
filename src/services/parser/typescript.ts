import type { TSESTree } from "@typescript-eslint/types";
import type { Declaration, FileContext, FunctionContext } from "../../types";

/**
 * Extracts declarations and function contexts from a TypeScript AST
 * @param ast - The TypeScript AST program node
 * @param sourceCode - Original source code string
 * @returns FileContext object containing declarations and modified functions
 */
export async function extractDeclarations(
  ast: TSESTree.Program,
  sourceCode: string
): Promise<Omit<FileContext, "path">> {
  const declarations: Declaration[] = [];
  const modifiedFunctions: FunctionContext[] = [];

  /**
   * Recursively visits AST nodes to identify and extract declarations
   * @param node - Current AST node being processed
   */
  function visit(node: TSESTree.Node) {
    if (!node || !node.type || !node.loc) {
      return;
    }

    try {
      // Handle arrow functions differently
      if (node.type === "ArrowFunctionExpression") {
        // Skip arrow functions for now as they're causing issues
        return;
      }

      if (node.type === "FunctionDeclaration") {
        if (node.id?.type === "Identifier") {
          declarations.push({
            type: "function",
            name: node.id.name,
            location: {
              start: node.loc.start,
              end: node.loc.end,
            },
          });
        }
      } else if (node.type === "MethodDefinition") {
        if (node.key?.type === "Identifier") {
          declarations.push({
            type: "function",
            name: node.key.name,
            location: {
              start: node.loc.start,
              end: node.loc.end,
            },
          });
        }
      } else if (node.type === "VariableDeclaration") {
        node.declarations.forEach((decl) => {
          if (decl.id?.type === "Identifier") {
            declarations.push({
              type: "variable",
              name: decl.id.name,
              location: {
                start: decl.loc.start,
                end: decl.loc.end,
              },
            });
          }
        });
      } else if (node.type === "ClassDeclaration") {
        if (node.id?.type === "Identifier") {
          declarations.push({
            type: "class",
            name: node.id.name,
            location: {
              start: node.loc.start,
              end: node.loc.end,
            },
          });
        }
      } else if (
        (node.type === "TSInterfaceDeclaration" ||
          node.type === "TSTypeAliasDeclaration") &&
        node.id?.type === "Identifier"
      ) {
        declarations.push({
          type: "type",
          name: node.id.name,
          location: {
            start: node.loc.start,
            end: node.loc.end,
          },
        });
      }

      /**
       * Recursively process child nodes
       * Handles both array and object children that contain AST nodes
       */
      for (const [key, value] of Object.entries(node)) {
        if (!value || typeof value !== "object") continue;

        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (item && typeof item === "object" && "type" in item) {
              visit(item as TSESTree.Node);
            }
          });
        } else if ("type" in value) {
          visit(value as TSESTree.Node);
        }
      }
    } catch (error) {
      console.warn(`Error processing node of type ${node.type}:`, error);
    }
  }

  try {
    ast.body.forEach(visit);
  } catch (error) {
    console.error("Error processing AST:", error);
  }

  return {
    declarations,
    modifiedFunctions,
  };
}

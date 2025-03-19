/**
 * Default prompt template for code review
 */
import { DEFAULT_REVIEW_PROMPT } from "./templates";

/**
 * Configuration options for prompt generation
 * @interface PromptOptions
 */
export interface PromptOptions {
  /** Flag to enable verbose output */
  verbose?: boolean;
}

/**
 * Service class for generating prompts for LLM interactions
 */
export class PromptService {
  /**
   * Generates a prompt for code review by inserting diff content into a template
   * @param {string} diffContent - The git diff content to be reviewed
   * @param {PromptOptions} [options={}] - Configuration options for prompt generation
   * @returns {string} The formatted prompt string ready for LLM consumption
   */
  static generateReviewPrompt(
    diffContent: string,
    options: PromptOptions = {}
  ): string {
    const template = DEFAULT_REVIEW_PROMPT;
    return template.replace("{diffContent}", diffContent);
  }
}

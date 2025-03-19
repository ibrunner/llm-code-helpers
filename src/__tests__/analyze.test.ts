import { createAnalyzeCommand } from "../commands/analyze";
import { Command } from "commander";

describe("analyze command", () => {
  it("should create a command with correct options", () => {
    const command = createAnalyzeCommand();

    expect(command).toBeInstanceOf(Command);
    expect(command.name()).toBe("analyze");

    const options = command.opts();
    expect(options).toHaveProperty("branch");
    expect(options).toHaveProperty("base");
    expect(options).toHaveProperty("output");
    expect(options).toHaveProperty("clipboard");
  });
});

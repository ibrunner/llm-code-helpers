#!/usr/bin/env node

import { Command } from "commander";
import { createAnalyzeCommand } from "./commands/analyze";

const program = new Command();

program
  .name("mr-context")
  .description("Generate context for merge request reviews")
  .version("0.1.0");

program.addCommand(createAnalyzeCommand());

program.parse();

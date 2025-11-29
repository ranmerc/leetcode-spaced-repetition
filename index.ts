import type { ProblemsDB } from "./db/db";
import { LocalDB } from "./db/local";
import { TursoDB } from "./db/turso";
import { handleAddProblem } from "./addProblem";
import { Environment, LocalConfig, TursoConfig } from "./types/config";
import { handleReviewProblem } from "./reviewProblem";
import { readUserInput } from "./utils/input";
import { handleShowProblems } from "./showProblems";

const { data: environmentType, error } = Environment.safeParse(
  process.env.TYPE,
);

if (error) {
  console.error(
    "Failed to load environment type. Please check the environment variable TYPE. Valid values are 'local' or 'hosted'.",
  );
  process.exit(1);
}

let db: ProblemsDB;

if (environmentType === "hosted") {
  const { data: config, error } = TursoConfig.safeParse({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  if (error) {
    console.error(
      "Failed to load Turso configuration. Please check the environment variables TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.",
    );
    process.exit(1);
  }

  db = new TursoDB(config);
} else {
  const { data: config } = LocalConfig.safeParse({
    filePath: process.env.LOCAL_DATABASE_PATH,
  });

  db = new LocalDB(config?.filePath);
}

process.stdout.write("Welcome to Leetcode Spaced Repetition System\n");

while (true) {
  process.stdout.write("\nChoose an option:\n");
  process.stdout.write("1. Add a problem\n");
  process.stdout.write("2. Review problems\n");
  process.stdout.write("3. Show Solved Problems\n");
  process.stdout.write("4. Exit\n");

  const userInput = await readUserInput("> ");

  switch (userInput) {
    case "1": {
      await handleAddProblem(db);
      break;
    }
    case "2": {
      await handleReviewProblem(db);
      break;
    }
    case "3": {
      await handleShowProblems(db);
      break;
    }
    case "4": {
      process.stdout.write("Goodbye!\n");
      process.exit(0);
    }

    default: {
      process.stdout.write("Invalid option. Please choose again.\n");
      break;
    }
  }
}

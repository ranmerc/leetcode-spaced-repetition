import { Problem } from "./types/problem";
import type { ProblemsDB } from "./db/db";
import { readUserInput } from "./utils/input";

export const handleAddProblem = async (db: ProblemsDB) => {
  const name = await readUserInput("Problem name: ");
  const url = await readUserInput("Problem URL: ");
  const confidence = Number(await readUserInput("Confidence level: "));
  // Convert the date to a string in the format "YYYY-MM-DD", stripping the time
  const date = new Date().toISOString().substring(0, 10);

  const { data: problem, error } = Problem.safeParse({
    name,
    url,
    confidence,
    date,
    times: 1,
  });

  if (error) {
    console.error("Failed to add problem. Please check the input values.");
    return;
  }

  try {
    await db.saveProblem(problem);
  } catch (e) {
    console.error("Failed to add problem. Please try again.");
    return;
  }

  console.log("Problem added successfully!");
};

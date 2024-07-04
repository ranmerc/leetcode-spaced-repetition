import { addProblemQuery, getProblemsQuery } from "./sqlQueries";
import { ProblemList, type ProblemType } from "../types/problem";
import type { ProblemsDB } from "./db";
import { Database } from "bun:sqlite";

export class LocalDB implements ProblemsDB {
  db: Database;

  constructor(filePath: string = "db.sqlite") {
    this.db = new Database(filePath, {
      create: true,
    });
  }

  async getProblems() {
    const query = this.db.query(getProblemsQuery);

    const result = query.all();

    return ProblemList.parse(result);
  }

  async saveProblem(problem: ProblemType) {
    const result = this.db.query(addProblemQuery);

    result.run({
      $1: problem.name,
      $2: problem.url,
      $3: problem.date,
      $4: problem.confidence,
      $5: problem.times,
    });
  }
}

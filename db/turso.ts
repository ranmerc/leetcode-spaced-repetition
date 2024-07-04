import { createClient, type Client, type Config } from "@libsql/client";
import { ProblemList, type ProblemType } from "../types/problem";
import { addProblemQuery, getProblemsQuery } from "./sqlQueries";
import type { ProblemsDB } from "./db";

export class TursoDB implements ProblemsDB {
  client: Client;

  constructor(config: Config) {
    this.client = createClient(config);
  }

  async getProblems() {
    const result = await this.client.execute(getProblemsQuery);

    const problemResults = result.rows.map((row) => {
      return result.columns.reduce((object, column, i) => {
        return {
          ...object,
          [column]: row[i],
        };
      }, {});
    });

    return ProblemList.parse(problemResults);
  }

  async saveProblem(problem: ProblemType) {
    await this.client.execute({
      sql: addProblemQuery,
      args: {
        1: problem.name,
        2: problem.url,
        3: problem.date,
        4: problem.confidence,
        5: problem.times,
      },
    });
  }
}

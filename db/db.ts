import type { ProblemListType, ProblemType } from "../types/problem";

export interface ProblemsDB {
  getProblems(): Promise<ProblemListType>;
  saveProblem(problem: ProblemType): Promise<void>;
}

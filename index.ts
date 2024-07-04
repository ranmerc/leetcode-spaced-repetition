import { Database } from "bun:sqlite";
import {
  ProblemList,
  type ProblemListType,
  type ProblemType,
} from "./types/problem";

const db = new Database("db.sqlite");

const query = db.query(`SELECT * FROM 'problems'`);

const result = query.all();

const { data: problemsList, error } = ProblemList.safeParse(result);

if (error) {
  console.error(error);
  process.exit(1);
}

function calculateNextReviewDate(problem: ProblemType) {
  const baseIntervals: Record<number, number> = {
    1: 1,
    2: 2,
    3: 4,
    4: 7,
    5: 10,
    6: 14,
    7: 21,
    8: 30,
    9: 45,
    10: 60,
  };

  const baseInterval = baseIntervals[problem.confidence];
  const intervalFactor = Math.pow(2, problem.times - 1);
  const nextInterval = baseInterval * intervalFactor;

  const lastSolvedDate = new Date(problem.date);
  const nextReviewDate = new Date(lastSolvedDate);
  nextReviewDate.setDate(lastSolvedDate.getDate() + nextInterval);

  return nextReviewDate;
}

function getNextProblemToSolve(problemsList: ProblemListType) {
  const problemsWithNextReviewDates = problemsList.map((problem) => ({
    ...problem,
    nextReviewDate: calculateNextReviewDate(problem),
  }));

  problemsWithNextReviewDates.sort(
    (a, b) => a.nextReviewDate.getTime() - b.nextReviewDate.getTime()
  );

  const now = new Date();
  const nextProblem = problemsWithNextReviewDates.find(
    (problem) => problem.nextReviewDate <= now
  );

  if (nextProblem) {
    return nextProblem;
  } else {
    return "All problems are up-to-date. No problems to revise.";
  }
}

const nextProblem = getNextProblemToSolve(problemsList);
console.log("Next problem to solve:", nextProblem);

db.close();

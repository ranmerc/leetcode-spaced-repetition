import type { ProblemsDB } from "./db/db";
import type { ProblemListType, ProblemType } from "./types/problem";

export const handleReviewProblem = async (db: ProblemsDB) => {
  try {
    const problemsList = await db.getProblems();
    const nextProblem = getNextProblemToSolve(problemsList);

    if (nextProblem) {
      console.log(
        `Next problem to solve: ${nextProblem.name} - ${nextProblem.url}`
      );
    } else {
      console.log("No problems to review at the moment.");
    }
  } catch (e) {
    console.error("Failed to review problems. Please try again.");
  }
};

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
  }
}

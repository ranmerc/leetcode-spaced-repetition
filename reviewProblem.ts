import type { ProblemsDB } from "./db/db";
import type { ProblemListType, ProblemType } from "./types/problem";

export const handleReviewProblem = async (db: ProblemsDB) => {
  try {
    const problemsList = await db.getProblems();
    const { problemsToReview, upcomingProblems } =
      getReviewProblems(problemsList);

    if (problemsToReview.length > 0) {
      console.log("\nProblems to review:");
      problemsToReview.forEach((problem) => {
        console.log(
          `${problem.name} - ${
            problem.url
          } - ${problem.nextReviewDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}`
        );
      });
    } else {
      console.log("\nNo problems to review at the moment.");
    }

    if (upcomingProblems.length > 0) {
      console.log("\nUpcoming problems to review:");
      // Show the next 3 upcoming problems
      upcomingProblems.slice(0, 3).forEach((problem) => {
        console.log(
          `${problem.name} - ${
            problem.url
          } - ${problem.nextReviewDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}`
        );
      });
    } else {
      console.log("\nNo upcoming problems to review.");
    }
  } catch (e) {
    console.error("\nFailed to review problems. Please try again.");
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

function getReviewProblems(problemsList: ProblemListType) {
  const problemsWithNextReviewDates = problemsList.map((problem) => ({
    ...problem,
    nextReviewDate: calculateNextReviewDate(problem),
  }));

  problemsWithNextReviewDates.sort(
    (a, b) => a.nextReviewDate.getTime() - b.nextReviewDate.getTime()
  );

  const problemsToReview = problemsWithNextReviewDates.filter(
    (problem) => problem.nextReviewDate <= new Date()
  );
  const upcomingProblems = problemsWithNextReviewDates.filter(
    (problem) => problem.nextReviewDate > new Date()
  );

  return {
    problemsToReview,
    upcomingProblems,
  };
}

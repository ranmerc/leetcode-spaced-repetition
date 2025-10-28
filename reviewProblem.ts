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

// WARNING: This function is written by LLM. Replace if not working as intended.
function calculateNextReviewDate(problem: ProblemType) {
  const lastDate = new Date(problem.date);

  // 1–10 confidence → lower confidence = sooner review
  const base = Math.max(1, Math.round(problem.confidence / 2)); // 1–5 days
  const growth = 1.7; // moderate curve

  // Smooth interval growth, capped at 30 days
  const interval = Math.min(
    30,
    Math.round(base * Math.pow(growth, problem.times - 1))
  );

  const nextReviewDate = new Date(lastDate);
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

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

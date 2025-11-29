import { Table } from "console-table-printer";
import type { ProblemsDB } from "./db/db";

export const handleShowProblems = async (db: ProblemsDB) => {
  const problemList = await db.getProblems();

  if (problemList.length === 0) {
    console.log("\nNo problems found.");
    return;
  }

  const listToShow = problemList.map((problem) => {
    return {
      name: problem.name,
      date: problem.date,
      times: problem.times,
      confidence: problem.confidence,
    };
  });

  const table = new Table({
    columns: [
      { title: "Name", name: "name", alignment: "left" },
      { title: "Confidence", name: "confidence", alignment: "left" },
      { title: "Times", name: "times", alignment: "left" },
      { title: "Date", name: "date", alignment: "left" },
    ],
    rows: listToShow,
    sort: (row1, row2) => row1.confidence - row2.confidence,
  });

  table.printTable();
};

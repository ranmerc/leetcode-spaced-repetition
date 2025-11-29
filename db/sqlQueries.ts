export const getProblemsQuery = `SELECT name, url, date, confidence, times FROM 'problems'`;

export const addProblemQuery = `
  INSERT INTO 'problems' (name, url, date, confidence, times)
  VALUES ($1, $2, $3, $4, $5)
  ON CONFLICT(url)
  DO UPDATE SET times = problems.times + 1, date = $3, confidence = $4;
`;

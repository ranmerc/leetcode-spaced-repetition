import { z } from "zod";

export const Problem = z.object({
  name: z.string(),
  url: z.string().url(),
  date: z.string().date(),
  confidence: z.number().lte(10),
  times: z.number().gte(0),
});

export type ProblemType = z.infer<typeof Problem>;

export const ProblemList = z.array(Problem);

export type ProblemListType = z.infer<typeof ProblemList>;

import { z } from "zod";

export const Environment = z.enum(["local", "hosted"]);

export const TursoConfig = z.object({
  url: z.string().url(),
  authToken: z.string(),
});

export const LocalConfig = z.object({
  filePath: z.string().optional(),
});

import { z } from "zod";

export const createUser = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
  avatar: z.string(),
  status: z.string(),
});

import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email(),
  phone: z.string().trim().min(8),
  instrument: z.string().trim().min(2),
});

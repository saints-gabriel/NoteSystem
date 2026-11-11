import { z } from "zod";

const time = z.string().regex(/^\d{2}:\d{2}$/);

export const settingsSchema = z
  .object({
    schoolName: z.string().trim().min(2),
    email: z.email(),
    phone: z.string().trim().min(8),
    openTime: time,
    closeTime: time,
    revenueGoal: z.coerce.number().min(0),
    payments: z.boolean(),
    classes: z.boolean(),
    insights: z.boolean(),
  })
  .partial();

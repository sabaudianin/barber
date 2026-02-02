import { z } from "zod";

export const createTimeOffSchema = z.object({
  barberId: z.string().min(2),
  startAt: z.string().min(2),
  endAt: z.string().min(2),
  reason: z.string().trim().max(120),
});

export type CreateTimeOffPayload = z.infer<typeof createTimeOffSchema>;

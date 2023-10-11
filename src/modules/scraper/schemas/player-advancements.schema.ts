import { z } from 'zod';

export const playerAdvancementsSchema = z.record(
  z.string(),
  z.union([
    z.object({
      done: z.boolean(),
    }),
    z.number(),
  ]),
);

export type PlayerAdvancementsSchema = z.infer<typeof playerAdvancementsSchema>;

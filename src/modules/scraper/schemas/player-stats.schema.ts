import { z } from 'zod';

export const playerStatsSchema = z.object({
  stats: z.record(z.string(), z.record(z.string(), z.number().int())),
});

export type PlayerStatsSchema = z.infer<typeof playerStatsSchema>;

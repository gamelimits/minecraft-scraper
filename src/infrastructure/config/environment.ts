import 'dotenv/config';
import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
});

type EnvironmentSchema = z.infer<typeof environmentSchema>;

export const environment: EnvironmentSchema = {
  ...environmentSchema.parse(process.env),
} as const;

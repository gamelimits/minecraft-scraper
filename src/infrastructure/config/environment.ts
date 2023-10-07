import 'dotenv/config';
import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),

  // Minecraft
  MINECRAFT_WORLD_FOLDER: z.string(),

  // Gamelimits backend reporting
  BACKEND_URL: z.string().url(),
  BACKEND_KEY: z.string(),
});

type EnvironmentSchema = z.infer<typeof environmentSchema>;

export const environment: EnvironmentSchema = {
  ...environmentSchema.parse(process.env),
} as const;

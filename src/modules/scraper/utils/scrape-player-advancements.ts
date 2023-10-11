import { readFile } from 'fs/promises';
import { environment } from '../../../infrastructure/config/environment.js';
import { playerAdvancementsSchema } from '../schemas/player-advancements.schema.js';
import { logger } from '../../../infrastructure/logger/logger.js';
import { PlayerAdvancement } from '../interfaces/player-advancement.js';

const memoryCache = new Set<string>();

export const scrapePlayerAdvancements = async (id: string) => {
  const file = await readFile(`${environment.MINECRAFT_WORLD_FOLDER}/advancements/${id}.json`, 'utf-8');
  const payload = playerAdvancementsSchema.parse(JSON.parse(file));

  const advancements = Object.entries(payload)
    .filter(([, data]) => typeof data === 'object' && data.done)
    .map<PlayerAdvancement>(([advancement]) => ({
      minecraftId: id,
      advancement,
    }));

  const cacheFilter = advancements.filter((advancement) => {
    const key = `${advancement.minecraftId}.${advancement.advancement}`;

    if (memoryCache.has(key)) {
      return false;
    }

    memoryCache.add(key);

    return true;
  });

  cacheFilter.forEach((advancements) => {
    logger.info(`Added advancement for ${id}: ${advancements.advancement}`);
  });

  return cacheFilter;
};

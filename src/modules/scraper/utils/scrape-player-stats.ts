import { readFile } from 'fs/promises';
import { environment } from '../../../infrastructure/config/environment.js';
import { playerStatsSchema } from '../schemas/player-stats.schema.js';
import { PlayerStat } from '../interfaces/player-stat.js';
import { logger } from '../../../infrastructure/logger/logger.js';

const memoryCache = new Map<string, number>();

export const scrapePlayerStats = async (id: string) => {
  const file = await readFile(`${environment.MINECRAFT_WORLD_FOLDER}/stats/${id}.json`, 'utf-8');
  const payload = playerStatsSchema.parse(JSON.parse(file));

  const stats = Object.entries(payload.stats).reduce<PlayerStat[]>((accumulator, [category, items]) => {
    accumulator.push(
      ...Object.entries(items).map(([stat, value]) => ({
        minecraftId: id,
        category,
        stat,
        value,
      })),
    );

    return accumulator;
  }, []);

  // Skip unchanged values
  const cacheFilter = stats.filter((stat) => {
    const key = `${stat.minecraftId}.${stat.category}.${stat.stat}`;

    if (memoryCache.get(key) === stat.value) {
      return false;
    }

    memoryCache.set(key, stat.value);

    return true;
  });

  cacheFilter.forEach((stat) => {
    logger.info(`Updated stat for ${id} (${stat.category}.${stat.stat}: ${stat.value})`);
  });

  return cacheFilter;
};

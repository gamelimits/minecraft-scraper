import { environment } from '../../../infrastructure/config/environment.js';
import { logger } from '../../../infrastructure/logger/logger.js';
import { findPlayerIds } from '../utils/find-player-ids.js';
import { scrapePlayerAdvancements } from '../utils/scrape-player-advancements.js';
import { scrapePlayerStats } from '../utils/scrape-player-stats.js';

export const processUseCase = async () => {
  const players = await findPlayerIds();

  const stats = await Promise.all(players.map(async (player) => await scrapePlayerStats(player)));
  const advancements = await Promise.all(players.map(async (player) => await scrapePlayerAdvancements(player)));
  const flattenStats = stats.flatMap((stats) => stats);
  const flattenAdvancements = advancements.flatMap((advancements) => advancements);

  if (flattenStats.length === 0 && flattenAdvancements.length === 0) {
    return;
  }

  const response = await fetch(environment.BACKEND_URL, {
    method: 'POST',
    headers: {
      'x-api-key': environment.BACKEND_KEY,
    },
    body: JSON.stringify({
      players,
      stats: flattenStats,
      advancements: flattenAdvancements,
    }),
  });

  logger.info(
    `Pushed ${flattenStats.length} stat updates, ${flattenAdvancements.length} advancements (response: ${response.status})`,
  );
};

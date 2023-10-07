import { environment } from '../../../infrastructure/config/environment.js';
import { logger } from '../../../infrastructure/logger/logger.js';
import { findPlayerIds } from '../utils/find-player-ids.js';
import { scrapePlayerStats } from '../utils/scrape-player-stats.js';

export const processUseCase = async () => {
  const players = await findPlayerIds();

  const stats = await Promise.all(players.map(async (player) => await scrapePlayerStats(player)));
  const flattenStats = stats.flatMap((stats) => stats);

  if (flattenStats.length === 0) {
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
    }),
  });

  logger.info(`Pushed ${flattenStats.length} stat updates (response: ${response.status})`);
};

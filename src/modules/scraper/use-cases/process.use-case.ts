import { environment } from '../../../infrastructure/config/environment.js';
import { findPlayerIds } from '../utils/find-player-ids.js';
import { scrapePlayerStats } from '../utils/scrape-player-stats.js';

export const processUseCase = async () => {
  const players = await findPlayerIds();

  const stats = await Promise.all(players.map(async (player) => await scrapePlayerStats(player)));
  const flattenStats = stats.flatMap((stats) => stats);

  if (flattenStats.length === 0) {
    return;
  }

  await fetch(environment.BACKEND_URL, {
    method: 'POST',
    headers: {
      'x-api-key': environment.BACKEND_KEY,
    },
    body: JSON.stringify({ stats: flattenStats }),
  });
};

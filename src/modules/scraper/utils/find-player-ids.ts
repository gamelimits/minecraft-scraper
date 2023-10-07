import { readdir } from 'fs/promises';
import { environment } from '../../../infrastructure/config/environment.js';

export const findPlayerIds = async () => {
  const files = await readdir(`${environment.MINECRAFT_WORLD_FOLDER}/playerdata`);

  return files
    .filter((file) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}\.dat$/.test(file))
    .map((file) => file.slice(0, -4));
};

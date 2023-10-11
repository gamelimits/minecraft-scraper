import { CronJob } from 'cron';
import { RegisterModule } from '../../common/types/register-module.js';
import { processUseCase } from './use-cases/process.use-case.js';

export const registerScraperModule: RegisterModule = () => {
  // Crons
  new CronJob(
    '* * * * * *',
    () => {
      void processUseCase();
    },
    null,
    true,
    'Europe/Amsterdam',
    undefined,
    true,
  );
};

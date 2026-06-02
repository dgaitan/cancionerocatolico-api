import { createApp } from './app';
import { config } from './config/index';
import { logger } from './lib/logger';
import { startWorkers } from './workers/index';

const app = createApp();

startWorkers();

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
});

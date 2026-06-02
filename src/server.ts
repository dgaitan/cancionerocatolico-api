import { createApp } from './app';
import { config } from './config/index';
import { logger } from './lib/logger';

const app = createApp();

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
});

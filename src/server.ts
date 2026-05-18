/* eslint-disable import/first */
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { env } from './config/env';
import logger from './shared/logger';

app.listen(env.SERVER_PORT, () => {
  logger.info(`Server running on port ${env.SERVER_PORT}`, {
    env: env.NODE_ENV,
    port: env.SERVER_PORT,
  });
});

import { createLogger, format, transports } from 'winston';
import { env } from '../config/env';

const logger = createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
  ),
  defaultMeta: { service: 'order-service' },
  transports: [new transports.Console()],
});

export default logger;

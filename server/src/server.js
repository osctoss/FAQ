import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';
import logger from './utils/logger.js';

const start = async () => {
  try {
    await connectDB();
    logger.info(`MongoDB connected`);

    app.listen(config.PORT, () => {
      logger.info(`Server running on port ${config.PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
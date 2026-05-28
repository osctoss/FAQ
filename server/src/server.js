import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';

const start = async () => {
  try {
    await connectDB();
    console.info('[INFO] MongoDB connected');

    app.listen(config.PORT, () => {
      console.info(`[INFO] Server running on port ${config.PORT}`);
      console.info(`[INFO] Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('[ERROR] Failed to start server:', err);
    process.exit(1);
  }
};

start();
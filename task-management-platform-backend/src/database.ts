import { Logger } from 'winston';
import { config } from '@backend/config';
import { winstonLogger } from '@backend/logger';
import mongoose from 'mongoose';

const log: Logger = winstonLogger('backendDatabase', 'debug');

export const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(config.MONGO_URI!);
    log.info('Backend MongoDB database connection has been established successfully.');
  } catch (error) {
    log.error('Backend Service - Unable to connect to database.');
    log.log('error', 'BackendService databaseConnection() method error:', error);
  }
};

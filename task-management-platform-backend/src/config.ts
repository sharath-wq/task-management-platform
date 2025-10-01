import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.dev' });
} else {
  dotenv.config();
}

if (process.env.ENABLE_APM === '1') {
  require('elastic-apm-node').start({
    serviceName: 'jobber-auth',
    serverUrl: process.env.ELASTIC_APM_SERVER_URL,
    secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
    environment: process.env.NODE_ENV,
    active: true,
    captureBody: 'all',
    errorOnAbortedRequests: true,
    captureErrorLogStackTraces: 'always'
  });
}

class Config {
  public NODE_ENV: string | undefined;
  public JWT_TOKEN: string | undefined;
  public MONGO_URI: string | undefined;
  public CLIENT_URL: string | undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.JWT_TOKEN = process.env.JWT_TOKEN || '';
    this.MONGO_URI = process.env.MONGO_URI || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
  }
}

export const config: Config = new Config();

import { config as loadEnv } from 'dotenv';
loadEnv();

const appName = 'Techinnover';

export const config = {
  appName: appName,
  environment: process.env.NODE_ENV,
  web: {
    port: process.env.PORT || 3000,
  },
  mysql: {
    connection: {
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT) || 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      debug: process.env.DATABASE_DEBUG || false,
    },
    pool: {
      min: process.env.DATABASE_POOL_MIN ? Number(process.env.DATABASE_POOL_MIN) : 2,
      max: process.env.DATABASE_POOL_MAX ? Number(process.env.DATABASE_POOL_MAX) : 2,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRY,
  },
};

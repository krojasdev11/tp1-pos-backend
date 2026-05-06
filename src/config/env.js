import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databasePath: process.env.DATABASE_PATH ?? './data/pos.sqlite',
  jwtSecret: process.env.JWT_SECRET ?? 'change-this-secret-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX ?? 100)
};

if (env.nodeEnv === 'production' && env.jwtSecret === 'change-this-secret-in-production') {
  throw new Error('JWT_SECRET must be configured in production.');
}

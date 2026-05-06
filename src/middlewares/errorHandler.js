import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { env } from '../config/env.js';

mkdirSync('logs', { recursive: true });

export function notFound(_req, _res, next) {
  const error = new Error('Route not found.');
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, req, res, _next) {
  const statusCode = error.statusCode ?? 500;
  const payload = {
    error: {
      message: statusCode === 500 ? 'Internal server error.' : error.message
    }
  };

  if (error.details) {
    payload.error.details = error.details;
  }

  const logLine = JSON.stringify({
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message: error.message,
    stack: env.nodeEnv === 'production' ? undefined : error.stack
  });

  appendFileSync(join('logs', 'error.log'), `${logLine}\n`);
  console.error(logLine);

  res.status(statusCode).json(payload);
}

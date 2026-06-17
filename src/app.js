import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from './db/database.js';
import { env } from './config/env.js';
import { initializeSchema } from './db/schema.js';
import { sanitizeRequest } from './middlewares/sanitizeRequest.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { authRouter } from './routes/authRoutes.js';
import { productRouter } from './routes/productRoutes.js';
import { saleRouter } from './routes/saleRoutes.js';

initializeSchema();

export const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '..', 'public');

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '20kb' }));
app.use(requestLogger);
app.use(rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.rateLimitMax,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: {
      message: 'Too many requests, please try again later.'
    }
  }
}));
app.use(sanitizeRequest);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({ message: 'OK' });
});

app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/sales', saleRouter);

app.get('/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
});

app.use(notFound);
app.use(errorHandler);

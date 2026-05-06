import { createWriteStream, mkdirSync } from 'node:fs';
import morgan from 'morgan';

mkdirSync('logs', { recursive: true });

const accessLogStream = createWriteStream('logs/access.log', { flags: 'a' });

export const requestLogger = [
  morgan('combined', { stream: accessLogStream }),
  morgan('dev')
];

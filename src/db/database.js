import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import Database from 'better-sqlite3';
import { env } from '../config/env.js';

const databaseFile = resolve(env.databasePath);
mkdirSync(dirname(databaseFile), { recursive: true });

export const db = new Database(databaseFile);

// PRAGMAs
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');

// Transacciones
export function runInTransaction(callback) {
  const transaction = db.transaction(callback);
  return transaction();
}

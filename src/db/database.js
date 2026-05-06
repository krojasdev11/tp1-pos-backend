import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { env } from '../config/env.js';

const databaseFile = resolve(env.databasePath);
mkdirSync(dirname(databaseFile), { recursive: true });

export const db = new DatabaseSync(databaseFile);

db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');

export function runInTransaction(callback) {
  db.exec('BEGIN IMMEDIATE TRANSACTION;');

  try {
    const result = callback();
    db.exec('COMMIT;');
    return result;
  } catch (error) {
    db.exec('ROLLBACK;');
    throw error;
  }
}

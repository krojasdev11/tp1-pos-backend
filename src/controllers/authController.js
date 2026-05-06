import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';

function findUserByUsername(username) {
  return db.prepare(`
    SELECT id, username, password, role
    FROM users
    WHERE username = ?
  `).get(username);
}

export async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const user = findUserByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpError(401, 'Invalid credentials.');
    }

    const token = jwt.sign(
      { role: user.role },
      env.jwtSecret,
      {
        subject: String(user.id),
        expiresIn: env.jwtExpiresIn
      }
    );

    res.json({
      token,
      token_type: 'Bearer',
      expires_in: env.jwtExpiresIn,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
}
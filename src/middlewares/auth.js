import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';

export function authenticate(req, _res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Missing bearer token.'));
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = {
      id: Number(payload.sub),
      role: payload.role
    };
    return next();
  } catch {
    return next(new HttpError(401, 'Invalid or expired token.'));
  }
}

export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new HttpError(401, 'Authentication is required.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new HttpError(403, 'Insufficient permissions.'));
    }

    return next();
  };
}

import { validationResult } from 'express-validator';
import { HttpError } from '../utils/httpError.js';

export function validate(req, _res, next) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  return next(new HttpError(400, 'Validation error.', result.array()));
}

import { sanitizeValue } from '../utils/sanitize.js';

function sanitizeObjectInPlace(target) {
  if (!target || typeof target !== 'object') {
    return;
  }

  for (const key of Object.keys(target)) {
    target[key] = sanitizeValue(target[key]);
  }
}

export function sanitizeRequest(req, _res, next) {
  sanitizeObjectInPlace(req.body);
  sanitizeObjectInPlace(req.query);
  sanitizeObjectInPlace(req.params);
  next();
}

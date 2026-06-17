import { getApiBaseUrl } from './config.js';
import { clearSession, getAuthToken } from './storage.js';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getAuthToken();

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers
  });

  if (response.status === 204) {
    return null;
  }

  const data = await readJson(response);

  if (!response.ok) {
    if (response.status === 401) {
      clearSession();
    }
    throw new ApiError(extractErrorMessage(data), response.status);
  }

  return data;
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function extractErrorMessage(data) {
  if (Array.isArray(data?.error?.details) && data.error.details.length > 0) {
    return data.error.details[0].msg || data.error.message || 'Solicitud invalida.';
  }

  return data?.error?.message || 'No se pudo completar la operacion.';
}

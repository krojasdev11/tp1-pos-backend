const SESSION_KEY = 'pos_session';

export function saveSession(session) {
  const safeSession = {
    token: session.token,
    user: {
      id: session.user.id,
      username: session.user.username,
      role: session.user.role
    }
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeSession));
}

export function getSession() {
  const storedSession = sessionStorage.getItem(SESSION_KEY);
  if (!storedSession) {
    return null;
  }

  try {
    const session = JSON.parse(storedSession);
    if (!session?.token || !session?.user?.role) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function getAuthToken() {
  return getSession()?.token || null;
}

type AuthInvalidatedListener = () => void;

let accessToken: string | null = null;
const authInvalidatedListeners = new Set<AuthInvalidatedListener>();

function getAccessToken() {
  return accessToken;
}

function setAccessToken(nextAccessToken: string) {
  accessToken = nextAccessToken;
}

function clearAccessToken() {
  accessToken = null;
}

function invalidateAuthSession() {
  clearAccessToken();
  authInvalidatedListeners.forEach((listener) => listener());
}

function subscribeToAuthInvalidation(listener: AuthInvalidatedListener) {
  authInvalidatedListeners.add(listener);
  return () => authInvalidatedListeners.delete(listener);
}

export {
  clearAccessToken,
  getAccessToken,
  invalidateAuthSession,
  setAccessToken,
  subscribeToAuthInvalidation,
};

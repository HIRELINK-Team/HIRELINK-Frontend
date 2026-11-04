import { refreshAccessToken } from "./auth";
import { invalidateAuthSession, setAccessToken } from "./accessToken";

let refreshPromise: Promise<string> | null = null;
let initializationPromise: Promise<boolean> | null = null;

function refreshSessionOnce() {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken()
      .then((response) => {
        setAccessToken(response.accessToken);
        return response.accessToken;
      })
      .catch((error: unknown) => {
        invalidateAuthSession();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

function initializeAuthSession() {
  if (!initializationPromise) {
    initializationPromise = refreshSessionOnce()
      .then(() => true)
      .catch(() => false);
  }

  return initializationPromise;
}

export { initializeAuthSession, refreshSessionOnce };

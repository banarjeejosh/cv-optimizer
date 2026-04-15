export const AUTH_COOKIE_NAME = "cv_optimizer_session";

async function hashValue(value: string): Promise<string> {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", encoded);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function getExpectedAuthToken(): Promise<string | null> {
  const password = process.env.APP_LOGIN_PASSWORD;

  if (!password) {
    return null;
  }

  return hashValue(password);
}

export async function createAuthToken(password: string): Promise<string> {
  return hashValue(password);
}

export async function isValidAuthToken(
  token: string | undefined,
): Promise<boolean> {
  const expectedToken = await getExpectedAuthToken();

  if (!expectedToken || !token) {
    return false;
  }

  return token === expectedToken;
}

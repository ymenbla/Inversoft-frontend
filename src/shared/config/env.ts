const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
const bypassLogin = process.env.EXPO_PUBLIC_BYPASS_LOGIN === "true";

if (!apiBaseUrl) {
  throw new Error(
    "Missing EXPO_PUBLIC_API_BASE_URL. Configure it in your .env file before starting the app."
  );
}

export const env = {
  apiBaseUrl,
  bypassLogin
} as const;

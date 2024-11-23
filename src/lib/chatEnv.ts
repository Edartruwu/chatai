const apiKey = process.env.CHAT_API_KEY;

if (!apiKey) {
  throw new Error(
    `API key is not set in environment variables detected: ${apiKey}`,
  );
}

export const CHAT_API_KEY: string = apiKey;

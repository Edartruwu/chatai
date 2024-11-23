const back_url = process.env.NEXT_PUBLIC_BACK_URL;

if (!back_url) {
  throw new Error("No backend URL found");
}

export const BASE_URL = `${back_url}${process.env.NODE_ENV === "production" ? "/api" : ""}`;

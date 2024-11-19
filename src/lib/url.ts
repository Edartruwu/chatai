const back_url = process.env.NEXT_PUBLIC_BACK_URL;

if (back_url === undefined || back_url === null) {
  throw new Error("No backend url found");
}

export const BASE_URL = back_url;

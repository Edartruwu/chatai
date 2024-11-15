import { BASE_URL } from "./url";

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  provider: string;
  providerId: string;
}

export async function getUser(): Promise<User | null> {
  console.log("Attempting to fetch user...");
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      credentials: "include",
    });
    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      JSON.stringify(Object.fromEntries(response.headers)),
    );

    const responseText = await response.text();
    console.log("Response body:", responseText);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch user: ${response.status} ${response.statusText}`,
      );
    }

    const user: User = JSON.parse(responseText);
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

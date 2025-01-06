"use server";

import { BASE_URL } from "@/lib/url";
import { getCookies } from "../requests";

const AUTH_SESSION_COOKIE = "auth_session";
const OAUTH_STATE_COOKIE = "oauth_state";

export async function deleteWhitelist(email: string) {
  const { authSession, oauthState } = await getCookies();
  const headers = {
    "Content-Type": "application/json",
    Cookie: `${AUTH_SESSION_COOKIE}=${authSession}; ${OAUTH_STATE_COOKIE}=${oauthState}`,
  };

  try {
    const response = await fetch(`${BASE_URL}/users/d/whitelist`, {
      method: "DELETE",
      headers: headers,
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { success: true, message: "Whitelist entry deleted successfully" };
  } catch (error) {
    console.error("Error deleting whitelist entry:", error);
    return { success: false, message: "Failed to delete whitelist entry" };
  }
}

import { BASE_URL } from "./url";
import { TokenManager } from "./tokenManager";

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  provider: string;
  providerId: string;
  role: "admin" | "linko-user";
  subscriptionType?: "free-tier" | "linko-plus" | "linko-vip";
}

export async function handleAuthCallback(): Promise<User | null> {
  try {
    // This function is now handled by the callback page component
    return null;
  } catch (error) {
    console.error("Auth callback error:", error);
    return null;
  }
}

export function isAuthenticated(): boolean {
  const token = TokenManager.getAccessToken();
  return !!token && !TokenManager.isTokenExpired();
}

export function getUserRole(): "admin" | "linko-user" | null {
  const token = TokenManager.getAccessToken();
  if (!token) return null;

  try {
    // Decode JWT token to get role info
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Handle both isAdmin and role fields
    if (payload.is_admin === true || payload.role === "admin") {
      return "admin";
    }

    if (payload.role === "linko-user" || (!payload.role && !payload.is_admin)) {
      return "linko-user";
    }

    return payload.role || "linko-user";
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export async function getUser(): Promise<User | null> {
  try {
    const accessToken = TokenManager.getAccessToken();
    if (!accessToken) return null;

    // Check if token is expired
    if (TokenManager.isTokenExpired()) {
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) {
        TokenManager.clearTokens();
        return null;
      }

      // Try to refresh token
      const refreshResponse = await fetch(`${BASE_URL}/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!refreshResponse.ok) {
        TokenManager.clearTokens();
        return null;
      }

      const refreshData = await refreshResponse.json();
      TokenManager.storeTokens({
        access_token: refreshData.access_token,
        refresh_token: refreshToken, // Keep the same refresh token
        expires_in: refreshData.expires_in,
        token_type: refreshData.token_type,
      });
    }

    const response = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${TokenManager.getAccessToken()}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        TokenManager.clearTokens();
      }
      return null;
    }

    const userData: User = await response.json();

    // Handle empty role field - default to linko-user if not admin
    if (!userData.role) {
      userData.role = userData.isAdmin ? "admin" : "linko-user";
    }

    // Set default subscription for linko users if not set
    if (userData.role === "linko-user" && !userData.subscriptionType) {
      userData.subscriptionType = "free-tier";
    }

    return userData;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    // Call logout endpoint (though JWT logout is mainly client-side)
    await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TokenManager.getAccessToken()}`,
      },
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear tokens regardless of server response
    TokenManager.clearTokens();
  }
}

export async function initiateGoogleAuth(): Promise<void> {
  window.location.href = `${BASE_URL}/login/google`;
}

// Rate limit information
export interface RateLimitInfo {
  user_type: "anonymous" | "authenticated" | "admin" | "unknown";
  subscription_tier?: string;
  daily_limit: number | "unlimited";
  upgrade_message?: string;
}

export async function getRateLimitInfo(): Promise<RateLimitInfo | null> {
  try {
    const accessToken = TokenManager.getAccessToken();
    const headers: HeadersInit = {};

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${BASE_URL}/chat/rate-limit-info`, {
      headers,
    });

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error("Error fetching rate limit info:", error);
    return null;
  }
}

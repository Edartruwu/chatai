"use client";

import { BASE_URL } from "@/lib/url";
import { TokenManager } from "@/lib/tokenManager";

interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = TokenManager.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${BASE_URL}/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      TokenManager.clearTokens();
      return null;
    }

    const data: RefreshTokenResponse = await response.json();

    // Update stored access token
    TokenManager.storeTokens({
      access_token: data.access_token,
      refresh_token: refreshToken,
      expires_in: data.expires_in,
      token_type: data.token_type,
    });

    return data.access_token;
  } catch (error) {
    console.error("Token refresh failed:", error);
    TokenManager.clearTokens();
    return null;
  }
}

async function getValidAccessToken(): Promise<string | null> {
  let accessToken = TokenManager.getAccessToken();

  if (!accessToken) return null;

  // Check if token is expired and refresh if needed
  if (TokenManager.isTokenExpired()) {
    accessToken = await refreshAccessToken();
  }

  return accessToken;
}

async function makeAuthenticatedRequest<TResponse, TBody = undefined>(
  method: string,
  endpoint: string,
  body?: TBody,
): Promise<TResponse> {
  const accessToken = await getValidAccessToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    if (response.status === 401) {
      // Token might be invalid, try to refresh
      const newToken = await refreshAccessToken();
      if (newToken) {
        headers.Authorization = `Bearer ${newToken}`;
        const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });

        if (!retryResponse.ok) {
          throw new Error(`HTTP error! status: ${retryResponse.status}`);
        }

        return await retryResponse.json();
      } else {
        // Refresh failed, redirect to login
        TokenManager.clearTokens();
        window.location.href = "/auth";
        throw new Error("Authentication failed");
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Error making ${method} request:`, error);
    throw error;
  }
}

export async function clientGET<TResponse>(
  endpoint: string,
): Promise<TResponse> {
  return makeAuthenticatedRequest<TResponse>("GET", endpoint);
}

export async function clientPOST<TResponse, TBody>(
  endpoint: string,
  body?: TBody,
): Promise<TResponse> {
  return makeAuthenticatedRequest<TResponse, TBody>("POST", endpoint, body);
}

export async function clientPUT<TResponse, TBody>(
  endpoint: string,
  body: TBody,
): Promise<TResponse> {
  return makeAuthenticatedRequest<TResponse, TBody>("PUT", endpoint, body);
}

export async function clientDelete<TResponse>(
  endpoint: string,
): Promise<TResponse> {
  return makeAuthenticatedRequest<TResponse>("DELETE", endpoint);
}

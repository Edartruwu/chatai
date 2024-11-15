"use server";

import { cookies } from "next/headers";
import { BASE_URL } from "@/lib/url";

const AUTH_SESSION_COOKIE = "auth_session";
const OAUTH_STATE_COOKIE = "oauth_state";

async function getCookies(): Promise<{
  authSession: string;
  oauthState: string;
}> {
  const cookieStore = await cookies();
  const authSession = cookieStore.get(AUTH_SESSION_COOKIE)?.value;
  const oauthState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;

  if (!authSession || !oauthState) {
    throw new Error("OAuth session or state missing");
  }

  return { authSession, oauthState };
}

async function makeRequest<TResponse, TBody = undefined>(
  method: string,
  endpoint: string,
  body?: TBody,
): Promise<TResponse> {
  const { authSession, oauthState } = await getCookies();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Cookie: `${AUTH_SESSION_COOKIE}=${authSession}; ${OAUTH_STATE_COOKIE}=${oauthState}`,
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);

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

export async function serverGET<TResponse>(
  endpoint: string,
): Promise<TResponse> {
  return makeRequest<TResponse>("GET", endpoint);
}

export async function serverPOST<TResponse, TBody>(
  endpoint: string,
  body?: TBody,
): Promise<TResponse> {
  return makeRequest<TResponse, TBody>("POST", endpoint, body);
}

export async function serverPUT<TResponse, TBody>(
  endpoint: string,
  body: TBody,
): Promise<TResponse> {
  return makeRequest<TResponse, TBody>("PUT", endpoint, body);
}

export async function serverDelete<TResponse>(
  endpoint: string,
): Promise<TResponse> {
  return makeRequest<TResponse>("DELETE", endpoint);
}

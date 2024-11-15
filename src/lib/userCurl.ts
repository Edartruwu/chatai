import { BASE_URL } from "./url";

type ErrorResponse = { error: string };

type GetUserResponse = Array<any>;
type PromoteUserRequest = { userID: string };
type PromoteUserResponse = {};
type BlacklistRequest = { email: string };
type BlacklistResponse = {};
type DeleteUserResponse = {};

// Base URL for the user API

// Helper function to handle API response
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody: ErrorResponse = await response.json();
    throw new Error(errorBody.error);
  }
  return response.json();
}

// GET /users
export async function getUsers(
  page: number = 1,
  pageSize: number = 10,
): Promise<GetUserResponse> {
  const url = new URL(`${BASE_URL}/users`);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("pageSize", pageSize.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
  });
  return handleResponse<GetUserResponse>(response);
}

// GET /users/not-admin
export async function getNotAdminUsers(
  page: number = 1,
  pageSize: number = 10,
): Promise<GetUserResponse> {
  const url = new URL(`${BASE_URL}/users/not-admin`);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("pageSize", pageSize.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
  });
  return handleResponse<GetUserResponse>(response);
}

// GET /users/admin
export async function getAdminUsers(
  page: number = 1,
  pageSize: number = 10,
): Promise<GetUserResponse> {
  const url = new URL(`${BASE_URL}/users/admin`);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("pageSize", pageSize.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
  });
  return handleResponse<GetUserResponse>(response);
}

// POST /users/promote-to-admin
export async function promoteUserToAdmin(
  request: PromoteUserRequest,
): Promise<PromoteUserResponse> {
  const response = await fetch(`${BASE_URL}/users/promote-to-admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    credentials: "include",
  });
  return handleResponse<PromoteUserResponse>(response);
}

// DELETE /users/:id
export async function deleteUser(userID: string): Promise<DeleteUserResponse> {
  const response = await fetch(`${BASE_URL}/users/${userID}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse<DeleteUserResponse>(response);
}

// GET /users/blacklist
export async function getBlacklist(): Promise<GetUserResponse> {
  const response = await fetch(`${BASE_URL}/users/blacklist`, {
    method: "GET",
    credentials: "include",
  });
  return handleResponse<GetUserResponse>(response);
}

// POST /users/blacklist
export async function addToBlacklist(
  request: BlacklistRequest,
): Promise<BlacklistResponse> {
  const response = await fetch(`${BASE_URL}/users/blacklist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    credentials: "include",
  });
  return handleResponse<BlacklistResponse>(response);
}

// DELETE /users/blacklist
export async function removeFromBlacklist(
  request: BlacklistRequest,
): Promise<BlacklistResponse> {
  const response = await fetch(`${BASE_URL}/users/blacklist`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    credentials: "include",
  });
  return handleResponse<BlacklistResponse>(response);
}

type LogoutResponse = { message: string };

export async function logout(): Promise<LogoutResponse> {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include", // Include cookies in the request
  });
  return handleResponse<LogoutResponse>(response);
}

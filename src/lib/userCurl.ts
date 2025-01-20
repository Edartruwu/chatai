import { BASE_URL } from "./url";

type ErrorResponse = { error: string };
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody: ErrorResponse = await response.json();
    throw new Error(errorBody.error);
  }
  return response.json();
}

type LogoutResponse = { message: string };

export async function logout(): Promise<LogoutResponse> {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  return handleResponse<LogoutResponse>(response);
}

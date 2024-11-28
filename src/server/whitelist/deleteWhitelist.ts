"use server";

import { serverDelete } from "../requests";

export async function deleteEmail(
  email: string,
): Promise<{ success: boolean; message: string }> {
  try {
    await serverDelete<void>(
      `/users/whitelist?email=${encodeURIComponent(email)}`,
    );
    return { success: true, message: "Email deleted successfully" };
  } catch (error) {
    console.error("Error deleting email:", error);
    return { success: false, message: "Failed to delete email" };
  }
}

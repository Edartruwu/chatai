"use client";
import { BASE_URL } from "@/lib/url";

export async function AddAdmin(userEmail: string): Promise<void> {
  const body = JSON.stringify({ email: userEmail });

  console.warn(body, "Request body for AddAdmin");

  try {
    const response = await fetch(`${BASE_URL}/users/whitelist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      credentials: "include",
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`Failed to add admin: ${JSON.stringify(errorDetails)}`);
    }

    console.info("Admin successfully added");
  } catch (error) {
    console.error("Error in AddAdmin:", error);
    throw new Error(`${JSON.stringify(error)}`);
  }
}

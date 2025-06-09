// src/server/getUser.ts
"use server";
import { User } from "@/lib/auth";
import { headers } from "next/headers";

export async function getServerUser(): Promise<User | null> {
  try {
    const headersList = await headers();

    // Try to get user info from middleware headers first
    const userId = headersList.get("x-user-id");
    const userEmail = headersList.get("x-user-email");
    const isAdmin = headersList.get("x-is-admin") === "true";
    const userRole = headersList.get("x-user-role");

    if (userId && userEmail) {
      const user: User = {
        id: userId,
        email: userEmail,
        isAdmin,
        provider: "google", // We know it's Google OAuth
        providerId: userId,
        role: (userRole || (isAdmin ? "admin" : "linko-user")) as
          | "admin"
          | "linko-user",
        subscriptionType: userRole === "linko-user" ? "free-tier" : undefined,
      };

      return user;
    }

    return null;
  } catch (error) {
    console.error("Error getting server user:", error);
    return null;
  }
}

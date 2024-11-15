"use server";
import { User } from "@/lib/auth";
import { serverGET } from "./requests";

export async function getServerUser(): Promise<User | null> {
  try {
    const user = await serverGET<User>("/users/me");
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

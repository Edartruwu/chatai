"use server";
import { serverGET } from "../requests";
export async function getWhitelist(): Promise<string[] | null> {
  try {
    const res = await serverGET<string[]>("/users/whitelist");
    return res;
  } catch (error) {
    throw new Error(`${JSON.stringify(error)}`);
  }
}

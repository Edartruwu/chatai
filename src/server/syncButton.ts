"use server";
import { serverPOST } from "./requests";
export async function syncKB() {
  await serverPOST("/sync-knowledge-base");
}

"use server";
import { serverPOST } from "./requests";
export async function syncKB() {
  const res = await serverPOST("/sync-knowledge-base");
  console.info(JSON.stringify(res));
}

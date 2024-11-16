"use server";

import { serverDelete } from "./requests";

export async function deleteObject(objectId: number): Promise<void> {
  try {
    const endpoint = `/objects/${objectId}`;
    const response = await serverDelete<{ message: string }>(endpoint);

    console.log(response.message);
  } catch (error) {
    console.error("Error deleting object:", error);
    throw error;
  }
}

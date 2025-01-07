"use server";

import { serverGET } from "./requests";

interface ExportDbRes {
  data: {
    download_url: string;
  };
}

export async function exportDatabase(): Promise<string> {
  try {
    const res = await serverGET<ExportDbRes>("/analytics/export");
    const fullUrl = res.data.download_url;
    const baseUrl = fullUrl.split("?")[0];
    return baseUrl;
  } catch (error) {
    throw new Error(`${JSON.stringify(error, null, 2)}`);
  }
}

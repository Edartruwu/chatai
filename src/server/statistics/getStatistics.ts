"use server";

import { serverGET } from "../requests";
import { StatisticCardProps } from "@/components/admin/statistics/numbers-row";

export async function getStatistics(
  startDate: string,
  endDate: string,
): Promise<StatisticCardProps[]> {
  let data: { data: StatisticCardProps[] };
  try {
    data = await serverGET(
      `/analytics?start_date=${startDate}&end_date=${endDate}`,
    );
    const returnData = data.data;
    return returnData;
  } catch (error) {
    throw new Error(`${JSON.stringify(error)}`);
  }
}

"use server";
import { ChartDataItem } from "@/components/admin/statistics/charts/monthtly";
import { serverGET } from "../requests";

interface DailyAnalyticsEntry {
  date: string;
  count: number;
}

interface AnalyticsResponse {
  data: DailyAnalyticsEntry[];
}

export async function getChartBarData(
  startDate: string,
  endDate: string,
): Promise<ChartDataItem[]> {
  try {
    const [daily, interactions] = await Promise.allSettled([
      serverGET<AnalyticsResponse>(
        `/analytics/daily/users?start_date=${startDate}&end_date=${endDate}`,
      ),
      serverGET<AnalyticsResponse>(
        `/analytics/daily/interactions?start_date=${startDate}&end_date=${endDate}`,
      ),
    ]);

    const usersData = daily.status === "fulfilled" ? daily.value.data : [];
    const interactionsData =
      interactions.status === "fulfilled" ? interactions.value.data : [];

    const dataMap: Record<string, { requests: number; uniqueUsers: number }> =
      {};

    usersData.forEach((entry: { date: string; count: number }) => {
      const date = entry.date.split("T")[0];
      dataMap[date] = {
        requests: 0,
        uniqueUsers: entry.count,
      };
    });

    interactionsData.forEach((entry: { date: string; count: number }) => {
      const date = entry.date.split("T")[0];
      if (!dataMap[date]) {
        dataMap[date] = {
          requests: entry.count,
          uniqueUsers: 0,
        };
      } else {
        dataMap[date].requests = entry.count;
      }
    });

    const res: ChartDataItem[] = Object.entries(dataMap).map(
      ([date, { requests, uniqueUsers }]) => ({
        date,
        requests,
        uniqueUsers,
      }),
    );

    return res;
  } catch (error) {
    throw new Error(`${JSON.stringify(error, null, 2)}`);
  }
}

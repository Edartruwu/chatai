"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getStatistics } from "@/server/statistics/getStatistics";

export interface StatisticCardProps {
  title: string;
  description: string;
  statistic: number | string;
  prefix?: string;
  suffix?: string;
}

function getStatistic(value: number | string): string {
  if (typeof value === "number") {
    return value.toLocaleString();
  }
  if (typeof value === "string") {
    return value;
  }
  throw new Error("Invalid value type");
}

function StatisticCard(props: StatisticCardProps): React.ReactElement {
  const { title, description, statistic, prefix, suffix } = props;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">
          {prefix && (
            <span className="text-muted-foreground mr-1">{prefix}</span>
          )}
          {getStatistic(statistic)}
          {suffix && (
            <span className="text-muted-foreground ml-1">{suffix}</span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}

interface StatisticsRowProps {
  initialStatistics?: StatisticCardProps[];
}

function StatisticsRow(props: StatisticsRowProps): React.ReactElement {
  const { initialStatistics } = props;
  const [statistics, setStatistics] = useState<StatisticCardProps[]>(
    initialStatistics || [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(!initialStatistics);

  useEffect(
    function fetchStatisticsEffect() {
      async function fetchStatistics(): Promise<void> {
        try {
          const now: Date = new Date();
          const startDate: string = new Date(
            now.getFullYear(),
            now.getMonth(),
            1,
          )
            .toISOString()
            .split("T")[0];
          const endDate: string = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
          )
            .toISOString()
            .split("T")[0];
          const data: StatisticCardProps[] = await getStatistics(
            startDate,
            endDate,
          );
          setStatistics(data);
        } catch (error) {
          console.error("Failed to fetch statistics:", error);
        } finally {
          setIsLoading(false);
        }
      }

      if (!initialStatistics) {
        fetchStatistics();
      }
    },
    [initialStatistics],
  );

  if (isLoading) {
    return <div>Loading statistics...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statistics.map(function renderStatisticCard(
        statistic: StatisticCardProps,
        index: number,
      ): React.ReactElement {
        return <StatisticCard key={index} {...statistic} />;
      })}
    </div>
  );
}

export { StatisticsRow };

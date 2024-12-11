"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useEffect, useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import { getChartBarData } from "@/server/statistics/getChartBarData";

export interface ChartDataItem {
  date: string;
  requests: number;
  uniqueUsers: number;
}

function MainBarChart({ locale }: { locale: string }) {
  const t = useTranslations("chartbar");
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const selectedMonth = localStorage.getItem("selectedMonth");
  useEffect(
    function () {
      if (selectedMonth) {
        fetchChartData(selectedMonth);
      }
    },
    [selectedMonth],
  );

  function fetchChartData(month: string): void {
    setIsLoading(true);
    setError(null);
    const startDate = `${currentYear}-${month}-01`;
    const endDate = new Date(currentYear, parseInt(month), 0)
      .toISOString()
      .split("T")[0];
    getChartBarData(startDate, endDate).then(function (data) {
      setChartData(data);
      setIsLoading(false);
    });
  }

  const chartConfig: ChartConfig = {
    views: {
      label: t("chatUsage"),
    },
    requests: {
      label: t("totalQueries"),
      color: "hsl(var(--chart-1))",
    },
    uniqueUsers: {
      label: t("activeUsers"),
      color: "hsl(var(--chart-2))",
    },
  };

  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("requests");

  const total: { requests: number; uniqueUsers: number } = useMemo(
    function (): { requests: number; uniqueUsers: number } {
      return {
        requests: chartData.reduce(function (
          acc: number,
          curr: ChartDataItem,
        ): number {
          return acc + curr.requests;
        }, 0),
        uniqueUsers: chartData.reduce(function (
          acc: number,
          curr: ChartDataItem,
        ): number {
          return acc + curr.uniqueUsers;
        }, 0),
      };
    },
    [chartData],
  );

  function getCorrectLocale(locale: string): string {
    switch (locale) {
      case "en":
        return "en-US";
      case "es":
        return "es-ES";
      default:
        return "en-US";
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>{t("cardTitle")}</CardTitle>
            <CardDescription>{t("cardDescription")}</CardDescription>
          </div>
          <div className="flex">
            {(["requests", "uniqueUsers"] as const).map(function (
              key: "requests" | "uniqueUsers",
            ): JSX.Element {
              return (
                <button
                  key={key}
                  data-active={activeChart === key}
                  className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                  onClick={function (): void {
                    setActiveChart(key);
                  }}
                >
                  <span className="text-xs text-muted-foreground">
                    {chartConfig[key].label}
                  </span>
                  <span className="text-lg font-bold leading-none sm:text-3xl">
                    {total[key].toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          {isLoading ? (
            <Skeleton className="h-[250px] w-full" />
          ) : error ? (
            <div className="flex h-[250px] items-center justify-center">
              <p>{error}</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex h-[250px] items-center justify-center">
              <p>No data yet</p>
            </div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={function (value: string): string {
                    const date: Date = new Date(value);
                    return date.toLocaleDateString(getCorrectLocale(locale), {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey="views"
                      labelFormatter={function (value: string): string {
                        return new Date(value).toLocaleDateString(
                          getCorrectLocale(locale),
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        );
                      }}
                    />
                  }
                />
                <Bar
                  dataKey={activeChart}
                  fill={`var(--color-${activeChart})`}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export { MainBarChart };

"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useMemo, useState } from "react";

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

export const description =
  "Un grafico de barras que representa visualmente el uso del chat";

export interface ChartDataItem {
  date: string;
  requests: number;
  uniqueUsers: number;
}

const chartConfig: ChartConfig = {
  views: {
    label: "Uso del chat:",
  },
  requests: {
    label: "Consultas totales",
    color: "hsl(var(--chart-1))",
  },
  uniqueUsers: {
    label: "Usuarios activos",
    color: "hsl(var(--chart-2))",
  },
};

function MainBarChart({ chartData }: { chartData: ChartDataItem[] }) {
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
    [],
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Uso del Chat - Grafico de barras</CardTitle>
          <CardDescription>
            Demuestra el uso total del chat del ultimo mes, dia a dia.
          </CardDescription>
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
                return date.toLocaleDateString("en-US", {
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
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export { MainBarChart };

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
import { S3_BASE_URL } from "@/components/chat/response";
import { Skeleton } from "@/components/ui/skeleton";

export interface StatisticCardProps {
  title: string;
  description: string;
  statistic: number | string;
  prefix?: string;
  suffix?: string;
}

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  "Interactions in Date Range": {
    es: "Interacciones en el Rango de Fechas",
  },
  "Most Consulted Data in Date Range": {
    es: "Dato Más Consultado en el Rango de Fechas",
  },
  "Users in Date Range": {
    es: "Usuarios en el Rango de Fechas",
  },
  "Total interactions between": {
    es: "Total de interacciones entre",
  },
  "Most consulted data between": {
    es: "Datos más consultados entre",
  },
  "Total new users between": {
    es: "Total de nuevos usuarios entre",
  },
  interactions: {
    es: "interacciones",
  },
  users: {
    es: "usuarios",
  },
  and: {
    es: "y",
  },
  "Loading statistics...": {
    es: "Cargando estadísticas...",
  },
};

function StatisticCardSkeleton(): React.ReactElement {
  return (
    <Card className="min-w-[285px] min-h-[240px]">
      <CardHeader className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-9 w-2/3" />
      </CardContent>
    </Card>
  );
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

function translateText(text: string, locale: string): string {
  if (locale === "es" && translations[text] && translations[text].es) {
    return translations[text].es;
  }
  return text;
}

function formatDateRange(
  startDate: string,
  endDate: string,
  locale: string,
): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateFormat: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return `${start.toLocaleDateString(locale, dateFormat)} ${translateText("and", locale)} ${end.toLocaleDateString(locale, dateFormat)}`;
}

function convertS3UrlToBaseUrl(s3Url: string | undefined): string {
  if (!s3Url) {
    throw new Error("S3 URL is required");
  }
  if (!s3Url.startsWith("s3://")) {
    throw new Error("Invalid S3 URL");
  }
  const path = s3Url.slice(14);
  const newUrl = `${S3_BASE_URL}${path}`;
  return newUrl;
}

function getFileNameFromS3Url(s3Url: string): string {
  const parts = s3Url.split("/");
  return parts[parts.length - 1];
}

function StatisticCard(
  props: StatisticCardProps & { locale: string },
): React.ReactElement {
  const { title, statistic, prefix, suffix, locale } = props;

  const translatedTitle = translateText(title, locale);
  const translatedSuffix = suffix ? translateText(suffix, locale) : "";

  let displayStatistic = getStatistic(statistic);
  let statisticLink: string | null = null;

  if (typeof statistic === "string" && statistic.startsWith("s3://")) {
    displayStatistic = getFileNameFromS3Url(statistic);
    statisticLink = convertS3UrlToBaseUrl(statistic);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {translatedTitle}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground"></CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">
          {prefix && (
            <span className="text-muted-foreground mr-1">{prefix}</span>
          )}
          {statisticLink ? (
            <a
              href={statisticLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-xs underline"
            >
              {displayStatistic}
            </a>
          ) : (
            displayStatistic
          )}
          {translatedSuffix && (
            <span className="text-muted-foreground ml-1">
              {translatedSuffix}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
}

interface StatisticsRowProps {
  initialStatistics?: StatisticCardProps[];
  locale: string;
}

function getSelectedMonth(): number {
  if (typeof window !== "undefined") {
    const selectedMonth = localStorage.getItem("selectedMonth");
    return (
      (selectedMonth ? parseInt(selectedMonth, 10) : new Date().getMonth()) - 1
    );
  }
  return new Date().getMonth();
}

function StatisticsRow(props: StatisticsRowProps): React.ReactElement {
  const { initialStatistics, locale } = props;
  const [statistics, setStatistics] = useState<StatisticCardProps[]>(
    initialStatistics || [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(!initialStatistics);

  useEffect(
    function fetchStatisticsEffect() {
      async function fetchStatistics(): Promise<void> {
        try {
          const selectedMonth: number = getSelectedMonth();
          const year: number = new Date().getFullYear();
          const startDate: string = new Date(year, selectedMonth, 1)
            .toISOString()
            .split("T")[0];
          const endDate: string = new Date(year, selectedMonth + 1, 0)
            .toISOString()
            .split("T")[0];
          const data: StatisticCardProps[] = await getStatistics(
            startDate,
            endDate,
          );

          const updatedData = data.map((stat) => ({
            ...stat,
            description: translateText(
              stat.description.replace(
                /between \d{4}-\d{2}-\d{2} and \d{4}-\d{2}-\d{2}/,
                `between ${formatDateRange(startDate, endDate, locale)}`,
              ),
              locale,
            ),
          }));

          setStatistics(updatedData);
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
    [initialStatistics, locale],
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(3)].map((_, index) => (
          <StatisticCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statistics.map(function renderStatisticCard(
        statistic: StatisticCardProps,
        index: number,
      ): React.ReactElement {
        return <StatisticCard key={index} {...statistic} locale={locale} />;
      })}
    </div>
  );
}

export { StatisticsRow };

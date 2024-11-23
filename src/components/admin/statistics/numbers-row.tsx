import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

function StatisticCard(props: StatisticCardProps) {
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
  statistics: StatisticCardProps[];
}

function StatisticsRow(props: StatisticsRowProps) {
  const { statistics } = props;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statistics.map((statistic, index) => (
        <StatisticCard key={index} {...statistic} />
      ))}
    </div>
  );
}

export { StatisticsRow };

import { AdminLayout } from "@/components/admin/AdminSidebar";
import {
  ChartDataItem,
  MainBarChart,
} from "@/components/admin/statistics/charts/monthtly";
import {
  StatisticCardProps,
  StatisticsRow,
} from "@/components/admin/statistics/numbers-row";
import { getServerUser } from "@/server/getUser";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getServerUser();
  if (!user) {
    redirect("/auth");
  }
  if (user.isAdmin === true) {
    const fakeStatistics: StatisticCardProps[] = [
      {
        title: "Consultas totales",
        description: "Numero de consultas realizadas por los usuarios",
        statistic: 12435,
        prefix: "",
        suffix: "",
      },
      {
        title: "Fuente de dato más consultada",
        description: "la fuente de dato más consultada",
        statistic: "La investigación fairwork",
        prefix: "",
        suffix: "",
      },
      {
        title: "Cantidad de usuarios",
        description: "Cantidad de usuarios activos",
        statistic: 894,
        prefix: "",
        suffix: " usuarios",
      },
    ];

    const chartData: ChartDataItem[] = [
      { date: "2024-04-01", requests: 222, uniqueUsers: 150 },
      { date: "2024-04-02", requests: 97, uniqueUsers: 80 },
      { date: "2024-04-03", requests: 130, uniqueUsers: 90 },
      { date: "2024-04-04", requests: 180, uniqueUsers: 120 },
      { date: "2024-04-05", requests: 210, uniqueUsers: 140 },
      { date: "2024-04-06", requests: 300, uniqueUsers: 200 },
      { date: "2024-04-07", requests: 400, uniqueUsers: 260 },
      { date: "2024-04-08", requests: 150, uniqueUsers: 110 },
      { date: "2024-04-09", requests: 120, uniqueUsers: 90 },
      { date: "2024-04-10", requests: 170, uniqueUsers: 130 },
      { date: "2024-04-11", requests: 200, uniqueUsers: 140 },
      { date: "2024-04-12", requests: 250, uniqueUsers: 190 },
      { date: "2024-04-13", requests: 350, uniqueUsers: 240 },
      { date: "2024-04-14", requests: 380, uniqueUsers: 260 },
      { date: "2024-04-15", requests: 190, uniqueUsers: 130 },
      { date: "2024-04-16", requests: 180, uniqueUsers: 140 },
      { date: "2024-04-17", requests: 200, uniqueUsers: 150 },
      { date: "2024-04-18", requests: 220, uniqueUsers: 160 },
      { date: "2024-04-19", requests: 260, uniqueUsers: 180 },
      { date: "2024-04-20", requests: 320, uniqueUsers: 220 },
      { date: "2024-04-21", requests: 400, uniqueUsers: 280 },
      { date: "2024-04-22", requests: 210, uniqueUsers: 150 },
      { date: "2024-04-23", requests: 180, uniqueUsers: 140 },
      { date: "2024-04-24", requests: 200, uniqueUsers: 160 },
      { date: "2024-04-25", requests: 230, uniqueUsers: 180 },
      { date: "2024-04-26", requests: 270, uniqueUsers: 200 },
      { date: "2024-04-27", requests: 340, uniqueUsers: 250 },
      { date: "2024-04-28", requests: 390, uniqueUsers: 280 },
      { date: "2024-04-29", requests: 210, uniqueUsers: 160 },
      { date: "2024-04-30", requests: 250, uniqueUsers: 190 },
    ];

    return (
      <AdminLayout userData={{ email: user.email }}>
        <section
          id="container"
          className="flex flex-col items-start justify-start gap-4 min-h-full min-w-full px-5"
        >
          <StatisticsRow statistics={fakeStatistics} />
          <MainBarChart chartData={chartData} />
        </section>
      </AdminLayout>
    );
  } else return null;
}

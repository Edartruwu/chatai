import { AdminLayout } from "@/components/admin/AdminSidebar";
import { MainBarChart } from "@/components/admin/statistics/charts/monthtly";
import { StatisticsRow } from "@/components/admin/statistics/numbers-row";
import { getServerUser } from "@/server/getUser";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { MonthSelector } from "@/components/admin/statistics/monthSelector";

export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getServerUser();
  if (!user) {
    redirect("/auth");
  }
  if (user.isAdmin === true) {
    const locale = await getLocale();
    return (
      <AdminLayout userData={{ email: user.email }}>
        <section
          id="container"
          className="flex flex-col items-start justify-start gap-4 min-h-full min-w-full px-5"
        >
          <MonthSelector locale={locale} />
          <StatisticsRow locale={locale} />
          <MainBarChart locale={locale} />
        </section>
      </AdminLayout>
    );
  } else return null;
}

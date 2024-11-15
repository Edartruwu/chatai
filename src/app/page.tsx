import { MainLayout } from "@/components/mainLayout";
import { getServerUser } from "@/server/getUser";
import { redirect } from "next/navigation";
export default async function Home() {
  const user = await getServerUser();
  if (!user) {
    redirect("/auth");
  }
  if (user.isAdmin) {
    redirect("/admin");
  }
  return <MainLayout>.</MainLayout>;
}

import { AdminLayout } from "@/components/admin/AdminSidebar";
import { getServerUser } from "@/server/getUser";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getServerUser();
  if (!user) {
    redirect("/auth");
  }

  if (user.isAdmin === true) {
    return (
      <AdminLayout userData={{ email: user.email }}>
        <section id="container" className="p-4">
          <section className="flex flex-col gap-2"></section>
        </section>
      </AdminLayout>
    );
  } else return null;
}

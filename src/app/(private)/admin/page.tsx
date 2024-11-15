import { AdminLayout } from "@/components/admin/AdminSidebar";
import { getServerUser } from "@/server/getUser";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getServerUser();
  if (!user) {
    redirect("/auth");
  }
  if (user.isAdmin === true) {
    return (
      <AdminLayout userData={{ email: user.email }}>
        <section></section>
      </AdminLayout>
    );
  } else return null;
}

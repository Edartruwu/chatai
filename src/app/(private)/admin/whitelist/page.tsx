import { AdminLayout } from "@/components/admin/AdminSidebar";
import { getServerUser } from "@/server/getUser";
import { redirect } from "next/navigation";
import { AddUserModal } from "@/components/admin/whitelist/addUser";

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
          <section className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <AddUserModal />
            </div>
            {/* Añadir tabla de whitelist */}
          </section>
        </section>
      </AdminLayout>
    );
  } else return null;
}

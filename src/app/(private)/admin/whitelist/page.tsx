import { AdminLayout } from "@/components/admin/AdminSidebar";
import { getServerUser } from "@/server/getUser";
import { redirect } from "next/navigation";
import { WhitelistManager } from "@/components/admin/whitelist/whitelistManager";
import { getWhitelist } from "@/server/whitelist/getWhitelist";
export const dynamic = "force-dynamic";

export default async function Page() {
  const user = await getServerUser();
  if (!user) {
    redirect("/auth");
  }

  if (user.isAdmin === true) {
    const whitelist = await getWhitelist();
    return (
      <AdminLayout userData={{ email: user.email }}>
        <section id="container" className="p-4">
          <section className="flex flex-col gap-2">
            <WhitelistManager initialWhitelist={whitelist!} />
          </section>
        </section>
      </AdminLayout>
    );
  } else return null;
}

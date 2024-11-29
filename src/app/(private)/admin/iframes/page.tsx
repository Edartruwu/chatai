import { AdminLayout } from "@/components/admin/AdminSidebar";
import { getServerUser } from "@/server/getUser";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";
export default async function Page() {
  const user = await getServerUser();
  if (!user) {
    redirect("/auth");
  }

  if (user.isAdmin === true) {
    return (
      <>
        <AdminLayout userData={{ email: user.email }}>
          <section id="container" className="p-4">
            <section className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="w-full">
                  <CardHeader className="flex flex-col items-center justify-center text-center">
                    <CardTitle className="text-xl md:text-2xl">
                      Iframe para computadora
                    </CardTitle>
                    <CardDescription className="text-sm md:text-base">
                      Esto es lo que verá tu usuario al integrar con el iframe
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <div className="w-full max-w-[480px] aspect-[480/650] relative">
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src="/chat"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </section>
        </AdminLayout>
      </>
    );
  } else return null;
}

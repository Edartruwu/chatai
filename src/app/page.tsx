import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUser();
  if (user) {
    if (user.role === "admin") {
      redirect("/admin");
    }
    if (user.role === "linko-user") {
      redirect("/user");
    }
  }
}

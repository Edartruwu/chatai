import { getLocale } from "next-intl/server";
import { Widget } from "@/components/integrations/widget";
export const dynamic = "force-static";

export default async function Page() {
  const locale = await getLocale();
  return (
    <>
      <Widget color="" locale={locale} />
    </>
  );
}

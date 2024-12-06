import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async function () {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = "es";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
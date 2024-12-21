import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
//import { HelpCircle } from "@/components/help-circle";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const baseUrl = "https://opd-api.inedge.tech";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  keywords: [
    // Español
    "empleo en plataformas digitales",
    "economía de plataformas Perú",
    "trabajo digno digital",
    "transformación laboral digital",
    "regulación de plataformas en Perú",
    "estudios sobre gig economy",
    "derechos laborales en plataformas",
    "análisis de empleo digital",
    "innovación en trabajo digital",
    "Fairwork Perú",
    "Observatorio de Plataformas Perú",
    "Linko zorrito investigador",
  ],
  title: {
    default: "Linko | Observatorio de Plataformas Perú",
    template: "%s | Linko - Observatorio de Plataformas",
  },
  openGraph: {
    description:
      "El Observatorio de Plataformas Perú, liderado por Linko, investiga las condiciones laborales en plataformas digitales y promueve soluciones para un trabajo más justo y digno en la economía digital.",
    images: ["https://odp-api.inedge.tech/linko.jpeg"],
  },
  description:
    "Linko, el zorrito investigador, representa al Observatorio de Plataformas Perú, un espacio de análisis y generación de datos sobre empleo digital en Perú, orientado a promover un trabajo justo y regulaciones efectivas.",
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}

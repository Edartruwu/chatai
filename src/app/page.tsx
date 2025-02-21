import { DemoWrapper } from "@/components/landing/demo";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { LinkoExplanation } from "@/components/landing/linkoExplanation";
import { Navbar } from "@/components/landing/navbar";
import { PricingSection } from "@/components/landing/pricing";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <>
      <Navbar />
      <main className="w-full flex flex-col items-center justify-center">
        <Hero />
        <LinkoExplanation />
        <PricingSection />
        <DemoWrapper />
        <Footer />
      </main>
    </>
  );
}

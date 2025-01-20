import { Navbar } from "@/components/landing/navbar";
export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <>
      <Navbar />
      <main></main>;
    </>
  );
}

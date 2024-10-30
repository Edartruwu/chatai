"use client";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/lib/curls";

export default function Page() {
  return (
    <Button
      onClick={function () {
        window.location.href = `http://localhost:3000/login/google`;
      }}
    >
      entra con google
    </Button>
  );
}

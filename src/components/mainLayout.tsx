import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <main
      className={cn(
        "flex flex-col items-center justify-center w-full px-0 md:px-6",
      )}
    >
      {children}
    </main>
  );
}

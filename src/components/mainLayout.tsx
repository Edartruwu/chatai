import { ReactNode } from "react";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-col items-center justify-center w-full px-6">
      {children}
    </main>
  );
}

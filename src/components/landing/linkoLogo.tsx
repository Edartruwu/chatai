import Image from "next/image";
import { cn } from "@/lib/utils";

export function LinkoLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/LinkoLogo.png"
      className={cn("object-contain" + " " + className)}
      alt=""
      fill
    />
  );
}

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT: number = 768;

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(function (): boolean {
    if (typeof window !== "undefined") {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    return false;
  });

  useEffect(function (): () => void {
    const mql: MediaQueryList = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
    );

    function onChange(event: MediaQueryListEvent): void {
      setIsMobile(event.matches);
    }

    mql.addEventListener("change", onChange);

    setIsMobile(mql.matches);

    return function cleanup(): void {
      mql.removeEventListener("change", onChange);
    };
  }, []);

  return isMobile;
}

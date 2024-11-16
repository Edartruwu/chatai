import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(
    window.matchMedia(query).matches,
  );

  useEffect(
    function () {
      const mediaQueryList: MediaQueryList = window.matchMedia(query);

      function updateMatches(event: MediaQueryListEvent): void {
        setMatches(event.matches);
      }

      mediaQueryList.addEventListener("change", updateMatches);

      return function cleanup(): void {
        mediaQueryList.removeEventListener("change", updateMatches);
      };
    },
    [query],
  );
  return matches;
}

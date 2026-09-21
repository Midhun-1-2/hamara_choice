import { useEffect, useState } from "react";

/** Subscribes to a media query so markup can branch, not just styling. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");

/*
  Phones and tablets. A coarse pointer cannot hover, so every effect that only
  exists to answer a cursor — panel tilt, blurred glows, the drifting set — is
  pure cost on these devices: layers to composite and frames to paint while the
  user is trying to scroll. Everything gated on this is decoration, never
  content, so switching it off changes nothing anyone can act on.
*/
export const useIsTouch = () => useMediaQuery("(pointer: coarse)");

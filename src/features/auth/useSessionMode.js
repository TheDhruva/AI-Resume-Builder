import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { isGuestMode } from "@/lib/guestStorage";

/**
 * Session mode: signed-in users take priority over guest.
 * Guest mode is local-only (no Convex writes).
 */
export function useSessionMode() {
  const { isLoaded, isSignedIn } = useUser();
  const [guest, setGuest] = useState(() => isGuestMode());

  useEffect(() => {
    const sync = () => setGuest(isGuestMode());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("arb-guest-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("arb-guest-change", sync);
    };
  }, []);

  const refreshGuest = useCallback(() => {
    setGuest(isGuestMode());
    window.dispatchEvent(new Event("arb-guest-change"));
  }, []);

  const mode = !isLoaded
    ? "loading"
    : isSignedIn
      ? "authenticated"
      : guest
        ? "guest"
        : "anonymous";

  return {
    mode,
    isLoaded,
    isSignedIn: Boolean(isSignedIn),
    isGuest: mode === "guest",
    canUseApp: mode === "authenticated" || mode === "guest",
    refreshGuest,
  };
}

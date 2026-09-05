import React, { useEffect, useState } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import Header from "@/features/home/Header.jsx";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { useSessionMode } from "@/features/auth/useSessionMode";
import GuestBanner from "@/features/auth/GuestBanner";
import MigrateGuestResumes from "@/features/auth/MigrateGuestResumes";

const AUTH_WAIT_MS = 8000;

function ConvexAuthStuck() {
  const { signOut } = useClerk();
  const { getToken } = useAuth();
  const [tokenError, setTokenError] = useState("");
  const convexUrl = (import.meta.env.VITE_CONVEX_URL || "").trim();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken({ template: "convex" });
        if (!cancelled && !token) {
          setTokenError(
            'Clerk returned no token for JWT template "convex". Create/enable it in the Clerk dashboard (name must be exactly convex).'
          );
        }
      } catch (err) {
        if (!cancelled) {
          setTokenError(
            err?.message ||
              'Failed to fetch JWT template "convex". In Clerk → JWT Templates (or Integrations → Convex), the name must be exactly convex.'
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--app-bg)] px-4">
      <div className="max-w-lg w-full rounded-xl border border-border bg-white p-6 sm:p-8 text-left">
        <h1 className="text-xl font-semibold text-foreground">
          Couldn’t connect to the backend
        </h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          You’re signed in with Clerk, but Convex never accepted the session
          token. This is a Clerk ↔ Convex JWT / env setup issue.
        </p>

        {tokenError && (
          <p className="mt-4 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-md p-3">
            {tokenError}
          </p>
        )}

        {convexUrl && (
          <p className="mt-3 text-xs text-muted-foreground break-all">
            Convex URL: <code>{convexUrl}</code>
          </p>
        )}

        <ol className="mt-4 text-sm text-foreground list-decimal pl-5 space-y-2">
          <li>
            Vercel <code>VITE_CONVEX_URL</code> must be{" "}
            <code>https://….convex.cloud</code> (never localhost), then{" "}
            <strong>Redeploy</strong>.
          </li>
          <li>
            Clerk → <strong>Configure → Integrations → Convex</strong> → enable
            for this instance (JWT template name <code>convex</code>,{" "}
            <code>aud: &quot;convex&quot;</code>).
          </li>
          <li>
            On the <strong>production</strong> Convex deployment:{" "}
            <code>
              npx convex env set CLERK_JWT_ISSUER_DOMAIN
              https://mighty-narwhal-24.clerk.accounts.dev --prod
            </code>
          </li>
          <li>
            Clerk → Domains: add your Vercel URL under allowed origins / redirect
            URLs.
          </li>
        </ol>

        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            onClick={() => window.location.reload()}
            className="min-h-[44px]"
          >
            Retry
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-[44px]"
            onClick={() => signOut({ redirectUrl: "/" })}
          >
            Sign out
          </Button>
          <Button asChild variant="ghost" className="min-h-[44px]">
            <Link to="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { mode, isLoaded, isGuest, isSignedIn } = useSessionMode();
  const { isAuthenticated } = useConvexAuth();
  const [waitedTooLong, setWaitedTooLong] = useState(false);

  // Timeout even while Convex stays in isLoading forever (common on bad prod env)
  useEffect(() => {
    if (!isSignedIn || isAuthenticated) {
      setWaitedTooLong(false);
      return;
    }
    const t = setTimeout(() => setWaitedTooLong(true), AUTH_WAIT_MS);
    return () => clearTimeout(t);
  }, [isSignedIn, isAuthenticated]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--app-bg)]">
        <p className="text-muted-foreground text-lg">Loading...</p>
      </div>
    );
  }

  if (mode === "anonymous") {
    return <Navigate to="/" replace />;
  }

  if (isSignedIn && !isAuthenticated) {
    if (waitedTooLong) {
      return <ConvexAuthStuck />;
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--app-bg)]">
        <p className="text-muted-foreground text-lg">
          Connecting secure session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-foreground font-sans">
      <div className="no-print print:hidden">
        <Header />
      </div>

      <main className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {isGuest && <GuestBanner />}
        {isSignedIn && <MigrateGuestResumes />}
        <Outlet />
      </main>

      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;

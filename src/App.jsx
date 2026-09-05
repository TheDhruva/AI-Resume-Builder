import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import Header from "@/features/home/Header.jsx";
import { Toaster } from "sonner";
import { useSessionMode } from "@/features/auth/useSessionMode";
import GuestBanner from "@/features/auth/GuestBanner";
import MigrateGuestResumes from "@/features/auth/MigrateGuestResumes";

function App() {
  const { mode, isLoaded, isGuest, isSignedIn } = useSessionMode();
  const { isLoading: convexAuthLoading, isAuthenticated } = useConvexAuth();

  if (!isLoaded || (isSignedIn && convexAuthLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--app-bg)]">
        <p className="text-muted-foreground text-lg">Loading...</p>
      </div>
    );
  }

  if (mode === "anonymous") {
    return <Navigate to="/" replace />;
  }

  // Signed-in: wait for Convex JWT before data screens
  if (isSignedIn && !isAuthenticated) {
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

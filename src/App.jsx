import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import "./App.css";

import { useUser } from "@clerk/clerk-react";
import Header from "@/features/home/Header.jsx";
import { Toaster } from "sonner";

function App() {
  const { isLoaded, isSignedIn } = useUser();

  // Wait until auth loads
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <p className="text-brand-muted text-lg">Loading...</p>
      </div>
    );
  }

  // Redirect if user is not signed in
  if (!isSignedIn) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans">

      {/* ---------- HEADER ---------- */}
      <div id="no-print">
        <Header />
      </div>

      {/* ---------- MAIN CONTENT ---------- */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* ---------- GLOBAL TOASTER ---------- */}
      <Toaster richColors position="top-right" />

    </div>
  );
}

export default App;

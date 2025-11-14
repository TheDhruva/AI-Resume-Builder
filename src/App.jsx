import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import "./App.css";

import { useUser } from "@clerk/clerk-react";
import Header from "@/components/custom/Header.jsx";
import { Toaster } from "sonner";

function App() {
  const [count, setCount] = useState(0);

  const { user, isLoaded, isSignedIn } = useUser();

  // Redirect if user is not signed in
  if (isLoaded && !isSignedIn) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return (
    <div className="min-h-screen">
      {/* ---------- NON-PRINT HEADER ---------- */}
      <div id="no-print">
        <Header />
      </div>

      {/* ---------- MAIN PAGE CONTENT ---------- */}
      <div className="pt-4">
        <Outlet />
      </div>

      {/* ---------- GLOBAL TOASTER ---------- */}
      <Toaster />
    </div>
  );
}

export default App;

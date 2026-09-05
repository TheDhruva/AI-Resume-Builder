import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/features/home/Header.jsx";
import { Toaster } from "sonner";

/** Public layout — landing + shared resume view (no auth required). */
function PublicLayout() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans">
      <div id="no-print">
        <Header />
      </div>
      <Outlet />
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default PublicLayout;

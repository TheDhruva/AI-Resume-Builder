import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import { Toaster } from "sonner";

import Home from "./features/home/Home.jsx";
import Header from "./features/home/Header.jsx";
import Dashboard from "./features/dashboard/Dashboard.jsx";
import EditResume from "./features/dashboard/EditResume.jsx";
import SignInPage from "./features/auth/SignInPage.jsx";
import ViewResume from "./features/dashboard/view/ViewResume.jsx";
import PublicResume from "./features/dashboard/view/PublicResume.jsx";

const CONVEX_URL = (import.meta.env.VITE_CONVEX_URL || "").trim();
const PUBLISHABLE_KEY = (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "").trim();

const convex = CONVEX_URL ? new ConvexReactClient(CONVEX_URL) : null;

function PublicLayout() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans">
      <div className="print:hidden">
        <Header />
      </div>
      <Outlet />
      <Toaster richColors position="top-right" />
    </div>
  );
}

const router = createBrowserRouter([
  { path: "/auth/sign-in", element: <SignInPage /> },
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/r/:id", element: <PublicResume /> },
    ],
  },
  {
    element: <App />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/dashboard/resume/:id", element: <EditResume /> },
      { path: "/dashboard/resume/:id/view", element: <ViewResume /> },
    ],
  },
]);

function EnvError({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg font-sans px-4">
      <div className="bg-white rounded-xl p-8 border border-brand-border text-center max-w-lg">
        <h1 className="text-2xl font-bold text-error">{title}</h1>
        <div className="text-brand-muted mt-3 text-sm leading-relaxed text-left">
          {children}
        </div>
      </div>
    </div>
  );
}

function Root() {
  if (!PUBLISHABLE_KEY) {
    return (
      <EnvError title="Missing Clerk key">
        <p>
          Set <code>VITE_CLERK_PUBLISHABLE_KEY</code> in Vercel /{" "}
          <code>.env.local</code>, then redeploy.
        </p>
      </EnvError>
    );
  }

  if (!convex) {
    return (
      <EnvError title="Missing Convex URL">
        <p>
          Set <code>VITE_CONVEX_URL</code> to your{" "}
          <strong>cloud</strong> deployment URL (not localhost), then redeploy.
        </p>
      </EnvError>
    );
  }

  // Detect common Vercel misconfig: localhost baked into the production build
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1" &&
    /localhost|127\.0\.0\.1/.test(CONVEX_URL)
  ) {
    return (
      <EnvError title="Wrong Convex URL for production">
        <p className="mb-2">
          This site is calling <code>{CONVEX_URL}</code>, which only works on
          your computer.
        </p>
        <p>
          In Vercel → Project → Settings → Environment Variables, set{" "}
          <code>VITE_CONVEX_URL</code> to your Convex{" "}
          <strong>production</strong> URL from the Convex dashboard, then{" "}
          <strong>Redeploy</strong>.
        </p>
      </EnvError>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ClerkConvexBridge convex={convex} />
    </ClerkProvider>
  );
}

/** Remount Convex auth when Clerk session changes so tokens re-bind cleanly. */
function ClerkConvexBridge({ convex }) {
  const { sessionId } = useAuth();
  return (
    <ConvexProviderWithClerk
      key={sessionId ?? "signed-out"}
      client={convex}
      useAuth={useAuth}
    >
      <RouterProvider router={router} />
    </ConvexProviderWithClerk>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);

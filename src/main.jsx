import { StrictMode, useCallback } from "react";
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

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
const PUBLISHABLE_KEY = (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "").trim();

/** Clerk JWT template name for Convex — must match dashboard template name. */
const CLERK_JWT_TEMPLATE =
  (import.meta.env.VITE_CLERK_JWT_TEMPLATE || "convex").trim();

function useAuthWithConvexJwt() {
  const auth = useAuth();
  const getToken = useCallback(
    async (options) => {
      return auth.getToken({
        ...options,
        template: options?.template || CLERK_JWT_TEMPLATE,
      });
    },
    [auth]
  );

  return {
    ...auth,
    getToken,
  };
}

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

function EnvError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg font-sans px-4">
      <div className="bg-white rounded-xl p-8 border border-brand-border text-center max-w-lg">
        <h1 className="text-2xl font-bold text-error">
          Missing Environment Variable
        </h1>
        <p className="text-brand-muted mt-3">
          Add <b>VITE_CLERK_PUBLISHABLE_KEY</b> to your <code>.env.local</code>
        </p>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <ConvexProviderWithClerk client={convex} useAuth={useAuthWithConvexJwt}>
          <RouterProvider router={router} />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    ) : (
      <EnvError />
    )}
  </StrictMode>
);

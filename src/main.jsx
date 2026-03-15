import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";

// Clerk Auth
import { ClerkProvider } from "@clerk/clerk-react";

// Convex Backend
import { ConvexProvider, ConvexReactClient } from "convex/react";

// Router
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Pages
import Home from "./features/home/Home.jsx";
import Dashboard from "./features/dashboard/Dashboard.jsx";
import EditResume from "./features/dashboard/EditResume.jsx";
import SignInPage from "./features/auth/SignInPage.jsx";
import ViewResume from "./features/dashboard/view/ViewResume.jsx";

// Convex Client
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Router
const router = createBrowserRouter([
  { path: "/auth/sign-in", element: <SignInPage /> },
  {
    element: <App />, // global layout wrapper for authenticated pages
    children: [
      { path: "/", element: <Home /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/dashboard/resume/:id", element: <EditResume /> },
      { path: "/dashboard/resume/:id/view", element: <ViewResume /> },
    ],
  },
]);

// Environment safety check
function EnvError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg font-sans">
      <div className="bg-white shadow-xl rounded-xl p-8 border border-brand-border text-center max-w-lg">
        <h1 className="text-2xl font-bold text-red-600">
          Missing Environment Variable
        </h1>

        <p className="text-brand-muted mt-3">
          Add <b>VITE_CLERK_PUBLISHABLE_KEY</b> to your <code>.env.local</code>
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Check the README for required environment variables.
        </p>
      </div>
    </div>
  );
}

// Render
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ConvexProvider client={convex}>
          <div className="min-h-screen bg-brand-bg font-sans text-brand-text">
            <RouterProvider router={router} />
          </div>
        </ConvexProvider>
      </ClerkProvider>
    ) : (
      <EnvError />
    )}
  </StrictMode>
);

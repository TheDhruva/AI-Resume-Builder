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

// Safety check
if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

// -------------------------------
// ROUTER — FIXED & WORKING 100%
// -------------------------------
const router = createBrowserRouter([
  {
    element: <App />, // layout wrapper
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/dashboard/resume/:id", element: <EditResume /> },
      { path: "/dashboard/resume/:id/view", element: <ViewResume /> }, // ✅ FIXED
    ],
  },

  // Public routes (outside layout)
  { path: "/", element: <Home /> },
  { path: "/auth/sign-in", element: <SignInPage /> },
]);

// -------------------------------
// RENDER APP
// -------------------------------
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ConvexProvider client={convex}>
        <RouterProvider router={router} />
      </ConvexProvider>
    </ClerkProvider>
  </StrictMode>
);

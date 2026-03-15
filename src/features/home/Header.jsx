import React from "react";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";

function Header() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-border">
      
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* ---------- LOGO ---------- */}
        <Link to="/" className="flex items-center">
          <img
            src="/Logo.svg"
            alt="AI Resume Builder"
            className="h-9 w-auto cursor-pointer hover:opacity-90 transition-opacity"
          />
        </Link>

        {/* ---------- RIGHT SIDE ---------- */}
        <div className="flex items-center gap-4">

          {isSignedIn ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline">
                  Dashboard
                </Button>
              </Link>

              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <Link to="/auth/sign-in">
              <Button>
                Sign In
              </Button>
            </Link>
          )}

        </div>

      </div>

    </header>
  );
}

export default Header;

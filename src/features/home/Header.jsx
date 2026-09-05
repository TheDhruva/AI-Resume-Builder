import React from "react";
import { Button } from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useSessionMode } from "@/features/auth/useSessionMode";
import { startGuestSession } from "@/lib/guestStorage";

function Header() {
  const { isLoaded, isSignedIn } = useUser();
  const { isGuest } = useSessionMode();
  const navigate = useNavigate();

  if (!isLoaded) return null;

  const enterGuest = () => {
    startGuestSession();
    window.dispatchEvent(new Event("arb-guest-change"));
    navigate("/dashboard");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center min-w-0">
          <img
            src="/Logo.svg"
            alt="AI Resume Builder"
            className="h-8 sm:h-9 w-auto"
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {isSignedIn ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="min-h-[40px]">
                  Dashboard
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : isGuest ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="min-h-[40px]">
                  Dashboard
                </Button>
              </Link>
              <Link to="/auth/sign-in?mode=signup">
                <Button size="sm" className="min-h-[40px]">
                  Sign up
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="min-h-[40px] hidden sm:inline-flex"
                onClick={enterGuest}
              >
                Guest
              </Button>
              <Link to="/auth/sign-in">
                <Button size="sm" className="min-h-[40px]">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";

function Header() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null; // ✅ Prevents flash of wrong UI while Clerk loads

  return (
    <div className="p-3 px-5 flex justify-between shadow-md items-center">
      <img src="/Logo.svg" alt="Logo" width="100" height="100" />

      {isSignedIn ? (
        <div className="flex items-center gap-3">
          {/* ✅ Fixed path: no space, lowercase */}
          <Link to="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <UserButton />
        </div>
      ) : (
        <Link to="/auth/sign-in">
          <Button>Sign In</Button>
        </Link>
      )}
    </div>
  );
}

export default Header;

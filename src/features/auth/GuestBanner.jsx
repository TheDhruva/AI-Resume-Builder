import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

/** Soft prompt for guests to create an account (save/share/AI). */
export default function GuestBanner() {
  return (
    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <p className="text-sm text-amber-950">
        You&apos;re browsing as a guest. Work is saved on this device only.
        Sign in to sync, share a public link, and unlock AI.
      </p>
      <Link to="/auth/sign-in?mode=signup" className="shrink-0">
        <Button size="sm" className="min-h-[40px] w-full sm:w-auto">
          Sign up to save
        </Button>
      </Link>
    </div>
  );
}

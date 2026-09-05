import React from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { Link, useSearchParams } from "react-router-dom";
import Card from "@/components/layout/Card";

function SignInPage() {
  const [params] = useSearchParams();
  const isSignUp = params.get("mode") === "signup";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--app-bg)] px-4">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            AI Resume Builder
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            {isSignUp
              ? "Create an account to sync and share your resumes"
              : "Sign in to sync, share, and unlock AI"}
          </p>
        </div>

        {isSignUp ? (
          <SignUp
            routing="hash"
            forceRedirectUrl="/dashboard"
            fallbackRedirectUrl="/dashboard"
            signInUrl="/auth/sign-in"
          />
        ) : (
          <SignIn
            routing="hash"
            forceRedirectUrl="/dashboard"
            fallbackRedirectUrl="/dashboard"
            signUpUrl="/auth/sign-in?mode=signup"
          />
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          Prefer to explore first?{" "}
          <Link to="/" className="text-primary underline-offset-2 hover:underline">
            Continue as guest from the home page
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default SignInPage;

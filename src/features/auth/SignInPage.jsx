import React from "react";
import { SignIn } from "@clerk/clerk-react";

import Card from "@/components/layout/Card";

function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4">

      <Card className="w-full max-w-md p-8">

        {/* Header */}
        <div className="text-center mb-6">

          <h1 className="text-2xl font-bold tracking-tight text-brand-text">
            AI Resume Builder
          </h1>

          <p className="text-brand-muted mt-2">
            Sign in to build your professional resume
          </p>

        </div>

        {/* Clerk SignIn */}
        <SignIn />

      </Card>

    </div>
  );
}

export default SignInPage;

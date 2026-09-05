import { Edit, Share2, Target } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { startGuestSession } from "@/lib/guestStorage";

function Home() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const continueAsGuest = () => {
    try {
      startGuestSession();
      window.dispatchEvent(new Event("arb-guest-change"));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      window.alert(
        "Could not start guest mode. Check that cookies/storage are allowed in this browser, then try again."
      );
    }
  };

  const primaryCta = isSignedIn ? (
    <Button asChild size="lg" className="rounded-full min-h-[48px]">
      <Link to="/dashboard">Create My Resume</Link>
    </Button>
  ) : (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
      <Button asChild size="lg" className="rounded-full min-h-[48px]">
        <Link to="/auth/sign-in?mode=signup">Create My Resume</Link>
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="rounded-full min-h-[48px]"
        onClick={continueAsGuest}
      >
        Continue as guest
      </Button>
    </div>
  );

  return (
    <div className="text-foreground">
      <main className="max-w-5xl mx-auto px-1 sm:px-4">
        <section className="pt-8 sm:pt-16 pb-12 sm:pb-16 text-center">
          <p className="inline-flex items-center px-3 py-1 mb-5 text-xs font-medium bg-secondary text-foreground rounded-md border border-border">
            AI Resume Builder
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
            Build a resume tailored to the job you&apos;re applying for
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            Paste a job description, add your experience, and let AI optimize
            your resume for relevance, clarity, and ATS compatibility.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
            {primaryCta}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full min-h-[48px]"
            >
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-t border-border pt-12 sm:pt-14 pb-16"
        >
          <h2 className="text-2xl font-bold mb-2 text-center">How it works</h2>
          <p className="text-muted-foreground mb-10 text-center">
            From job description to a shareable, ATS-ready resume
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "Target the role",
                text: "Paste the job description. AI extracts skills, keywords, and requirements.",
              },
              {
                icon: Edit,
                title: "Build & improve",
                text: "Add experience and projects. Use AI to rewrite bullets and close skill gaps.",
              },
              {
                icon: Share2,
                title: "Score, export, share",
                text: "See a real ATS-oriented score, download an A4 PDF, and share a public link.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white border border-border rounded-lg p-6 text-left"
              >
                <item.icon className="h-7 w-7 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;

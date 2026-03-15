import { AtomIcon, Edit, Share2 } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Home() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">

      <main className="max-w-6xl mx-auto px-4 text-center">

        {/* ---------- HERO SECTION ---------- */}
        <section>

          <div className="inline-flex items-center px-4 py-1.5 mb-6 text-xs font-medium bg-brand-primary text-white rounded-full">
            Built by The Dhruva — AI Resume Tools
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Build Your Resume <span className="text-brand-primary">With AI</span>
          </h1>

          <p className="text-lg text-brand-muted max-w-2xl mx-auto mb-8">
            Create a sharp, professional resume in minutes — powered by AI,
            refined by you.
          </p>

          <Link to="/dashboard">
            <Button
              size="lg"
              className="rounded-full bg-brand-primary hover:bg-brand-hover text-white shadow-md"
            >
              Get Started
            </Button>
          </Link>

        </section>

        {/* ---------- HOW IT WORKS ---------- */}
        <section className="border-t border-brand-border pt-14 ">

          <h2 className="text-2xl font-bold mb-2">How It Works</h2>

          <p className="text-brand-muted mb-10">
            Create your resume in three simple steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {[
              {
                icon: AtomIcon,
                title: "Enter Details",
                text: "Add your experience, skills, and personal information.",
              },
              {
                icon: Edit,
                title: "Refine & Personalize",
                text: "Edit resume sections visually with AI assistance.",
              },
              {
                icon: Share2,
                title: "Export & Share",
                text: "Download your resume as a professional PDF instantly.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-brand-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
              >

                <item.icon className="h-7 w-7 text-brand-primary mx-auto mb-4" />

                <h3 className="font-semibold text-lg mb-1">
                  {item.title}
                </h3>

                <p className="text-sm text-brand-muted">
                  {item.text}
                </p>

              </div>
            ))}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Home;

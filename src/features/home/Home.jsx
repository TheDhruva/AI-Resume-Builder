import Header from "@/features/home/Header";
import { AtomIcon, Edit, Share2 } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />

      <main className="px-4 mx-auto max-w-5xl text-center">

        {/* Hero */}
        <section className="py-10">
          <div className="inline-flex items-center px-3 py-1.5 mb-5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
            Built by Anurag — AI Resume Tools
          </div>

          <h1 className="mb-3 text-3xl font-extrabold tracking-tight md:text-4xl">
            Build Your Resume <span className="text-primary">With AI</span>
          </h1>

          <p className="mb-6 text-sm text-muted-foreground max-w-2xl mx-auto">
            Create a sharp, professional resume in minutes — powered by AI, refined by you.
          </p>

          <Link
            to="/dashboard"
            className="inline-flex items-center px-7 py-3 text-sm font-semibold 
                rounded-full bg-foreground text-primary-foreground shadow-sm
                hover:bg-primary/90 active:scale-[0.98] transition"
          >
            Get Started
          </Link>
        </section>

        {/* Steps */}
        <section className="pb-3 pt-15">
          <h2 className="text-xl font-bold mb-1">How It Works</h2>
          <p className="text-sm text-muted-foreground">3 simple steps</p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { icon: AtomIcon, title: "Enter Details", text: "Add your experience & info." },
              { icon: Edit, title: "Refine & Personalize", text: "Edit sections visually." },
              { icon: Share2, title: "Export & Share", text: "Download PDF instantly." }
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border bg-card p-5 shadow-sm hover:shadow-md transition"
              >
                <item.icon className="h-6 w-6 mb-3 text-primary mx-auto" />
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

export default Home;

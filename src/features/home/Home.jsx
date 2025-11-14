import Header from "@/components/custom/Header";
import { AtomIcon, Edit, Share2 } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <Header />

      <main>
        {/* Hero Section */}
        <section className="z-50">
          <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
            <div
              className="inline-flex justify-between items-center py-1 px-4 mb-7 
              text-sm text-gray-700 bg-gray-100 rounded-full 
              dark:bg-gray-800 dark:text-white"
            >
              <span className="text-xs bg-primary rounded-full text-white px-4 py-1.5 mr-3">
                New
              </span>
              <span className="text-sm font-medium">
                Built by Anurag — AI Resume Tools
              </span>
            </div>

            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              Build Your Resume <span className="text-primary">With AI</span>
            </h1>

            <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
              Create a sharp, professional resume in minutes — powered by AI, refined by you.
            </p>

            <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <Link
                to="/dashboard"
                className="inline-flex justify-center items-center py-3 px-5 
                text-base font-medium text-center text-white rounded-lg 
                bg-primary hover:bg-primary/90 focus:ring-4 focus:ring-primary-300 
                dark:focus:ring-primary-900"
              >
                Get Started
                <svg
                  className="ml-2 -mr-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 
                    1 0 010 1.414l-6 6a1 1 0 
                    01-1.414-1.414L14.586 11H3a1 
                    1 0 110-2h11.586l-4.293-4.293a1 
                    1 0 010-1.414z"
                  />
                </svg>
              </Link>

              <a
                href="#"
                className="inline-flex justify-center items-center py-3 px-5 
                text-base font-medium text-center text-gray-900 rounded-lg 
                border border-gray-300 hover:bg-gray-100 focus:ring-4 
                focus:ring-gray-100 dark:text-white dark:border-gray-700 
                dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                <svg
                  className="mr-2 -ml-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 
                  012 2v8a2 2 0 01-2 2H4a2 2 
                  0 01-2-2V6zM14.553 7.106A1 1 
                  0 0014 8v4a1 1 0 00.553.894l2 
                  1A1 1 0 0018 13V7a1 1 0 
                  00-1.447-.894l-2 1z" />
                </svg>
                Demo Video Coming Soon
              </a>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-8 bg-white z-50 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
          <h2 className="font-bold text-3xl">How It Works</h2>
          <h2 className="text-md text-gray-500">
            Build your AI-powered resume in three simple steps
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition hover:border-primary/10 hover:shadow-primary/10">
              <AtomIcon className="h-8 w-8" />
              <h2 className="mt-4 text-xl font-bold text-black">
                Enter Your Details
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Provide your experience and background, the AI handles the structure.
              </p>
            </div>

            <div className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition hover:border-primary/10 hover:shadow-primary/10">
              <Edit className="h-8 w-8" />
              <h2 className="mt-4 text-xl font-bold text-black">
                Refine & Personalize
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Use the visual editor to tweak sections to match your style.
              </p>
            </div>

            <div className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition hover:border-primary/10 hover:shadow-primary/10">
              <Share2 className="h-8 w-8" />
              <h2 className="mt-4 text-xl font-bold text-black">
                Export & Share
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Download your resume as a crisp PDF or share it instantly.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/auth/sign-in"
              className="inline-block rounded bg-primary px-12 py-3 text-sm font-medium text-white transition hover:bg-primary/90 focus:outline-none focus:ring focus:ring-primary-400"
            >
              Start Now
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;

import React from "react";
import AddResume from "./AddResume";
import ResumeCardItem from "./ResumeCardItem";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

function Dashboard() {
  const { user, isLoaded } = useUser();

  // 🟡 Wait for Clerk to finish loading user info
  if (!isLoaded) return <p className="p-10">Loading user info...</p>;
  if (!user) return <p className="p-10">Please sign in to view your resumes.</p>;

  // ✅ Fetch resumes for the signed-in user
  const resumeList = useQuery(api.resumes.getAllResumes, {
    userId: user.id,
  });

  return (
    <div className="p-10 md:px-20 lg:px-32">
      <h2 className="font-bold text-3xl">My Resumes</h2>
      <p className="text-gray-600">
        Start creating an AI-powered resume for your next job role
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10">
        {/* Add Resume Button */}
        <AddResume />

        {/* ✅ Handle query state */}
        {resumeList === undefined ? (
          // Loading state
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[280px] rounded-lg bg-slate-200 animate-pulse"
            />
          ))
        ) : resumeList.length === 0 ? (
          // No data
          <p className="col-span-full text-gray-500 text-center">
            No resumes yet — create one!
          </p>
        ) : (
          // Data loaded
          resumeList.map((resume) => (
            <ResumeCardItem key={resume._id} resume={resume} />
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;

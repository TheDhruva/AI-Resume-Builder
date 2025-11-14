import React, { useState } from "react";
import AddResume from "./AddResume";
import ResumeCardItem from "./ResumeCardItem";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

function Dashboard() {
  const { user, isLoaded } = useUser();

  // 🔥 This forces React to re-render and re-trigger Convex query
  const [refreshUI, setRefreshUI] = useState(0);

  if (!isLoaded) return <p className="p-10">Loading user info...</p>;
  if (!user) return <p className="p-10">Please sign in.</p>;

  // 🔥 FIX: Do NOT send refreshKey to Convex
  const resumeList = useQuery(api.resumes.getAllResumes, {
    userId: user.id,
  });

  // 🔥 Function passed to Card → forces re-render → query re-runs
  const refreshData = () => setRefreshUI((prev) => prev + 1);

  return (
    <div className="p-10 md:px-20 lg:px-32" key={refreshUI}>
      <h2 className="font-bold text-3xl">My Resumes</h2>
      <p className="text-gray-600">Manage your AI-powered resumes.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10">
        <AddResume />

        {resumeList === undefined ? (
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[280px] rounded-lg bg-slate-200 animate-pulse"
            />
          ))
        ) : resumeList.length === 0 ? (
          <p className="col-span-full text-gray-500 text-center">
            No resumes yet — add one!
          </p>
        ) : (
          resumeList.map((resume) => (
            <ResumeCardItem
              key={resume._id}
              resume={resume}
              refreshData={refreshData}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;

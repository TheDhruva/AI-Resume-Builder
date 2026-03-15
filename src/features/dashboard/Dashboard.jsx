import React from "react";
import AddResume from "./AddResume";
import ResumeCardItem from "./ResumeCardItem";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

import PageContainer from "@/components/layout/PageContainer";
import SectionHeader from "@/components/layout/SectionHeader";

function Dashboard() {
  const { user, isLoaded } = useUser();

  const resumeList = useQuery(
    api.resumes.getAllResumes,
    user?.id ? { userId: user.id } : "skip"
  );

  if (!isLoaded) {
    return (
      <PageContainer>
        <div className="text-center py-20 text-brand-muted">
          Loading your dashboard...
        </div>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <div className="text-center py-20 text-brand-muted">
          Please sign in to view your resumes.
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionHeader
        title="My Resumes"
        subtitle="Manage your AI-generated resumes."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">

        {/* Add Resume Card */}
        <AddResume />

        {/* Loading Skeleton */}
        {resumeList === undefined &&
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[280px] rounded-xl border border-brand-border bg-white animate-pulse shadow-sm"
            />
          ))}

        {/* Empty State */}
        {resumeList && resumeList.length === 0 && (
          <div className="col-span-full text-center py-16">

            <h3 className="text-lg font-semibold mb-2">
              No resumes yet
            </h3>

            <p className="text-brand-muted">
              Create your first AI-powered resume to get started.
            </p>

          </div>
        )}

        {/* Resume Cards */}
        {resumeList &&
          resumeList.map((resume) => (
            <ResumeCardItem
              key={resume._id}
              resume={resume}
            />
          ))}

      </div>
    </PageContainer>
  );
}

export default Dashboard;

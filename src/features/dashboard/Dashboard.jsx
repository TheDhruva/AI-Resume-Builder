import React, { useMemo, useState } from "react";
import AddResume from "./AddResume";
import ResumeCardItem from "./ResumeCardItem";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import PageContainer from "@/components/layout/PageContainer";
import SectionHeader from "@/components/layout/SectionHeader";
import { useSessionMode } from "@/features/auth/useSessionMode";
import { listGuestResumes } from "@/lib/guestStorage";

function Dashboard() {
  const { isGuest, isSignedIn } = useSessionMode();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [guestTick, setGuestTick] = useState(0);

  const cloudList = useQuery(
    api.resumes.getAllResumes,
    isAuthenticated ? {} : "skip"
  );

  const guestList = useMemo(() => {
    if (!isGuest) return [];
    return listGuestResumes().map((r) => ({
      ...r,
      _id: `guest:${r.id}`,
      isGuest: true,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGuest, guestTick]);

  const refreshGuest = () => setGuestTick((n) => n + 1);

  if (isSignedIn && isLoading) {
    return (
      <PageContainer>
        <div className="text-center py-20 text-muted-foreground">
          Loading your dashboard...
        </div>
      </PageContainer>
    );
  }

  const resumeList = isGuest ? guestList : cloudList;

  return (
    <PageContainer>
      <SectionHeader
        title="My Resumes"
        subtitle={
          isGuest
            ? "Guest mode — saved on this device until you sign up."
            : "Create targeted resumes for each role you apply to."
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-8">
        <AddResume onGuestChange={refreshGuest} />

        {!isGuest && resumeList === undefined &&
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[240px] rounded-lg border border-border bg-white animate-pulse"
            />
          ))}

        {resumeList && resumeList.length === 0 && (
          <div className="col-span-full text-center py-12 border border-dashed border-border rounded-lg bg-white">
            <h3 className="text-lg font-semibold mb-2">No resumes yet</h3>
            <p className="text-muted-foreground text-sm">
              Create your first job-targeted resume to get started.
            </p>
          </div>
        )}

        {resumeList?.map((resume) => (
          <ResumeCardItem
            key={resume._id}
            resume={resume}
            isGuest={isGuest}
            onGuestChange={refreshGuest}
          />
        ))}
      </div>
    </PageContainer>
  );
}

export default Dashboard;

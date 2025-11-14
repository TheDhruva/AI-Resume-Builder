import React, { useState, useContext } from "react";
import { Button } from "@/components/ui/button";

import PersonalDetail from "./form/PersonalDetail";
import Summery from "./form/Summery";
import Experience from "./form/Experience";
import Education from "./form/Education";
import Skills from "./form/Skills";

import { ArrowRight, ArrowLeft, LayoutGrid } from "lucide-react";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";
import { useParams, Navigate } from "react-router-dom";

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(false);

  // Correct param name
  const { id } = useParams();

  const goNext = () => setActiveFormIndex((prev) => prev + 1);
  const goBack = () => setActiveFormIndex((prev) => prev - 1);

  return (
    <div className="p-5 shadow-md rounded-lg border border-gray-200">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <LayoutGrid size={16} /> Theme
        </Button>

        <div className="flex gap-2">
          {activeFormIndex > 1 && (
            <Button variant="outline" size="sm" onClick={goBack}>
              <ArrowLeft size={16} /> Back
            </Button>
          )}

          <Button
            size="sm"
            className="flex gap-2 items-center"
            onClick={goNext}
            disabled={activeFormIndex !== 6 && !enableNext}
          >
            Next <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      {/* Form Steps */}
      {activeFormIndex === 1 && <PersonalDetail enabledNext={setEnableNext} />}
      {activeFormIndex === 2 && <Summery enabledNext={setEnableNext} />}
      {activeFormIndex === 3 && <Experience enabledNext={setEnableNext} />}
      {activeFormIndex === 4 && <Education enabledNext={setEnableNext} />}
      {activeFormIndex === 5 && <Skills enabledNext={setEnableNext} />}

      {/* Step 6 → Redirect */}
      {activeFormIndex === 6 && (
        <Navigate to={`/dashboard/resume/${id}/view`} replace />
      )}
    </div>
  );
}

export default FormSection;

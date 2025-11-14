import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import PersonalDetail from "./form/PersonalDetail";
import Summery from "./form/Summery";
import Experience from "./form/Experience";
import Education from "./form/Education";
import Skills from "./form/Skills";

import { ArrowRight, ArrowLeft, LayoutGrid, Home } from "lucide-react";
import { useParams, Navigate, Link } from "react-router-dom";

import ThemeColor from "@/components/custom/ThemeColor"; // ✅ Ensure correct import path

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(false);

  const { id } = useParams(); // resume id

  const goNext = () => setActiveFormIndex((prev) => prev + 1);
  const goBack = () => setActiveFormIndex((prev) => prev - 1);

  return (
    <div className="p-5 shadow-md rounded-lg border border-gray-200">

      {/* Top Header Section */}
      <div className="flex justify-between items-center mb-4">

        {/* Back to Dashboard */}
        <div className="flex gap-5">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Home size={16} /> Dashboard
            </Button>
          </Link>
        </div>

        {/* Theme Color */}
        <ThemeColor />

        {/* Navigation Buttons */}
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

      {/* Redirect to View after step 6 */}
      {activeFormIndex === 6 && (
        <Navigate to={`/dashboard/resume/${id}/view`} replace />
      )}
    </div>
  );
}

export default FormSection;

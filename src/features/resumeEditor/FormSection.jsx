import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import PersonalDetail from "./form/PersonalDetail";
import Summery from "./form/Summery";
import Experience from "./form/Experience";
import Education from "./form/Education";
import Skills from "./form/Skills";

import { ArrowRight, ArrowLeft, Home } from "lucide-react";
import { useParams, Navigate, Link } from "react-router-dom";

import ThemeColor from "@/components/custom/ThemeColor";
import Card from "@/components/layout/Card";

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(false);

  const { id } = useParams();

  const MAX_STEP = 6;

  const goNext = () => {
    setActiveFormIndex((prev) => Math.min(prev + 1, MAX_STEP));
  };

  const goBack = () => {
    setActiveFormIndex((prev) => Math.max(prev - 1, 1));
  };

  // Reset next button when step changes
  useEffect(() => {
    setEnableNext(false);
  }, [activeFormIndex]);

  return (
    <Card className="p-6">

      {/* ---------- HEADER ---------- */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">

        {/* Dashboard Link */}
        <Link to="/dashboard">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Home size={16} />
            Dashboard
          </Button>
        </Link>

        {/* Step Indicator */}
        <p className="text-sm text-brand-muted">
          Step {activeFormIndex} of 5
        </p>

        {/* Theme Color Picker */}
        <ThemeColor />

        {/* Navigation */}
        <div className="flex gap-2">

          {activeFormIndex > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={goBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
          )}

          <Button
            size="sm"
            className="flex gap-2 items-center"
            onClick={goNext}
            disabled={activeFormIndex !== 5 && !enableNext}
          >
            Next
            <ArrowRight size={16} />
          </Button>

        </div>

      </div>

      {/* ---------- FORM STEPS ---------- */}

      {activeFormIndex === 1 && (
        <PersonalDetail enabledNext={setEnableNext} />
      )}

      {activeFormIndex === 2 && (
        <Summery enabledNext={setEnableNext} />
      )}

      {activeFormIndex === 3 && (
        <Experience enabledNext={setEnableNext} />
      )}

      {activeFormIndex === 4 && (
        <Education enabledNext={setEnableNext} />
      )}

      {activeFormIndex === 5 && (
        <Skills enabledNext={setEnableNext} />
      )}

      {/* ---------- REDIRECT ---------- */}
      {activeFormIndex === 6 && (
        <Navigate
          to={`/dashboard/resume/${id}/view`}
          replace
        />
      )}

    </Card>
  );
}

export default FormSection;

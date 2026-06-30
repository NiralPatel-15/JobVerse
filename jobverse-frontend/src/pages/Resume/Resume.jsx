import React from "react";
import StepWizard from "./StepWizard";


const Resume = () => {
  return (
    <div className="min-h-screen bg-gray-100 mt-16 px-5 xl:px-40">
      {/* HEADER */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-5">
        <h2 className="text-xl font-semibold">Resume Builder</h2>
      </div>

      {/* STEP WIZARD */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <StepWizard />
      </div>
    </div>
  );
};

export default Resume;

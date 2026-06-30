import React, { useState } from "react";
import { saveResumeAPI } from "../../../api/resume";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

const Review = ({ prev, data, template, accentColor }) => {
  const [loading, setLoading] = useState(false);

  // ✅ SAVE
  const handleSave = async () => {
    try {
      setLoading(true);

      const resumeData = {
        ...data,
        template,
        accentColor,
      };

      const res = await saveResumeAPI(resumeData);

      if (res.success) {
        toast.success("Resume saved successfully");
      } else {
        toast.error(res.message || "Failed to save resume");
      }

      console.log(res);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to save resume",
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ DOWNLOAD PDF
  const handleDownload = async () => {
    const element = document.getElementById("resume-preview");

    if (!element) {
      toast.error("Preview not found");
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    const fileName =
      `${data.personal_info?.first_name || ""} ${
        data.personal_info?.last_name || ""
      }`.trim() ||
      data.personal_info?.full_name ||
      "Resume";

    pdf.save(`${fileName}.pdf`);

    toast.success("PDF downloaded successfully");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Review & Save</h2>

      <div className="flex flex-wrap gap-3 mt-6">
        <button onClick={prev} className="px-4 py-2 bg-gray-300 rounded">
          Back
        </button>

        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          {loading ? "Saving..." : "Save Resume"}
        </button>

        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Review;
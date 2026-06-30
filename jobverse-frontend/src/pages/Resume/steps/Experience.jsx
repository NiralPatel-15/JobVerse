import React, { useState } from "react";
import { improveWithAI } from "../../../utils/ai";

const Experience = ({ next, prev, data, update }) => {
  const [loading, setLoading] = useState(false);

  const handleAI = async () => {
    const experience = data.experience?.[0];

    if (!experience?.description) return; // ✅ prevent empty call

    try {
      setLoading(true);

      const improved = await improveWithAI(
        experience.description,
        "experience",
      );

      const cleaned = improved
        .split("\n")
        .map((line) => line.replace(/^[-•*]\s*/, "").trim())
        .filter((line) => line.length > 0)
        .slice(0, 4) // ✅ limit to 4 lines (better)
        .join("\n");

      const updated = [...data.experience];

      updated[0].description = cleaned;

      update({
        experience: updated,
      });
    } catch (error) {
      console.error("Experience AI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Experience</h3>

      <textarea
        rows={6}
        className="input"
        value={data.experience?.[0]?.description || ""}
        onChange={(e) => {
          const updated = [...data.experience];
          updated[0].description = e.target.value;
          update({ experience: updated });
        }}
        placeholder="Describe your experience..."
      />

      <button
        onClick={handleAI}
        disabled={loading}
        className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg mb-4 w-full disabled:opacity-50"
      >
        {loading ? "Improving..." : "✨ Improve with AI"}
      </button>

      <div className="flex justify-between items-center border-b border-gray-100 pb-2">
        <button onClick={prev} className="text-gray-600">
          ← Back
        </button>

        <button onClick={next} className="btn-primary">
          Continue to Skills →
        </button>
      </div>
    </div>
  );
};

export default Experience;
import React, { useState } from "react";
import { improveWithAI } from "../../../utils/ai";

const Skills = ({ next, prev, data, update }) => {
  const [loading, setLoading] = useState(false);

  const handleAI = async () => {
    if (!data.skills) return; // ✅ prevent empty call

    try {
      setLoading(true);

      const improved = await improveWithAI(data.skills, "skills");

      // 🔥 HANDLE BOTH CASES (comma OR newline)
      let cleaned = improved;

      if (improved.includes(",")) {
        cleaned = improved
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 10)
          .join(", ");
      } else {
        cleaned = improved
          .split("\n")
          .map((s) => s.replace(/^[-•*]\s*/, "").trim())
          .filter(Boolean)
          .slice(0, 10)
          .join(", ");
      }

      update({ skills: cleaned });
    } catch (error) {
      console.error("Skills AI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Skills</h3>

      <textarea
        rows={4}
        className="input"
        value={data.skills}
        onChange={(e) => update({ skills: e.target.value })}
        placeholder="React, Node.js, MongoDB..."
      />

      <button
        onClick={handleAI}
        disabled={loading}
        className="btn-ai disabled:opacity-50"
      >
        {loading ? "Improving..." : "✨ Improve with AI"}
      </button>

      <div className="flex justify-between mt-4">
        <button onClick={prev}>← Back</button>

        <button onClick={next} className="btn-primary">
          Continue to Project →
        </button>
      </div>
    </div>
  );
};

export default Skills;

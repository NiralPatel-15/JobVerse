import { useState } from "react";
import axios from "../../../api/axiosConfig";

const InterviewFeedbackModal = ({ applicationId, onClose }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    interviewRound: "Technical",
    feedback: "",
    recommendation: "Hire",

    scores: {
      technicalSkills: 3,
      communication: 3,
      problemSolving: 3,
      culturalFit: 3,
      leadership: 3,
    },
  });

  const handleScoreChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [field]: Number(value),
      },
    }));
  };

  const submitFeedback = async () => {
    try {
      setLoading(true);

      await axios.post("/interviews/feedback", {
        applicationId,
        ...formData,
      });

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Interview Feedback
          </h2>

          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.keys(formData.scores).map((key) => (
            <div key={key}>
              <label className="text-sm text-zinc-400 capitalize">{key}</label>

              <input
                type="range"
                min="1"
                max="5"
                value={formData.scores[key]}
                onChange={(e) => handleScoreChange(key, e.target.value)}
                className="w-full"
              />

              <div className="text-white text-sm mt-1">
                Score: {formData.scores[key]}
              </div>
            </div>
          ))}
        </div>

        <textarea
          placeholder="Interview feedback..."
          value={formData.feedback}
          onChange={(e) =>
            setFormData({
              ...formData,
              feedback: e.target.value,
            })
          }
          className="w-full mt-6 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white min-h-[140px]"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 text-white"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={submitFeedback}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedbackModal;

import { useEffect, useState, useCallback } from "react";
import axios from "../../../api/axiosConfig";
import { toast } from "react-toastify";


const InterviewQuestionsPanel = ({ applicationId }) => {
  const [loading, setLoading] = useState(false);

  const [questions, setQuestions] = useState(null);

  const fetchQuestions = useCallback(async () => {
    if (!applicationId) return;

    try {
      setLoading(true);

      const response = await axios.get(`/interview-copilot/${applicationId}`);

      setQuestions(response.data.questions);
    } catch (error) {
      console.error("Interview questions fetch failed:", error);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);


  const copyQuestion = async (question) => {
    try {
      await navigator.clipboard.writeText(question);

      toast.success("Question copied to clipboard");
    } catch (error) {
      console.error("Copy failed:", error);

      toast.error("Failed to copy question");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
        Loading AI interview assistant...
      </div>
    );
  }

  if (!questions) return null;

  const QuestionSection = ({ title, items, color }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-bold ${color}`}>{title}</h3>

        <span className="text-xs text-gray-500">
          {items?.length || 0} Questions
        </span>
      </div>

      <div className="space-y-3">
        {items?.map((question, index) => (
          <div
            key={index}
            className="bg-gray-50 border border-gray-100 rounded-2xl p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {question}
              </p>

              <button
                onClick={() => copyQuestion(question)}
                className="px-3 py-1 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 whitespace-nowrap"
              >
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          AI Interview Assistant
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Enterprise interview preparation system
        </p>
      </div>

      {/* TECHNICAL */}
      <QuestionSection
        title="Technical Questions"
        items={questions.technicalQuestions}
        color="text-indigo-700"
      />

      {/* EXPERIENCE */}
      <QuestionSection
        title="Experience Questions"
        items={questions.experienceQuestions}
        color="text-blue-700"
      />

      {/* BEHAVIORAL */}
      <QuestionSection
        title="Behavioral Questions"
        items={questions.behavioralQuestions}
        color="text-green-700"
      />

      {/* WEAKNESS */}
      <QuestionSection
        title="Weakness Focus Questions"
        items={questions.weaknessQuestions}
        color="text-red-700"
      />
    </div>
  );
};

export default InterviewQuestionsPanel;

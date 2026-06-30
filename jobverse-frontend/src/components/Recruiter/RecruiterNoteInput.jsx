import { useState } from "react";
import axios from "../../api/axiosConfig";

const RecruiterNoteInput = ({ applicationId }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      setLoading(true);

      // ✅ GET TOKEN
      const token = localStorage.getItem("token");

      await axios.post(
        `/recruiter-notes/${applicationId}`,
        {
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setContent("");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-2xl p-4">
      <textarea
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add internal hiring notes..."
        className="w-full resize-none outline-none text-sm"
      />

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white px-5 py-2 rounded-xl text-sm hover:bg-gray-800 transition"
        >
          {loading ? "Saving..." : "Add Note"}
        </button>
      </div>
    </div>
  );
};

export default RecruiterNoteInput;

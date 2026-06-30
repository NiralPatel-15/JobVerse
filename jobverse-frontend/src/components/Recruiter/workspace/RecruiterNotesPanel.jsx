import { useEffect, useState, useCallback } from "react";
import axios from "../../../api/axiosConfig";

const RecruiterNotesPanel = ({ applicationId }) => {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================================
  // FETCH NOTES
  // =========================================

  const fetchNotes = useCallback(async () => {
    try {
      const res = await axios.get(`/recruiter-notes/${applicationId}`);

      setNotes(res.data.notes || []);
    } catch (err) {
      console.log(err);
    }
  }, [applicationId]);

  // =========================================
  // LOAD NOTES
  // =========================================

  useEffect(() => {
    if (applicationId) {
      fetchNotes();
    }
  }, [applicationId, fetchNotes]);

  // =========================================
  // ADD NOTE
  // =========================================

  const handleAddNote = async () => {
    if (!content.trim()) return;

    try {
      setLoading(true);

      await axios.post(`/recruiter-notes/${applicationId}`, {
        content,
      });

      setContent("");

      fetchNotes();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6">
      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Recruiter Notes</h2>

        <span className="text-sm text-gray-500">Internal Only</span>
      </div>

      {/* INPUT */}

      <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50">
        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add recruiter notes..."
          className="w-full bg-transparent resize-none outline-none text-sm text-gray-700"
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleAddNote}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-2 rounded-2xl text-sm font-medium"
          >
            {loading ? "Saving..." : "Add Note"}
          </button>
        </div>
      </div>

      {/* NOTES */}

      <div className="space-y-4 mt-6">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note._id}
              className="border border-gray-200 rounded-2xl p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={note.recruiter?.profilePic || "/user.png"}
                    alt={note.recruiter?.f_name}
                    className="
        w-10
        h-10
        rounded-full
        object-cover
      "
                  />

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {note.recruiter?.f_name || "Recruiter"}
                    </h3>

                    <p className="text-xs text-gray-400">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mt-3 whitespace-pre-wrap">
                {note.content}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No recruiter notes yet</p>

            <p className="text-xs text-gray-400 mt-1">
              Internal hiring notes will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterNotesPanel;

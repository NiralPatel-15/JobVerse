import { useEffect, useState, useCallback } from "react";
import axios from "../../api/axiosConfig";
import socket from "../../socket";

import RecruiterNoteInput from "./RecruiterNoteInput";
import RecruiterNoteCard from "./RecruiterNoteCard";

const RecruiterNotes = ({ applicationId }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH NOTES
  const fetchNotes = useCallback(async () => {
    try {
      // ✅ GET TOKEN
      const token = localStorage.getItem("token");

      const res = await axios.get(`/recruiter-notes/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotes(res.data.notes || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  // ✅ SOCKET + FETCH
  useEffect(() => {
    const initializeNotes = async () => {
      await fetchNotes();
    };

    initializeNotes();

    // ✅ JOIN ROOM
    socket.emit("joinApplicationNotes", applicationId);

    // ✅ REALTIME NOTE EVENT
    const handleNewNote = (newNote) => {
      setNotes((prev) => [newNote, ...prev]);
    };

    socket.on("recruiterNoteCreated", handleNewNote);

    return () => {
      socket.emit("leaveApplicationNotes", applicationId);

      socket.off("recruiterNoteCreated", handleNewNote);
    };
  }, [applicationId, fetchNotes]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mt-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-800">
          Internal Recruiter Notes
        </h2>

        <span className="text-sm text-gray-500">Recruiter Only</span>
      </div>

      {/* INPUT */}
      <RecruiterNoteInput applicationId={applicationId} />

      {/* NOTES */}
      <div className="space-y-4 mt-6">
        {loading ? (
          <div className="text-sm text-gray-500 text-center py-6">
            Loading notes...
          </div>
        ) : notes.length > 0 ? (
          notes.map((note) => <RecruiterNoteCard key={note._id} note={note} />)
        ) : (
          <div className="text-sm text-gray-500 text-center py-6">
            No recruiter notes yet
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterNotes;
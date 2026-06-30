import { useEffect, useState } from "react";

import axios from "../../api/axiosConfig";

import socket from "../../socket/socket";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [status, setStatus] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    socket.emit("join:user", userId);

    socket.on("resume:progress", (data) => {
      setProgress(data.progress);

      setStatus(data.message);

      if (data.progress === 100) {
        setUploading(false);
      }
    });

    return () => {
      socket.off("resume:progress");
    };
  }, []);

  const uploadResume = async () => {
    try {
      if (!file) return;

      setUploading(true);

      setProgress(0);

      const formData = new FormData();

      formData.append("resume", file);

      await axios.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error(error);

      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-xl bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-5">AI Resume Upload</h1>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-white"
        />

        <button
          onClick={uploadResume}
          disabled={uploading}
          className="mt-5 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white"
        >
          {uploading ? "Processing..." : "Upload Resume"}
        </button>

        {uploading && (
          <div className="mt-6">
            <div className="w-full bg-zinc-800 rounded-full h-4 overflow-hidden">
              <div
                className="bg-green-500 h-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <p className="text-zinc-300 mt-3">{status}</p>

            <p className="text-sm text-zinc-500 mt-1">{progress}% Completed</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
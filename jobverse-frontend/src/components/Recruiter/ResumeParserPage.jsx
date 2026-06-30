import { useState } from "react";

import axios from "../../api/axiosConfig";

const ResumeParserPage = () => {
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("resume", file);

      const response = await axios.post("/resume/parse", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
        <h1 className="text-2xl font-bold text-white mb-4">AI Resume Parser</h1>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4 text-white"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-xl text-white"
        >
          {loading ? "Parsing Resume..." : "Upload Resume"}
        </button>

        {result && (
          <div className="mt-6 bg-zinc-950 rounded-xl p-5">
            <h2 className="text-xl text-white font-semibold mb-4">
              Parsed Resume Data
            </h2>

            <pre className="text-green-400 text-sm overflow-auto">
              {JSON.stringify(result.parsedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeParserPage;

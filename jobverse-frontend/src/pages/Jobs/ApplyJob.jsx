import { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import axios from "../../api/axiosConfig";
import { toast } from "react-toastify";

const ApplyJob = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("userInfo"));

  if (!user || user.role !== "user") {
    return <Navigate to="/feeds" />;
  }

  const handleApply = async () => {
    if (!resume) {
      toast.error("Please upload resume PDF");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("jobId", id);

      formData.append("resume", resume);

      await axios.post("/applications/apply", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

toast.success("Application submitted successfully");

      navigate("/my-applications");
    } catch (err) {
      console.log(err);

    toast.error(err?.response?.data?.msg || "Application failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto mt-24 bg-white p-6 rounded-xl shadow">
      <h2 className="text-3xl font-bold mb-6">Apply For Job</h2>

      <label className="block mb-2 font-medium">Upload Resume (PDF)</label>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setResume(e.target.files[0])}
        className="w-full border p-3 rounded-lg mb-5"
      />

      <button
        onClick={handleApply}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </div>
  );
};

export default ApplyJob;
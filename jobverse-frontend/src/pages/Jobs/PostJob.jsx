import { useState } from "react";
import axios from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PostJob = () => {
  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    salary: "",
    experience: "",
    image: null,
    skills: "",
    jobType: "Full-Time",
    workMode: "Onsite",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.company || !formData.description) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", formData.title);
      data.append("company", formData.company);
      data.append("description", formData.description);
      data.append("location", formData.location);
      data.append("salary", formData.salary);
      data.append("experience", formData.experience);
      data.append("jobType", formData.jobType);
      data.append("workMode", formData.workMode);

      data.append(
        "skills",
        JSON.stringify(
          formData.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        ),
      );

      if (formData.image) {
        data.append("image", formData.image);
      }

      await axios.post("/job/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Job posted successfully");

      setTimeout(() => {
        navigate("/jobs");
      }, 1000);
    } catch (err) {
      console.error("POST JOB ERROR:", err);

      toast.error(err?.response?.data?.msg || "Error posting job");
    } finally {
      setLoading(false);
    }
  };

  const skillChips = formData.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f4f6f8] pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Create Job Posting
          </h1>

          <p className="text-gray-500 mt-2">
            Publish a new opportunity for candidates
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Information */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Job Information
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="title"
                  placeholder="Job Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <input
                  type="text"
                  name="salary"
                  placeholder="Salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <input
                  type="text"
                  name="experience"
                  placeholder="Experience Required"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                </select>

                <select
                  name="workMode"
                  value={formData.workMode}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option>Onsite</option>
                  <option>Remote</option>
                  <option>Hybrid</option>
                </select>

                <input
                  type="file"
                  accept="image/*"
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      image: e.target.files[0],
                    });

                    if (e.target.files[0]) {
                      setPreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Required Skills
              </h2>

              <input
                type="text"
                name="skills"
                placeholder="React, Node.js, MongoDB, Express"
                value={formData.skills}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              {skillChips.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {skillChips.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Job Description
              </h2>

              <textarea
                name="description"
                rows={10}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe responsibilities, requirements and benefits..."
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Publish Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
    w-full
    bg-indigo-600
    hover:bg-indigo-700
    disabled:opacity-50
    text-white
    py-4
    rounded-2xl
    font-semibold
    text-lg
    transition
  "
            >
              {loading ? "Publishing..." : "Publish Job"}
            </button>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <div className="sticky top-28 bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="h-52 bg-gray-100">
                <img
                  src={
                    preview ||
                    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
                  }
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {formData.title || "Job Title"}
                </h2>

                <p className="text-gray-500 mt-1">
                  {formData.company || "Company Name"}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                    {formData.jobType}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    {formData.workMode}
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-sm text-gray-600">
                  <p>📍 {formData.location || "Location"}</p>
                  <p>💰 {formData.salary || "Salary"}</p>
                  <p>🧑‍💻 {formData.experience || "Experience"}</p>
                </div>

                {skillChips.length > 0 && (
                  <>
                    <h3 className="font-semibold mt-6 mb-3">Required Skills</h3>

                    <div className="flex flex-wrap gap-2">
                      {skillChips.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                <div className="mt-6 border-t pt-4">
                  <p className="text-sm text-gray-600 line-clamp-6">
                    {formData.description ||
                      "Job description preview will appear here..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;

import React, { useState } from "react";
import { improveWithAI } from "../../../utils/ai";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition";

const PersonalInfo = ({ next, data, update }) => {
  const handleChange = (e) => {
    update({
      [e.target.name]: e.target.value,
    });
  };
  
  const [loading, setLoading] = useState(false);

  const handleSummaryAI = async () => {
    if (loading) return;
    if (!data.summary?.trim()) return;

    try {
      setLoading(true);

      const improved = await improveWithAI(data.summary, "summary");

      update({
        summary: improved,
      });
    } catch (error) {
      console.error("Summary AI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      update({
        image: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };
  

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Personal Information
        </h2>

        <p className="text-gray-500 mt-1">
          Add your personal and professional details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Photo
          </label>

          <div className="flex items-center gap-4">
            {/* Preview */}
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
              {data.image ? (
                <img
                  src={data.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>

            {/* Upload */}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-600
          file:mr-4
          file:rounded-lg
          file:border-0
          file:bg-indigo-600
          file:px-4
          file:py-2
          file:text-white
          hover:file:bg-indigo-700"
              />
              {data.image && (
                <p className="mt-2 text-xs text-green-600">
                  ✓ Profile photo uploaded successfully
                </p>
              )}
              {data.image && (
                <button
                  type="button"
                  onClick={() => update({ image: null })}
                  className="mt-3 inline-flex rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition"
                >
                  Remove Photo
                </button>
              )}

              <p className="mt-2 text-xs text-gray-500">
                JPG, PNG or WebP • Recommended 500×500 px
              </p>
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <input
            className={inputClass}
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="John Doe"
            autoComplete="name"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Professional Headline</label>
          <input
            className={inputClass}
            name="headline"
            value={data.headline}
            onChange={handleChange}
            placeholder="Full Stack Developer"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            className={inputClass}
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="john@gmail.com"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Phone</label>
          <input
            className={inputClass}
            type="tel"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            placeholder="+91 9876543210"
            maxLength={15}
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Address</label>
          <input
            className={inputClass}
            name="address"
            value={data.address}
            onChange={handleChange}
            placeholder="Street Address"
          />
        </div>

        <div>
          <label className="text-sm font-medium">City</label>
          <input
            className={inputClass}
            name="city"
            value={data.city}
            onChange={handleChange}
            placeholder="Ahmedabad"
          />
        </div>

        <div>
          <label className="text-sm font-medium">State</label>
          <input
            className={inputClass}
            name="state"
            value={data.state}
            onChange={handleChange}
            placeholder="Gujarat"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Country</label>
          <input
            className={inputClass}
            name="country"
            value={data.country}
            onChange={handleChange}
            placeholder="India"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Portfolio</label>
          <input
            className={inputClass}
            type="url"
            name="portfolio"
            value={data.portfolio}
            onChange={handleChange}
            placeholder="https://yourportfolio.com"
          />
        </div>

        <div>
          <label className="text-sm font-medium">LinkedIn</label>
          <input
            className={inputClass}
            type="url"
            name="linkedin"
            value={data.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div>
          <label className="text-sm font-medium">GitHub</label>
          <input
            className={inputClass}
            type="url"
            name="github"
            value={data.github}
            onChange={handleChange}
            placeholder="https://github.com/username"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Website</label>
          <input
            className={inputClass}
            type="url"
            name="website"
            value={data.website}
            onChange={handleChange}
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Professional Summary</label>

          <textarea
            rows={6}
            className={inputClass}
            name="summary"
            value={data.summary}
            onChange={handleChange}
            placeholder="Write a short professional summary..."
          />
        </div>

        <div className="md:col-span-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {(data.summary || "").length}/500 characters
            </span>

            <button
              type="button"
              onClick={handleSummaryAI}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              ✨ {loading ? "Improving..." : "Improve Summary"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t pt-6 flex justify-end">
        <button
          onClick={next}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-white font-semibold shadow-md transition-all duration-200 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5"
        >
          Continue to Education
          <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;

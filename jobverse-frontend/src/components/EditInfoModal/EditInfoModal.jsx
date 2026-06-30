import React, { useState } from "react";
import { toastError } from "../../utils/toast";

const EditInfoModal = ({ handleEditFunc, selfData, closeModal }) => {
  const isRecruiter = selfData?.role === "recruiter";

  const [data, setData] = useState({
    f_name: selfData?.f_name || "",
    headline: selfData?.headline || "",
    curr_company: selfData?.curr_company || "",
    curr_location: selfData?.curr_location || "",

    // Recruiter-only fields
    companyWebsite: selfData?.companyWebsite || "",
    companySize: selfData?.companySize || "",
    industry: selfData?.industry || "",
  });

  const [loading, setLoading] = useState(false);

  const onChangeHandle = (event, key) => {
    setData((prev) => ({
      ...prev,
      [key]: event.target.value,
    }));
  };

  const handleSaveBtn = async () => {
    if (!selfData) return;

    if (!data.f_name.trim()) {
      return toastError("Name is required");
    }

    if (!data.headline.trim()) {
      return toastError("Headline is required");
    }

    if (
      isRecruiter &&
      data.companyWebsite &&
      !/^https?:\/\/.+/i.test(data.companyWebsite)
    ) {
      return toastError("Company website must start with http:// or https://");
    }

    setLoading(true);

    try {
      const newData = {
        ...selfData,
        ...data,
      };

      await handleEditFunc(newData);

      closeModal();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 w-full">
      {/* FULL NAME */}
      <div className="w-full mb-4">
        <label className="text-sm font-medium">Full Name *</label>
        <input
          value={data.f_name}
          onChange={(e) => onChangeHandle(e, "f_name")}
          type="text"
          className="w-full mt-1 rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Full Name"
        />
      </div>

      {/* HEADLINE */}
      <div className="w-full mb-4">
        <label className="text-sm font-medium">Headline *</label>
        <textarea
          value={data.headline}
          onChange={(e) => onChangeHandle(e, "headline")}
          rows={3}
          className="w-full mt-1 rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Headline"
        />
      </div>

      {/* CURRENT COMPANY */}
      <div className="w-full mb-4">
        <label className="text-sm font-medium">
          {isRecruiter ? "Company Name" : "Current Company"}
        </label>
        <input
          value={data.curr_company}
          onChange={(e) => onChangeHandle(e, "curr_company")}
          type="text"
          className="w-full mt-1 rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={
            isRecruiter ? "Enter Company Name" : "Enter Current Company"
          }
        />
      </div>

      {/* CURRENT LOCATION */}
      <div className="w-full mb-4">
        <label className="text-sm font-medium">
          {isRecruiter ? "Company Location" : "Current Location"}
        </label>
        <input
          value={data.curr_location}
          onChange={(e) => onChangeHandle(e, "curr_location")}
          type="text"
          className="w-full mt-1 rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={
            isRecruiter ? "Enter Company Location" : "Enter Current Location"
          }
        />
      </div>

      {/* RECRUITER ONLY */}
      {isRecruiter && (
        <>
          {/* WEBSITE */}
          <div className="w-full mb-4">
            <label className="text-sm font-medium">Company Website</label>
            <input
              type="url"
              value={data.companyWebsite}
              onChange={(e) => onChangeHandle(e, "companyWebsite")}
              className="w-full mt-1 rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://company.com"
            />
          </div>

          {/* INDUSTRY */}
          <div className="w-full mb-4">
            <label className="text-sm font-medium">Industry</label>
            <input
              type="text"
              value={data.industry}
              onChange={(e) => onChangeHandle(e, "industry")}
              className="w-full mt-1 rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Software, Finance, Healthcare..."
            />
          </div>

          {/* COMPANY SIZE */}
          <div className="w-full mb-4">
            <label className="text-sm font-medium">Company Size</label>

            <select
              value={data.companySize}
              onChange={(e) => onChangeHandle(e, "companySize")}
              className="w-full mt-1 rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Company Size</option>
              <option value="1-10">1–10 Employees</option>
              <option value="11-50">11–50 Employees</option>
              <option value="51-200">51–200 Employees</option>
              <option value="201-500">201–500 Employees</option>
              <option value="501-1000">501–1000 Employees</option>
              <option value="1000+">1000+ Employees</option>
            </select>
          </div>
        </>
      )}

      {/* SAVE BUTTON */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSaveBtn}
          disabled={loading}
          className={`px-6 py-2 rounded-xl text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-900 hover:bg-blue-950"
          }`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default React.memo(EditInfoModal);

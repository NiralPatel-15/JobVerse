import React from "react";
import { Plus, Trash2 } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition";

const emptyEducation = {
  school: "",
  degree: "",
  fieldOfStudy: "",
  startDate: "",
  endDate: "",
  grade: "",
  description: "",
};

const Education = ({ next, prev, data, update }) => {
  const educations = data.education || [emptyEducation];

  const handleChange = (index, field, value) => {
    const updated = [...educations];
    updated[index][field] = value;

    update({
      education: updated,
    });
  };

  const addEducation = () => {
    update({
      education: [...educations, { ...emptyEducation }],
    });
  };

  const removeEducation = (index) => {
    if (educations.length === 1) return;

    update({
      education: educations.filter((_, i) => i !== index),
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Education</h2>
          <p className="text-gray-500">Add your educational qualifications.</p>
        </div>

        <button
          onClick={addEducation}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      <div className="space-y-6">
        {educations.map((edu, index) => (
          <div
            key={index}
            className="border rounded-xl p-5 bg-gray-50 shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Education #{index + 1}</h3>

              {educations.length > 1 && (
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">
                  School / University
                </label>
                <input
                  className={inputClass}
                  value={edu.school}
                  onChange={(e) =>
                    handleChange(index, "school", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Degree</label>
                <input
                  className={inputClass}
                  value={edu.degree}
                  onChange={(e) =>
                    handleChange(index, "degree", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Field of Study</label>
                <input
                  className={inputClass}
                  value={edu.fieldOfStudy}
                  onChange={(e) =>
                    handleChange(index, "fieldOfStudy", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Grade / CGPA</label>
                <input
                  className={inputClass}
                  value={edu.grade}
                  onChange={(e) => handleChange(index, "grade", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Start Date</label>
                <input
                  type="month"
                  className={inputClass}
                  value={edu.startDate}
                  onChange={(e) =>
                    handleChange(index, "startDate", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">End Date</label>
                <input
                  type="month"
                  className={inputClass}
                  value={edu.endDate}
                  onChange={(e) =>
                    handleChange(index, "endDate", e.target.value)
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Description</label>

                <textarea
                  rows={4}
                  className={inputClass}
                  value={edu.description}
                  onChange={(e) =>
                    handleChange(index, "description", e.target.value)
                  }
                  placeholder="Achievements, coursework, activities..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={prev}
          className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100"
        >
          ← Back
        </button>

        <button
          onClick={next}
          className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Continue to Experience →
        </button>
      </div>
    </div>
  );
};

export default Education;
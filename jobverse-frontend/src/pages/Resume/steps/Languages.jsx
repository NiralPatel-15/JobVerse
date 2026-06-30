import React from "react";
import { Plus, Trash2 } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition";

const emptyLanguage = {
  language: "",
  proficiency: "",
};

const Languages = ({ next, prev, data, update }) => {
  const languages =
    data.languages && data.languages.length > 0
      ? data.languages
      : [{ ...emptyLanguage }];

  const handleChange = (index, field, value) => {
    const updated = [...languages];
    updated[index][field] = value;

    update({
      languages: updated,
    });
  };

  const addLanguage = () => {
    update({
      languages: [...languages, { ...emptyLanguage }],
    });
  };

  const removeLanguage = (index) => {
    if (languages.length === 1) return;

    update({
      languages: languages.filter((_, i) => i !== index),
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Languages</h2>
          <p className="text-gray-500">Add languages you can communicate in.</p>
        </div>

        <button
          onClick={addLanguage}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      <div className="space-y-6">
        {languages.map((lang, index) => (
          <div
            key={index}
            className="border rounded-xl p-5 bg-gray-50 shadow-sm"
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-semibold text-lg">Language #{index + 1}</h3>

              {languages.length > 1 && (
                <button
                  onClick={() => removeLanguage(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Language</label>

                <input
                  className={inputClass}
                  value={lang.language}
                  placeholder="English"
                  onChange={(e) =>
                    handleChange(index, "language", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Proficiency</label>

                <select
                  className={inputClass}
                  value={lang.proficiency}
                  onChange={(e) =>
                    handleChange(index, "proficiency", e.target.value)
                  }
                >
                  <option value="">Select Level</option>
                  <option>Native</option>
                  <option>Fluent</option>
                  <option>Professional</option>
                  <option>Intermediate</option>
                  <option>Basic</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={prev}
          className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
        >
          ← Back
        </button>

        <button
          onClick={next}
          className="px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Continue to Achivements →
        </button>
      </div>
    </div>
  );
};

export default Languages;
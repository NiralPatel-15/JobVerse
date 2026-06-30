import React from "react";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition";

const Interests = ({ next, prev, data, update }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Interests</h2>

        <p className="text-gray-500">
          Add your hobbies and interests (comma separated).
        </p>
      </div>

      <div>
        <label className="text-sm font-medium">Interests</label>

        <textarea
          rows={6}
          className={inputClass}
          placeholder="Open Source, Cricket, Photography, UI Design, Reading..."
          value={
            Array.isArray(data.interests)
              ? data.interests.join(", ")
              : data.interests || ""
          }
          onChange={(e) =>
            update({
              interests: e.target.value
                .split(",")
                .map((i) => i.trim())
                .filter(Boolean),
            })
          }
        />
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
          Review & Save Resume →
        </button>
      </div>
    </div>
  );
};

export default Interests;
import React from "react";
import { Plus, Trash2 } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition";

const emptyAchievement = {
  title: "",
  description: "",
};

const Achievements = ({ next, prev, data, update }) => {
  const achievements =
    data.achievements && data.achievements.length > 0
      ? data.achievements
      : [{ ...emptyAchievement }];

  const handleChange = (index, field, value) => {
    const updated = [...achievements];
    updated[index][field] = value;

    update({
      achievements: updated,
    });
  };

  const addAchievement = () => {
    update({
      achievements: [...achievements, { ...emptyAchievement }],
    });
  };

  const removeAchievement = (index) => {
    if (achievements.length === 1) return;

    update({
      achievements: achievements.filter((_, i) => i !== index),
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Achievements</h2>
          <p className="text-gray-500">
            Showcase awards, accomplishments and recognitions.
          </p>
        </div>

        <button
          onClick={addAchievement}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      <div className="space-y-6">
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className="border rounded-xl p-5 bg-gray-50 shadow-sm"
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-semibold text-lg">
                Achievement #{index + 1}
              </h3>

              {achievements.length > 1 && (
                <button
                  onClick={() => removeAchievement(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Achievement Title</label>

                <input
                  className={inputClass}
                  placeholder="Winner - Smart India Hackathon"
                  value={achievement.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>

                <textarea
                  rows={4}
                  className={inputClass}
                  placeholder="Describe your achievement..."
                  value={achievement.description}
                  onChange={(e) =>
                    handleChange(index, "description", e.target.value)
                  }
                />
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
          Continue to Intrest →
        </button>
      </div>
    </div>
  );
};

export default Achievements;
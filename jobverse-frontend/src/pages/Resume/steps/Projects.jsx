import React, { useState } from "react";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { improveWithAI } from "../../../utils/ai";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition";

const emptyProject = {
  name: "",
  technologies: "",
  github: "",
  liveDemo: "",
  description: "",
};

const Projects = ({ next, prev, data, update }) => {
  const projects =
    data.projects && data.projects.length > 0
      ? data.projects
      : [{ ...emptyProject }];

  const [loadingIndex, setLoadingIndex] = useState(null);

  const handleChange = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;

    update({
      projects: updated,
    });
  };

  const addProject = () => {
    update({
      projects: [...projects, { ...emptyProject }],
    });
  };

  const removeProject = (index) => {
    if (projects.length === 1) return;

    update({
      projects: projects.filter((_, i) => i !== index),
    });
  };

  const handleAI = async (index) => {
    if (!projects[index].description.trim()) return;

    try {
      setLoadingIndex(index);

      const improved = await improveWithAI(
        projects[index].description,
        "project",
      );

      const updated = [...projects];
      updated[index].description = improved;

      update({
        projects: updated,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-gray-500">
            Showcase your best academic and professional projects.
          </p>
        </div>

        <button
          onClick={addProject}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      <div className="space-y-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className="border rounded-xl p-5 bg-gray-50 shadow-sm"
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-semibold text-lg">Project #{index + 1}</h3>

              {projects.length > 1 && (
                <button
                  onClick={() => removeProject(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Project Name</label>

                <input
                  className={inputClass}
                  placeholder="JobVerse ATS Platform"
                  value={project.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Technologies Used</label>

                <input
                  className={inputClass}
                  placeholder="React, Node.js, MongoDB..."
                  value={project.technologies}
                  onChange={(e) =>
                    handleChange(index, "technologies", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">GitHub Repository</label>

                <input
                  type="url"
                  className={inputClass}
                  placeholder="https://github.com/..."
                  value={project.github}
                  onChange={(e) =>
                    handleChange(index, "github", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Live Demo</label>

                <input
                  type="url"
                  className={inputClass}
                  placeholder="https://..."
                  value={project.liveDemo}
                  onChange={(e) =>
                    handleChange(index, "liveDemo", e.target.value)
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">
                  Project Description
                </label>

                <textarea
                  rows={5}
                  className={inputClass}
                  placeholder="Describe your project, features, responsibilities and achievements..."
                  value={project.description}
                  onChange={(e) =>
                    handleChange(index, "description", e.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={() => handleAI(index)}
                  disabled={loadingIndex === index}
                  className="mt-3 flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:opacity-95 disabled:opacity-50 transition"
                >
                  <Sparkles size={18} />

                  {loadingIndex === index ? "Improving..." : "Improve with AI"}
                </button>
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
          Continue to Certificcations →
        </button>
      </div>
    </div>
  );
};

export default Projects;
import React from "react";
import { Plus, Trash2 } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition";

const emptyCertification = {
  name: "",
  organization: "",
  issueDate: "",
  credentialId: "",
  credentialUrl: "",
};

const Certifications = ({ next, prev, data, update }) => {
  const certifications =
    data.certifications && data.certifications.length > 0
      ? data.certifications
      : [{ ...emptyCertification }];

  const handleChange = (index, field, value) => {
    const updated = [...certifications];
    updated[index][field] = value;

    update({
      certifications: updated,
    });
  };

  const addCertification = () => {
    update({
      certifications: [...certifications, { ...emptyCertification }],
    });
  };

  const removeCertification = (index) => {
    if (certifications.length === 1) return;

    update({
      certifications: certifications.filter((_, i) => i !== index),
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Certifications</h2>
          <p className="text-gray-500">
            Add your professional certifications and licenses.
          </p>
        </div>

        <button
          onClick={addCertification}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={18} />
          Add
        </button>
      </div>

      <div className="space-y-6">
        {certifications.map((cert, index) => (
          <div
            key={index}
            className="border rounded-xl p-5 bg-gray-50 shadow-sm"
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-semibold text-lg">
                Certification #{index + 1}
              </h3>

              {certifications.length > 1 && (
                <button
                  onClick={() => removeCertification(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Certificate Name</label>

                <input
                  className={inputClass}
                  value={cert.name}
                  placeholder="AWS Certified Cloud Practitioner"
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Organization</label>

                <input
                  className={inputClass}
                  value={cert.organization}
                  placeholder="Amazon Web Services"
                  onChange={(e) =>
                    handleChange(index, "organization", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Issue Date</label>

                <input
                  type="month"
                  className={inputClass}
                  value={cert.issueDate}
                  onChange={(e) =>
                    handleChange(index, "issueDate", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Credential ID</label>

                <input
                  className={inputClass}
                  value={cert.credentialId}
                  placeholder="ABC123XYZ"
                  onChange={(e) =>
                    handleChange(index, "credentialId", e.target.value)
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Credential URL</label>

                <input
                  type="url"
                  className={inputClass}
                  value={cert.credentialUrl}
                  placeholder="https://..."
                  onChange={(e) =>
                    handleChange(index, "credentialUrl", e.target.value)
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
          Continue to Language →
        </button>
      </div>
    </div>
  );
};

export default Certifications;
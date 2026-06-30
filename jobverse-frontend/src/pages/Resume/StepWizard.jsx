import React, { useEffect, useState } from "react";
import { getMyResumeAPI } from "../../api/resume";
import PersonalInfo from "./steps/PersonalInfo";
import Education from "./steps/Education";
import Experience from "./steps/Experience";
import Skills from "./steps/Skills";
import Review from "./steps/Review";
import Projects from "./steps/Projects";
import Languages from "./steps/Languages";
import Achievements from "./steps/Achievements";
import Certifications from "./steps/Certifications";
import Interests from "./steps/Interests";
import ModernTemplate from "../../components/templates/ModernTemplate";
import ClassicTemplate from "../../components/templates/ClassicTemplate";
import MinimalTemplate from "../../components/templates/MinimalTemplate";
import MinimalImageTemplate from "../../components/templates/MinimalImageTemplate";

const TEMPLATE_OPTIONS = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean, ATS-friendly design",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional professional layout",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant",
  },
  {
    id: "minimal-image",
    name: "Minimal Image",
    description: "Minimal layout with profile photo",
  },
];

const StepWizard = () => {
  const [template, setTemplate] = useState("modern");
  const [step, setStep] = useState(1);
  const [color, setColor] = useState("#4f46e5");
  const [loadingResume, setLoadingResume] = useState(true);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    name: "", // Backward compatibility

    profession: "",
    headline: "",

    email: "",
    phone: "",

    address: "",
    city: "",
    state: "",
    country: "",

    linkedin: "",
    github: "",
    portfolio: "",
    website: "",

    image: null,

    summary: "",

    // Education
    education: [
      {
        school: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        grade: "",
        description: "",
      },
    ],

    // Experience
    experience: [
      {
        company: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
        currentJob: false,
        description: "",
      },
    ],

    // Skills
    skills: "",

    // Other Sections
    projects: [],
    certifications: [],
    languages: [],
    achievements: [],
    interests: [],
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  useEffect(() => {
    const loadResume = async () => {
      try {
        const res = await getMyResumeAPI();

        if (res.success && res.resume) {
          const resume = res.resume;
          // Restore saved template & theme
          setTemplate(resume.template || "modern");
          setColor(resume.accentColor || "#4f46e5");

          setFormData((prev) => ({
            ...prev,

            firstName: resume.personal_info?.first_name || "",
            lastName: resume.personal_info?.last_name || "",

            // Backward compatibility
            name:
              resume.personal_info?.full_name ||
              `${resume.personal_info?.first_name || ""} ${
                resume.personal_info?.last_name || ""
              }`.trim(),

            profession:
              resume.personal_info?.profession ||
              resume.personal_info?.headline ||
              "",

            headline: resume.personal_info?.headline || "",

            email: resume.personal_info?.email || "",
            phone: resume.personal_info?.phone || "",

            address: resume.personal_info?.address || "",
            city: resume.personal_info?.city || "",
            state: resume.personal_info?.state || "",
            country: resume.personal_info?.country || "",

            linkedin: resume.personal_info?.linkedin || "",
            github: resume.personal_info?.github || "",
            portfolio: resume.personal_info?.portfolio || "",
            website: resume.personal_info?.website || "",

            image: resume.personal_info?.image || null,

            summary: resume.summary || "",

            education:
              resume.education?.length > 0 ? resume.education : prev.education,

            experience:
              resume.experience?.length > 0
                ? resume.experience
                : prev.experience,

            skills: resume.skills?.join(", ") || "",

            projects: resume.projects || [],
            certifications: resume.certifications || [],
            languages: resume.languages || [],
            achievements: resume.achievements || [],
            interests: resume.interests || [],
          }));
        }
      } catch {
        // First-time user: no resume yet, ignore
        console.log("No existing resume found");
      } finally {
        setLoadingResume(false);
      }
    };

    loadResume();
  }, []);

  // 🔥 CLEAN SKILLS
  const cleanSkills = formData.skills
    ? formData.skills
        .replace(/\n/g, ",")
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  const formattedData = {
    personal_info: {
      // New data model
      first_name: formData.firstName,

      last_name: formData.lastName,

      // Backward compatibility
      full_name:
        formData.name || `${formData.firstName} ${formData.lastName}`.trim(),

      profession: formData.profession,

      // Keep existing headline support
      headline: formData.headline || formData.profession,

      email: formData.email,
      phone: formData.phone,

      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,

      linkedin: formData.linkedin,
      github: formData.github,
      portfolio: formData.portfolio,
      website: formData.website,

      // Profile image
      image: formData.image,
    },

    summary: formData.summary,
    skills: cleanSkills,
    education: formData.education,
    experience: formData.experience,

    // ADD THESE
    projects: formData.projects,
    certifications: formData.certifications,
    languages: formData.languages,
    achievements: formData.achievements,
    interests: formData.interests,
  };

  if (loadingResume) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500">Loading Resume...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* LEFT SIDE */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border">
        <div className="mb-4">
          <p className="text-sm text-gray-500">Step {step} of 10</p>

          <div className="w-full bg-gray-200 h-2 rounded mt-2">
            <div
              className="bg-indigo-500 h-2 rounded transition-all duration-300"
              style={{ width: `${(step / 10) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <PersonalInfo next={nextStep} update={updateData} data={formData} />
        )}
        {step === 2 && (
          <Education
            next={nextStep}
            prev={prevStep}
            update={updateData}
            data={formData}
          />
        )}
        {step === 3 && (
          <Experience
            next={nextStep}
            prev={prevStep}
            update={updateData}
            data={formData}
          />
        )}
        {step === 4 && (
          <Skills
            next={nextStep}
            prev={prevStep}
            update={updateData}
            data={formData}
          />
        )}

        {step === 5 && (
          <Projects
            next={nextStep}
            prev={prevStep}
            update={updateData}
            data={formData}
          />
        )}

        {step === 6 && (
          <Certifications
            next={nextStep}
            prev={prevStep}
            update={updateData}
            data={formData}
          />
        )}

        {step === 7 && (
          <Languages
            next={nextStep}
            prev={prevStep}
            update={updateData}
            data={formData}
          />
        )}

        {step === 8 && (
          <Achievements
            next={nextStep}
            prev={prevStep}
            update={updateData}
            data={formData}
          />
        )}

        {step === 9 && (
          <Interests
            next={nextStep}
            prev={prevStep}
            update={updateData}
            data={formData}
          />
        )}

        {step === 10 && (
          <Review
            prev={prevStep}
            data={formattedData}
            template={template}
            accentColor={color}
          />
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="lg:col-span-3">
        <div className="bg-white p-6 rounded-2xl shadow-md border sticky top-24">
          {/* CONTROL BAR */}
          <div className="mb-5 flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            {/* Theme */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Theme Color
              </p>

              <div className="flex items-center gap-2">
                {["#4f46e5", "#16a34a", "#dc2626", "#0ea5e9", "#9333ea"].map(
                  (c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`relative h-8 w-8 rounded-full transition-all duration-200 ${
                        color === c
                          ? "ring-2 ring-offset-2 ring-gray-900 scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {color === c && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                          ✓
                        </span>
                      )}
                    </button>
                  ),
                )}

                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="ml-2 h-8 w-8 cursor-pointer rounded-md border border-gray-300"
                />
              </div>
            </div>

            {/* Templates */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Template
              </p>

              <div className="flex flex-wrap gap-2">
                {TEMPLATE_OPTIONS.map((item) => {
                  const active = template === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setTemplate(item.id)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        active
                          ? "text-white shadow-md"
                          : "border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                      style={active ? { backgroundColor: color } : {}}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Live Preview
              </h3>

              <p className="text-sm text-gray-500">Changes appear instantly.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-slate-100 p-6">
  <div className="overflow-auto">
    <div className="flex justify-center min-w-fit py-6">
      <div
        id="resume-preview"
        className="bg-white shadow-2xl mx-auto"
        style={{
          width: "210mm",
          minHeight: "297mm",
          aspectRatio: "210 / 297",
        }}
      >
                {template === "modern" && (
                  <ModernTemplate data={formattedData} accentColor={color} />
                )}

                {template === "classic" && (
                  <ClassicTemplate data={formattedData} accentColor={color} />
                )}

                {template === "minimal" && (
                  <MinimalTemplate data={formattedData} accentColor={color} />
                )}
                {template === "minimal-image" && (
                  <MinimalImageTemplate
                    data={formattedData}
                    accentColor={color}
                  />
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepWizard;

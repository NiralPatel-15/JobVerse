import { Mail, Phone, MapPin, Globe } from "lucide-react";

const ModernTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    try {
      const [year, month] = dateStr.split("-");

      return new Date(year, month - 1).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    } catch {
      return dateStr;
    }
  };

  // Filter empty entries
  const experience =
    data.experience?.filter(
      (item) =>
        item.position || item.company || item.description || item.location,
    ) || [];

  const education =
    data.education?.filter(
      (item) => item.school || item.degree || item.fieldOfStudy || item.grade,
    ) || [];

  const projects =
    data.projects?.filter(
      (item) =>
        item.title ||
        item.description ||
        item.technologies ||
        item.github ||
        item.liveDemo,
    ) || [];

  const skills = data.skills?.filter(Boolean) || [];

  const certifications =
    data.certifications?.filter(
      (item) =>
        item.name ||
        item.issuer ||
        item.issueDate ||
        item.credentialId ||
        item.credentialUrl,
    ) || [];

  const languages =
    data.languages?.filter((item) => item.name || item.proficiency) || [];

    const achievements =
      data.achievements?.filter((item) => item.title || item.description) || [];

    const interests = data.interests?.filter(Boolean) || [];

  return (
    <div className="w-full h-full bg-white text-gray-800">
      {/* Header */}
      <header
        className="p-8 text-white"
        style={{ backgroundColor: accentColor }}
      >
        <h1 className="text-4xl font-bold tracking-wide">
          {data.personal_info?.full_name ||
            `${data.personal_info?.first_name || ""} ${
              data.personal_info?.last_name || ""
            }`.trim() ||
            "Your Name"}
        </h1>

        {(data.personal_info?.profession || data.personal_info?.headline) && (
          <p className="text-lg opacity-95 mt-2 font-light">
            {data.personal_info.profession || data.personal_info.headline}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm ">
          {data.personal_info?.email && (
            <div className="flex items-center gap-2">
              <Mail className="size-4" />
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="size-4" />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {(data.personal_info?.city ||
            data.personal_info?.state ||
            data.personal_info?.country) && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4" />
              <span>
                {[
                  data.personal_info.city,
                  data.personal_info.state,
                  data.personal_info.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          )}

          {data.personal_info?.linkedin && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">LinkedIn:</span>
              <a
                href={
                  data.personal_info.linkedin.startsWith("http")
                    ? data.personal_info.linkedin
                    : `https://${data.personal_info.linkedin}`
                }
                target="_blank"
                rel="noreferrer"
                className="underline break-all"
              >
                {data.personal_info.linkedin}
              </a>
            </div>
          )}

          {data.personal_info?.github && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">GitHub:</span>
              <a
                href={
                  data.personal_info.github.startsWith("http")
                    ? data.personal_info.github
                    : `https://${data.personal_info.github}`
                }
                target="_blank"
                rel="noreferrer"
                className="underline break-all"
              >
                {data.personal_info.github}
              </a>
            </div>
          )}

          {data.personal_info?.website && (
            <a
              target="_blank"
              rel="noreferrer"
              href={data.personal_info?.website}
              className="flex items-center gap-2"
            >
              <Globe className="size-4" />
              <span className="break-all text-xs">
                {data.personal_info.website.replace(/^https?:\/\//, "")}
              </span>
            </a>
          )}
        </div>
      </header>

      <div className="p-8 space-y-10">
        {/* Professional Summary */}
        {!!data.summary?.trim() && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-200">
              Professional Summary
            </h2>

            <p className="text-gray-700 leading-7 text-justify whitespace-pre-line">
              {data.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-light mb-6 pb-2 border-b border-gray-200">
              Experience
            </h2>

            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div
                  key={index}
                  className="relative pl-6 border-l border-gray-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {exp.position}
                      </h3>
                      <p
                        className="font-semibold mt-1"
                        style={{ color: accentColor }}
                      >
                        {exp.company}
                      </p>
                      {exp.location && (
                        <p className="text-sm text-gray-500 mt-1">
                          📍 {exp.location}
                        </p>
                      )}
                    </div>
                    <div className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-md whitespace-nowrap">
                      {formatDate(exp.startDate)} -{" "}
                      {exp.currentJob ? "Present" : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-gray-700 leading-7 mt-3 whitespace-pre-line">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-5 pb-2 border-b border-gray-200">
              Projects
            </h2>

            <div className="space-y-6">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="border-l-4 pl-5"
                  style={{ borderColor: accentColor }}
                >
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <h3 className="text-lg font-semibold">{project.title}</h3>

                    {project.duration && (
                      <span className="text-xs bg-gray-100 px-3 py-1 rounded">
                        {project.duration}
                      </span>
                    )}
                  </div>

                  {project.description && (
                    <p className="mt-2 text-gray-700 leading-7">
                      {project.description}
                    </p>
                  )}

                  {project.technologies && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {(Array.isArray(project.technologies)
                        ? project.technologies
                        : project.technologies.split(",")
                      ).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded bg-gray-100 text-xs"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-5 mt-3 flex-wrap">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm underline"
                        style={{ color: accentColor }}
                      >
                        GitHub
                      </a>
                    )}

                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm underline"
                        style={{ color: accentColor }}
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid sm:grid-cols-2 gap-8">
          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
                Education
              </h2>

              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree}{" "}
                      {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                    </h3>
                    <p style={{ color: accentColor }}>{edu.school}</p>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </span>
                      {edu.grade && <span>GPA: {edu.grade}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
                Skills
              </h2>

              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full text-sm text-white font-medium shadow-sm"
                    style={{ backgroundColor: accentColor }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-200">
                Certifications
              </h2>

              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index}>
                    <h3 className="font-semibold">{cert.name}</h3>

                    {cert.issuer && (
                      <p className="text-sm" style={{ color: accentColor }}>
                        {cert.issuer}
                      </p>
                    )}

                    {cert.issueDate && (
                      <p className="text-xs text-gray-500">
                        {formatDate(cert.issueDate)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-200">
                Languages
              </h2>

              <div className="space-y-3">
                {languages.map((lang, index) => (
                  <div
                    key={index}
                    className="flex justify-between border-b pb-2"
                  >
                    <span className="font-medium">{lang.name}</span>

                    <span className="text-sm" style={{ color: accentColor }}>
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
              Achievements
            </h2>

            <div className="space-y-5">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="border-l-4 pl-4"
                  style={{ borderColor: accentColor }}
                >
                  <h3 className="font-semibold text-gray-900">
                    {achievement.title}
                  </h3>

                  {achievement.description && (
                    <p className="text-gray-700 mt-1 leading-7">
                      {achievement.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
              Interests
            </h2>

            <div className="flex flex-wrap gap-3">
              {interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full border text-sm font-medium"
                  style={{
                    borderColor: accentColor,
                    color: accentColor,
                  }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;

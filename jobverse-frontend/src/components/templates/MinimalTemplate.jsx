import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const MinimalTemplate = ({ data, accentColor }) => {
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
        item.name ||
        item.description ||
        item.technologies ||
        item.github ||
        item.liveDemo ||
        item.liveLink,
    ) || [];

  const skills = data.skills?.filter(Boolean) || [];

  const certifications =
    data.certifications?.filter(
      (item) => item.name || item.issuer || item.issueDate || item.date,
    ) || [];

  const languages =
    data.languages?.filter((item) => item.name || item.proficiency) || [];

  const achievements =
    data.achievements?.filter((item) => item.title || item.description) || [];

  const interests = data.interests?.filter(Boolean) || [];

  return (
    <div className="max-w-4xl mx-auto bg-white p-10 text-gray-900">
      {/* Header */}
      <header className="mb-10 border-b pb-8 border-gray-200">
        <div className="flex items-start justify-between gap-6">
          {/* Left Side */}
          <div className="flex-1">
            <h1
              className="text-4xl font-light tracking-wide"
              style={{ color: accentColor }}
            >
              {`${data.personal_info?.first_name || ""} ${data.personal_info?.last_name || ""}`.trim() ||
                data.personal_info?.full_name ||
                "Your Name"}
            </h1>

            {(data.personal_info?.profession ||
              data.personal_info?.headline) && (
              <p className="mt-2 text-lg text-gray-600">
                {data.personal_info.profession || data.personal_info.headline}
              </p>
            )}

            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-5 text-sm text-gray-600">
              {data.personal_info?.email && (
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>{data.personal_info.email}</span>
                </div>
              )}

              {data.personal_info?.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>{data.personal_info.phone}</span>
                </div>
              )}

              {(data.personal_info?.city ||
                data.personal_info?.state ||
                data.personal_info?.country) && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
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
                  <FaLinkedin className="size-4" />
                  <span className="break-all">
                    {data.personal_info.linkedin}
                  </span>
                </div>
              )}

              {data.personal_info?.github && (
                <div className="flex items-center gap-2">
                  <FaGithub className="size-4" />
                  <span className="break-all">{data.personal_info.github}</span>
                </div>
              )}

              {data.personal_info?.website && (
                <div className="flex items-center gap-2">
                  <Globe size={16} />
                  <span className="break-all">
                    {data.personal_info.website
                      .replace(/^https?:\/\//, "")
                      .replace(/\/$/, "")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {data.personal_info?.profileImage && (
            <img
              src={data.personal_info.profileImage}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 flex-shrink-0"
              style={{ borderColor: accentColor }}
            />
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {!!data.summary?.trim() && (
        <section className="mb-10">
          <h2
            className="text-xs font-semibold uppercase tracking-[0.3em] mb-4"
            style={{ color: accentColor }}
          >
            Professional Summary
          </h2>

          <p className="text-gray-700 leading-7 whitespace-pre-line">
            {data.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-xs font-semibold uppercase tracking-[0.3em] mb-6"
            style={{ color: accentColor }}
          >
            Experience
          </h2>

          <div className="space-y-8">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="border-l-2 pl-5"
                style={{ borderColor: accentColor }}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {exp.position}
                    </h3>

                    <p className="text-gray-700">{exp.company}</p>

                    {exp.location && (
                      <p className="text-sm text-gray-500 mt-1">
                        {exp.location}
                      </p>
                    )}
                  </div>

                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(exp.startDate)} —{" "}
                    {exp.currentJob ? "Present" : formatDate(exp.endDate)}
                  </div>
                </div>

                {exp.description && (
                  <div className="mt-4 text-gray-700 leading-7 whitespace-pre-line">
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
        <section className="mb-10">
          <h2
            className="text-xs font-semibold uppercase tracking-[0.3em] mb-6"
            style={{ color: accentColor }}
          >
            Projects
          </h2>

          <div className="space-y-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="border-l-2 pl-5"
                style={{ borderColor: accentColor }}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {project.title || project.name}
                    </h3>

                    {project.duration && (
                      <p className="text-sm text-gray-500 mt-1">
                        {project.duration}
                      </p>
                    )}
                  </div>
                </div>

                {project.description && (
                  <p className="mt-4 text-gray-700 leading-7 whitespace-pre-line">
                    {project.description}
                  </p>
                )}

                {project.technologies && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {(Array.isArray(project.technologies)
                      ? project.technologies
                      : project.technologies.split(",")
                    ).map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs rounded-full border"
                        style={{
                          borderColor: accentColor,
                          color: accentColor,
                        }}
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {(project.github || project.liveDemo || project.liveLink) && (
                  <div className="flex flex-wrap gap-6 mt-4 text-sm">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                        style={{ color: accentColor }}
                      >
                        GitHub →
                      </a>
                    )}

                    {(project.liveDemo || project.liveLink) && (
                      <a
                        href={project.liveDemo || project.liveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                        style={{ color: accentColor }}
                      >
                        Live Demo →
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {/* Education */}
      {education.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-xs font-semibold uppercase tracking-[0.3em] mb-6"
            style={{ color: accentColor }}
          >
            Education
          </h2>

          <div className="space-y-8">
            {education.map((edu, index) => (
              <div
                key={index}
                className="border-l-2 pl-5"
                style={{ borderColor: accentColor }}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {edu.degree}
                      {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                    </h3>

                    <p className="text-gray-700">{edu.school}</p>

                    {edu.grade && (
                      <p className="text-sm text-gray-500 mt-1">
                        Grade / GPA: {edu.grade}
                      </p>
                    )}
                  </div>

                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-xs font-semibold uppercase tracking-[0.3em] mb-6"
            style={{ color: accentColor }}
          >
            Skills
          </h2>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full border text-sm"
                style={{
                  borderColor: accentColor,
                  color: accentColor,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-xs font-semibold uppercase tracking-[0.3em] mb-6"
            style={{ color: accentColor }}
          >
            Certifications
          </h2>

          <div className="space-y-5">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="border-l-2 pl-5"
                style={{ borderColor: accentColor }}
              >
                <h3 className="font-medium text-gray-900">{cert.name}</h3>

                {cert.issuer && (
                  <p className="text-gray-700 mt-1">{cert.issuer}</p>
                )}

                {(cert.issueDate || cert.date) && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(cert.issueDate || cert.date)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-xs font-semibold uppercase tracking-[0.3em] mb-6"
            style={{ color: accentColor }}
          >
            Languages
          </h2>

          <div className="space-y-3">
            {languages.map((language, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-100 pb-2"
              >
                <span className="font-medium text-gray-800">
                  {language.name}
                </span>

                {language.proficiency && (
                  <span className="text-sm text-gray-500">
                    {language.proficiency}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-xs font-semibold uppercase tracking-[0.3em] mb-6"
            style={{ color: accentColor }}
          >
            Achievements
          </h2>

          <div className="space-y-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="border-l-2 pl-5"
                style={{ borderColor: accentColor }}
              >
                <h3 className="font-medium text-gray-900">
                  {achievement.title}
                </h3>

                {achievement.description && (
                  <p className="mt-2 text-gray-700 leading-7 whitespace-pre-line">
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
        <section className="mb-6">
          <h2
            className="text-xs font-semibold uppercase tracking-[0.3em] mb-6"
            style={{ color: accentColor }}
          >
            Interests
          </h2>

          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full border text-sm"
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
  );
};

export default MinimalTemplate;

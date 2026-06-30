import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const ClassicTemplate = ({ data, accentColor }) => {
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
        item.name ||
        item.title ||
        item.description ||
        item.technologies ||
        item.github ||
        item.liveLink ||
        item.liveDemo,
    ) || [];

  const skills = data.skills?.filter(Boolean) || [];

  const certifications =
    data.certifications?.filter(
      (item) => item.name || item.issuer || item.date || item.issueDate,
    ) || [];

  const languages =
    data.languages?.filter((item) => item.name || item.proficiency) || [];

  const achievements =
    data.achievements?.filter((item) => item.title || item.description) || [];

  const interests = data.interests?.filter(Boolean) || [];

  return (
    <div className="max-w-4xl mx-auto bg-white p-10 text-gray-800 leading-relaxed">
      {/* Header */}
      <header
        className="text-center mb-8 pb-6 border-b-2"
        style={{ borderColor: accentColor }}
      >
        {data.personal_info?.profileImage && (
          <img
            src={data.personal_info.profileImage}
            alt="Profile"
            className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4"
            style={{ borderColor: accentColor }}
          />
        )}

        <h1
          className="text-3xl font-bold tracking-wide"
          style={{ color: accentColor }}
        >
          {data.personal_info?.full_name ||
            `${data.personal_info?.first_name || ""} ${data.personal_info?.last_name || ""}`.trim() ||
            "Your Name"}
        </h1>

        {(data.personal_info?.profession || data.personal_info?.headline) && (
          <p className="text-gray-600 mt-2 text-lg">
            {data.personal_info?.profession || data.personal_info?.headline}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm text-gray-600">
          {data.personal_info?.email && (
            <div className="flex items-center gap-1">
              <Mail className="size-4" />
              <span>{data.personal_info.email}</span>
            </div>
          )}

          {data.personal_info?.phone && (
            <div className="flex items-center gap-1">
              <Phone className="size-4" />
              <span>{data.personal_info.phone}</span>
            </div>
          )}

          {(data.personal_info?.city ||
            data.personal_info?.state ||
            data.personal_info?.country) && (
            <div className="flex items-center gap-1">
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
            <div className="flex items-center gap-1">
              <FaLinkedin className="size-4" />
              <span className="break-all">{data.personal_info.linkedin}</span>
            </div>
          )}

          {data.personal_info?.github && (
            <div className="flex items-center gap-1">
              <FaGithub className="size-4" />
              <span className="break-all">{data.personal_info.github}</span>
            </div>
          )}

          {data.personal_info?.website && (
            <div className="flex items-center gap-1">
              <Globe className="size-4" />
              <span className="break-all">
                {(data.personal_info.website || "")
                  .replace("https://", "")
                  .replace("http://", "")}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {!!data.summary?.trim() && (
        <section className="mb-8">
          <h2
            className="text-xl font-semibold mb-3 uppercase tracking-wide"
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
        <section className="mb-6">
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: accentColor }}
          >
            PROFESSIONAL EXPERIENCE
          </h2>

          <div className="space-y-5">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="border-l-4 pl-5"
                style={{ borderColor: accentColor }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {exp.position}
                    </h3>
                    <p className="text-gray-700 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>
                      {formatDate(exp.startDate)} -{" "}
                      {exp.currentJob ? "Present" : formatDate(exp.endDate)}
                    </p>
                  </div>
                </div>
                {exp.description && (
                  <div className="text-gray-700 leading-7 whitespace-pre-line">
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
          <h2
            className="text-xl font-semibold mb-4 uppercase tracking-wide"
            style={{ color: accentColor }}
          >
            Projects
          </h2>

          <div className="space-y-5">
            {projects.map((project, index) => (
              <div
                key={index}
                className="border-l-4 pl-5"
                style={{ borderColor: accentColor }}
              >
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {project.title || project.name}
                  </h3>

                  {project.duration && (
                    <span className="text-xs text-gray-500">
                      {project.duration}
                    </span>
                  )}
                </div>

                {project.description && (
                  <p className="mt-2 text-gray-700 leading-7 whitespace-pre-line">
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
                        className="px-2 py-1 rounded border text-xs"
                        style={{ borderColor: accentColor }}
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-5 mt-3 text-sm">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                      style={{ color: accentColor }}
                    >
                      GitHub
                    </a>
                  )}

                  {(project.liveLink || project.liveDemo) && (
                    <a
                      href={project.liveLink || project.liveDemo}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
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

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h2
            className="text-xl font-semibold mb-4 uppercase tracking-wide"
            style={{ color: accentColor }}
          >
            Education
          </h2>

          <div className="space-y-5">
            {education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    {edu.degree}

                    {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                  </h3>

                  <p className="text-gray-700">{edu.school}</p>

                  {edu.grade && (
                    <p className="text-sm text-gray-600">
                      Grade / GPA: {edu.grade}
                    </p>
                  )}
                </div>

                <div className="text-sm text-gray-500 whitespace-nowrap">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-8">
          <h2
            className="text-xl font-semibold mb-4 uppercase tracking-wide"
            style={{ color: accentColor }}
          >
            Core Skills
          </h2>

          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded border text-sm"
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
        <section className="mb-8">
          <h2
            className="text-xl font-semibold mb-4 uppercase tracking-wide"
            style={{ color: accentColor }}
          >
            Certifications
          </h2>

          <div className="space-y-3">
            {certifications.map((cert, index) => (
              <div key={index}>
                <h3 className="font-semibold">{cert.name}</h3>

                {cert.issuer && <p className="text-gray-700">{cert.issuer}</p>}

                {(cert.date || cert.issueDate) && (
                  <p className="text-sm text-gray-500">
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
        <section className="mb-8">
          <h2
            className="text-xl font-semibold mb-4 uppercase tracking-wide"
            style={{ color: accentColor }}
          >
            Languages
          </h2>

          <div className="space-y-2">
            {languages.map((lang, index) => (
              <div key={index} className="flex justify-between">
                <span>{lang.name}</span>

                <span className="text-gray-600">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <section className="mb-8">
          <h2
            className="text-xl font-semibold mb-4 uppercase tracking-wide"
            style={{ color: accentColor }}
          >
            Achievements
          </h2>

          <div className="space-y-5">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="border-l-4 pl-4"
                style={{ borderColor: accentColor }}
              >
                <h3 className="font-semibold">{achievement.title}</h3>

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
        <section className="mb-8">
          <h2
            className="text-xl font-semibold mb-4 uppercase tracking-wide"
            style={{ color: accentColor }}
          >
            Interests
          </h2>

          <div className="flex flex-wrap gap-3">
            {interests.map((interest, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded border text-sm"
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

export default ClassicTemplate;

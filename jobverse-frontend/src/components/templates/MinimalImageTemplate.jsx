import { Mail, Phone, MapPin } from "lucide-react";

const MinimalImageTemplate = ({ data, accentColor }) => {
    const formatDate = (dateStr) => {
      if (!dateStr) return "";

      try {
        const date = new Date(dateStr);

        if (isNaN(date.getTime())) return "";

        return date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      } catch {
        return "";
      }
    };

    const personal = data?.personal_info || {};

    const experiences = (data?.experience || []).filter(
      (exp) => exp?.position || exp?.company || exp?.description,
    );

    const education = (data?.education || []).filter(
      (edu) => edu?.school || edu?.degree || edu?.fieldOfStudy,
    );

    const projects = (data?.projects || []).filter(
      (project) => project?.title || project?.description,
    );

    const certifications = (data?.certifications || []).filter(
      (cert) => cert?.name,
    );

    const languages = (data?.languages || []).filter((lang) => lang?.name);

    const achievements = (data?.achievements || []).filter(Boolean);

    const interests = (data?.interests || []).filter(Boolean);

    const location = [personal?.city, personal?.state, personal?.country]
  .filter(Boolean)
  .join(", ");

const fullName =
  `${personal?.first_name || personal?.firstName || ""} ${
    personal?.last_name || personal?.lastName || ""
  }`.trim() ||
  personal?.full_name ||
  "Your Name";

const profileImage = personal?.profileImage || personal?.image;

    return (
      <div className="max-w-5xl mx-auto bg-white text-zinc-800">
        <div className="grid grid-cols-3">
          <div className="col-span-1  py-10">
            {/* Image */}
            {profileImage && typeof profileImage === "string" ? (
              <div className="mb-6">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-full mx-auto"
                  style={{ background: accentColor + "70" }}
                />
              </div>
            ) : profileImage && typeof profileImage === "object" ? (
              <div className="mb-6">
                <img
                  src={URL.createObjectURL(profileImage)}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-full mx-auto"
                />
              </div>
            ) : null}
          </div>

          {/* Name + Title */}
          <div className="col-span-2 flex flex-col justify-center py-10 px-8">
            <h1 className="text-4xl font-bold text-zinc-700 tracking-widest">
              {fullName}
            </h1>
            <p className="uppercase text-zinc-600 font-medium text-sm tracking-widest">
              {personal?.profession || personal?.headline || "Profession"}
            </p>
          </div>

          {/* Left Sidebar */}
          <aside className="col-span-1 border-r border-zinc-400 p-6 pt-0">
            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                CONTACT
              </h2>
              <div className="space-y-2 text-sm">
                {personal?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} style={{ color: accentColor }} />
                    <span>{personal.phone}</span>
                  </div>
                )}
                {personal?.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={14} style={{ color: accentColor }} />
                    <span>{personal.email}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} style={{ color: accentColor }} />
                    <span>{location}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Education */}
            {education.length > 0 && (
              <section className="mb-8">
                <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                  EDUCATION
                </h2>

                <div className="space-y-5 text-sm">
                  {education.map((edu, index) => (
                    <div key={index}>
                      {edu.degree && (
                        <p className="font-semibold uppercase">{edu.degree}</p>
                      )}

                      {edu.fieldOfStudy && (
                        <p className="text-zinc-700">{edu.fieldOfStudy}</p>
                      )}

                      {edu.school && (
                        <p className="text-zinc-600">{edu.school}</p>
                      )}

                      {(edu.startDate || edu.endDate) && (
                        <p className="text-xs text-zinc-500">
                          {edu.startDate && formatDate(edu.startDate)}

                          {edu.startDate && " - "}

                          {edu.endDate
                            ? formatDate(edu.endDate)
                            : edu.startDate
                              ? "Present"
                              : ""}
                        </p>
                      )}

                      {edu.grade && (
                        <p className="text-xs text-zinc-500">
                          Grade: {edu.grade}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {data.skills?.filter(Boolean).length > 0 && (
              <section className="mb-8">
                <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                  SKILLS
                </h2>

                <ul className="space-y-1 text-sm">
                  {data.skills.filter(Boolean).map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <section className="mb-8">
                <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                  CERTIFICATIONS
                </h2>

                <div className="space-y-3 text-sm">
                  {certifications.map((cert, index) => (
                    <div key={index}>
                      <p className="font-medium">{cert.name}</p>

                      {cert.issuer && (
                        <p className="text-zinc-600">{cert.issuer}</p>
                      )}

                      {(cert.issueDate || cert.date) && (
                        <p className="text-xs text-zinc-500">
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
                <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                  LANGUAGES
                </h2>

                <ul className="space-y-1 text-sm">
                  {languages.map((lang, index) => (
                    <li key={index}>
                      {lang.name}
                      {lang.proficiency && (
                        <span className="text-zinc-500">
                          {" "}
                          • {lang.proficiency}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <section className="mb-8">
                <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                  ACHIEVEMENTS
                </h2>

                <ul className="list-disc list-inside space-y-1 text-sm">
                  {achievements.map((achievement, index) => (
                    <li key={index}>
                      {typeof achievement === "string"
                        ? achievement
                        : achievement.title || achievement.name}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Interests */}
            {interests.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                  INTERESTS
                </h2>

                <ul className="space-y-1 text-sm">
                  {interests.map((interest, index) => (
                    <li key={index}>
                      {typeof interest === "string" ? interest : interest.name}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>

          {/* Right Content */}
          <main className="col-span-2 p-8 pt-0">
            {/* Summary */}
            {data?.summary?.trim() && (
              <section className="mb-8">
                <h2
                  className="text-sm font-semibold tracking-widest mb-3"
                  style={{ color: accentColor }}
                >
                  SUMMARY
                </h2>

                <p className="text-zinc-700 leading-relaxed whitespace-pre-line">
                  {data.summary}
                </p>
              </section>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
              <section className="mb-8">
                <h2
                  className="text-sm font-semibold tracking-widest mb-4"
                  style={{ color: accentColor }}
                >
                  EXPERIENCE
                </h2>

                <div className="space-y-6">
                  {experiences.map((exp, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-semibold text-zinc-900">
                          {exp.position}
                        </h3>

                        {(exp.startDate || exp.endDate || exp.currentJob) && (
                          <span className="text-xs text-zinc-500 whitespace-nowrap">
                            {formatDate(exp.startDate)}
                            {(exp.startDate || exp.endDate || exp.currentJob) &&
                              " - "}
                            {exp.currentJob
                              ? "Present"
                              : formatDate(exp.endDate)}
                          </span>
                        )}
                      </div>

                      {exp.company && (
                        <p
                          className="font-medium text-sm mb-2"
                          style={{ color: accentColor }}
                        >
                          {exp.company}
                        </p>
                      )}

                      {exp.description && (
                        <ul className="list-disc list-inside text-sm text-zinc-700 leading-relaxed space-y-1">
                          {exp.description
                            .split("\n")
                            .filter(Boolean)
                            .map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                        </ul>
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
                  className="text-sm uppercase tracking-widest font-semibold mb-3"
                  style={{ color: accentColor }}
                >
                  PROJECTS
                </h2>

                <div className="space-y-5">
                  {projects.map((project, index) => (
                    <div key={index}>
                      {project.title && (
                        <h3 className="font-semibold text-zinc-800">
                          {project.title}
                        </h3>
                      )}

                      {project.technologies && (
                        <p
                          className="text-sm mb-1"
                          style={{ color: accentColor }}
                        >
                          {Array.isArray(project.technologies)
                            ? project.technologies.join(", ")
                            : project.technologies}
                        </p>
                      )}

                      {project.description && (
                        <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1">
                          {project.description
                            .split("\n")
                            .filter(Boolean)
                            .map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                        </ul>
                      )}

                      {(project.liveDemo || project.link) && (
                        <p
                          className="text-xs mt-2 break-all"
                          style={{ color: accentColor }}
                        >
                          {project.liveDemo || project.link}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    );
}


export default MinimalImageTemplate;
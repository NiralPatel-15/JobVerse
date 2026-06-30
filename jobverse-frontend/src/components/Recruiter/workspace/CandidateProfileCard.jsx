import { Mail, Phone, MapPin, Briefcase, Award } from "lucide-react";

const CandidateProfileCard = ({ application }) => {
  const user = application?.user;

  const getStatusColor = (status) => {
    switch (status) {
      case "shortlisted":
        return "bg-green-100 text-green-700";

      case "interview":
        return "bg-blue-100 text-blue-700";

      case "offer_sent":
        return "bg-purple-100 text-purple-700";

      case "hired":
        return "bg-emerald-100 text-emerald-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
      {/* Header */}

      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 h-24" />

      <div className="px-6 pb-6">
        {/* Profile */}

        <div className="-mt-12 flex flex-col items-center">
          <img
            src={user?.profilePic || "/user.png"}
            alt={user?.f_name}
            className="
              w-24
              h-24
              rounded-full
              object-cover
              border-4
              border-white
              shadow-md
            "
          />

          <h2 className="mt-4 text-xl font-bold text-gray-900">
            {user?.f_name}
          </h2>

          <p className="text-gray-500 text-sm">{application?.job?.title}</p>
        </div>

        {/* ATS Score */}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="bg-indigo-50 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">ATS Score</p>

            <div className="flex items-center justify-center gap-1">
              <Award size={16} className="text-indigo-600" />

              <span className="text-xl font-bold text-indigo-600">
                {application?.atsScore || 0}%
              </span>
            </div>

            <div className="mt-3">
              <div className="w-full h-2 bg-indigo-100 rounded-full">
                <div
                  className="h-2 bg-indigo-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${application?.atsScore || 0}%`,
                  }}
                />
              </div>

              <p className="text-xs text-gray-500 mt-2">
                {(application?.atsScore || 0) >= 80
                  ? "Excellent Match"
                  : (application?.atsScore || 0) >= 60
                    ? "Good Match"
                    : "Needs Review"}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Status</p>

            <span
              className={`
                inline-flex
                px-3
                py-1
                rounded-full
                text-xs
                font-medium
                ${getStatusColor(application?.status)}
              `}
            >
              {application?.status?.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Skills */}

        {application?.matchedSkills?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Skills Match
            </h3>

            <div className="flex flex-wrap gap-2">
              {application.matchedSkills.slice(0, 6).map((skill, index) => (
                <span
                  key={index}
                  className="
                      px-3
                      py-1
                      rounded-full
                      bg-green-50
                      text-green-700
                      text-xs
                      font-medium
                    "
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Candidate Info */}

        <div className="mt-6 border-t border-gray-100 pt-5 space-y-4">
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-gray-400" />

            <span className="text-sm text-gray-700">{user?.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <Phone size={16} className="text-gray-400" />

            <span className="text-sm text-gray-700">
              {user?.phone || "N/A"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-gray-400" />

            <span className="text-sm text-gray-700">
              {user?.location || "Unknown"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Briefcase size={16} className="text-gray-400" />

            <span className="text-sm text-gray-700">
              {application?.experienceYears || 0} Years Experience
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfileCard;

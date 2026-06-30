import { CalendarDays, Briefcase, Award, User } from "lucide-react";

const WorkspaceHeader = ({ application }) => {
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
    <div
      className="
      bg-white
      border
      border-gray-200
      shadow-sm
      rounded-3xl
      p-6
      "
    >
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        {/* LEFT */}

        <div className="flex items-center gap-5">
          <img
            src={application?.user?.profilePic || "/user.png"}
            alt={application?.user?.f_name}
            className="
              w-16
              h-16
              rounded-2xl
              object-cover
              border
              border-gray-200
            "
          />

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {application?.user?.f_name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Briefcase size={15} />

                {application?.job?.title}
              </div>

              <div className="flex items-center gap-1">
                <CalendarDays size={15} />
                Applied {new Date(application?.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex flex-wrap items-center gap-3">
          {/* ATS SCORE */}

          <div
            className="
            bg-indigo-50
            px-4
            py-3
            rounded-2xl
            min-w-[120px]
            "
          >
            <div className="flex items-center gap-2">
              <Award size={16} className="text-indigo-600" />

              <span className="text-xs text-gray-500">ATS Score</span>
            </div>

            <p className="text-xl font-bold text-indigo-600 mt-1">
              {application?.atsScore || 0}%
            </p>
          </div>

          {/* STATUS */}

          <div
            className="
            px-4
            py-3
            rounded-2xl
            min-w-[130px]
            "
          >
            <span
              className={`
                px-3
                py-1
                rounded-full
                text-sm
                font-medium
                ${getStatusColor(application?.status)}
              `}
            >
              {application?.status?.replace("_", " ")}
            </span>
          </div>

          {/* CANDIDATE */}

          <div
            className="
            bg-gray-50
            px-4
            py-3
            rounded-2xl
            "
          >
            <div className="flex items-center gap-2">
              <User size={16} />

              <span className="text-sm font-medium">Candidate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceHeader;

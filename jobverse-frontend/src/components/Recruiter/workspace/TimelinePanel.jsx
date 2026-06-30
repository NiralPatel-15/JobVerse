import { useEffect, useState, useCallback } from "react";
import axios from "../../../api/axiosConfig";
import {
  CheckCircle,
  UserCheck,
  CalendarDays,
  Briefcase,
  XCircle,
  Clock,
} from "lucide-react";

const TimelinePanel = ({ applicationId }) => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  

  const fetchTimeline = useCallback(async () => {
    try {
      const res = await axios.get(`/applications/timeline/${applicationId}`);

      setTimeline(res.data.timeline || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  const getEventIcon = (type) => {
    switch (type) {
      case "applied":
        return <Briefcase size={18} />;

      case "shortlisted":
        return <UserCheck size={18} />;

      case "interview":
        return <CalendarDays size={18} />;

      case "accepted":
      case "hired":
        return <CheckCircle size={18} />;

      case "rejected":
        return <XCircle size={18} />;

      default:
        return <Clock size={18} />;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case "applied":
        return "bg-indigo-100 text-indigo-600";

      case "shortlisted":
        return "bg-green-100 text-green-600";

      case "interview":
        return "bg-blue-100 text-blue-600";

      case "accepted":
      case "hired":
        return "bg-emerald-100 text-emerald-600";

      case "rejected":
        return "bg-red-100 text-red-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Candidate Journey</h2>

          <p className="text-sm text-gray-500 mt-1">
            Complete hiring timeline and recruiter activity
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-500">
          Loading timeline...
        </div>
      ) : timeline.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          No timeline events available
        </div>
      ) : (
        <div className="relative">
          {timeline.map((event, index) => (
            <div key={event._id} className="relative flex gap-4 pb-8">
              {index !== timeline.length - 1 && (
                <div
                  className="
                    absolute
                    left-[18px]
                    top-12
                    w-[2px]
                    h-full
                    bg-gray-200
                  "
                />
              )}

              <div
                className={`
                  h-9
                  w-9
                  rounded-full
                  flex
                  items-center
                  justify-center
                  shrink-0
                  ${getEventColor(event.type)}
                `}
              >
                {getEventIcon(event.type)}
              </div>

              <div className="flex-1">
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {event.title}
                    </h3>

                    <span className="text-xs text-gray-500">
                      {new Date(event.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {event.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {event.description}
                    </p>
                  )}

                  {event.actor && (
                    <div className="flex items-center gap-2 mt-3">
                      <img
                        src={event.actor.profilePic || "/user.png"}
                        alt={event.actor.f_name}
                        className="
                          w-7
                          h-7
                          rounded-full
                          object-cover
                        "
                      />

                      <span className="text-xs text-gray-500">
                        {event.actor.f_name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimelinePanel;

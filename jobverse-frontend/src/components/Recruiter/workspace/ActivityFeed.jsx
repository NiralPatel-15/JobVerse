import { useEffect, useState } from "react";
import axios from "../../../api/axiosConfig";

const ActivityFeed = ({ applicationId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const res = await axios.get(`/applications/timeline/${applicationId}`);

        setActivities([...(res.data.timeline || [])].reverse());
      } catch (err) {
        console.log(err);

        // temporary fallback
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [applicationId]);

  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 h-fit">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">
        Activity Feed
      </h2>

      <div className="space-y-5 max-h-[800px] overflow-y-auto pr-2">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse border-l-4 border-gray-200 pl-4"
              >
                <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-20" />
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          activities.map((item) => (
            <div key={item._id} className="border-l-4 border-indigo-500 pl-4">
              <p className="font-semibold text-gray-800">{item.title}</p>

              <p className="text-sm text-gray-500 mt-1">{item.description}</p>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">📋</div>

            <p className="font-medium text-gray-600">No activity yet</p>

            <p className="text-sm text-gray-400 mt-1">
              Hiring actions will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
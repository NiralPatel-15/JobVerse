import { useEffect, useState } from "react";
import { getApplicantsAPI, updateStatusAPI } from "../../api/application";

const Applicants = ({ jobId }) => {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    getApplicantsAPI(jobId).then((res) => setApps(res.data));
  }, [jobId]);

  const updateStatus = async (id, status) => {
    const res = await updateStatusAPI(id, status);

    setApps((prev) => prev.map((a) => (a._id === id ? res.data : a)));
  };

  return (
    <div>
      {apps.map((a) => (
        <div key={a._id} className="border p-3 mb-2 rounded">
          <p>{a.user.name}</p>
          <p>{a.user.email}</p>

          <a href={a.resume} target="_blank">
            View Resume
          </a>

          <div className="flex gap-2 mt-2">
            <button onClick={() => updateStatus(a._id, "accepted")}>
              Accept
            </button>
            <button onClick={() => updateStatus(a._id, "rejected")}>
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Applicants;

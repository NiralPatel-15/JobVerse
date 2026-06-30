import axios from "../../api/axiosConfig";
import { toast } from "react-toastify";

const statuses = ["shortlisted", "interview", "accepted", "rejected"];

const ApplicationStatusActions = ({ applicationId, refreshApplicants }) => {
  const updateStatus = async (status) => {
    try {
      await axios.put(`/applications/status/${applicationId}`, { status });

      toast.success("Status updated");

      refreshApplicants();
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => updateStatus(status)}
          className="px-3 py-2 rounded-xl bg-black text-white text-sm hover:scale-105 transition-all"
        >
          {status}
        </button>
      ))}
    </div>
  );
};

export default ApplicationStatusActions;
 
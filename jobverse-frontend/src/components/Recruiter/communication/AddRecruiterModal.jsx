import { useEffect, useState } from "react";
import { searchRecruiters } from "../../../services/channelService";
import { sendChannelInvitation } from "../../../services/channelInvitationService";
import { toast } from "react-toastify";

const AddRecruiterModal = ({ isOpen, onClose, channel, onRecruiterAdded }) => {
  const [keyword, setKeyword] = useState("");

  const [recruiters, setRecruiters] = useState([]);

  const [loading, setLoading] = useState(false);

  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    if (!isOpen || !channel?._id) return;

    const fetchRecruiters = async () => {
      try {
        setLoading(true);

        const res = await searchRecruiters(channel._id, keyword);

        setRecruiters(res.data.recruiters || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchRecruiters, 300);

    return () => clearTimeout(timer);
  }, [keyword, channel, isOpen]);

  const handleAddRecruiter = async (recruiterId) => {
    try {
      setAddingId(recruiterId);

      await sendChannelInvitation(channel._id, recruiterId);
      

      setRecruiters((prev) => prev.filter((user) => user._id !== recruiterId));

      if (onRecruiterAdded) {
        onRecruiterAdded();
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || "Failed to send invitation",
      );
    } finally {
      setAddingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl">
        {/* HEADER */}

        <div className="p-5 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Invite Recruiter</h2>

            <p className="text-sm text-gray-500">{channel?.name}</p>
          </div>

          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>

        {/* SEARCH */}

        <div className="p-5 border-b">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search recruiter..."
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* BODY */}

        <div className="max-h-[450px] overflow-y-auto">
          {loading ? (
            <div className="py-10 text-center">Loading recruiters...</div>
          ) : recruiters.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No recruiters found
            </div>
          ) : (
            recruiters.map((recruiter) => (
              <div
                key={recruiter._id}
                className="flex items-center justify-between px-5 py-4 border-b"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={recruiter.profilePic || "/user.png"}
                    alt={recruiter.f_name}
                    onError={(e) => {
                      e.target.src = "/user.png";
                    }}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div>
                    <h3 className="font-medium">{recruiter.f_name}</h3>

                    <p className="text-sm text-gray-500">{recruiter.email}</p>

                    <p className="text-xs text-gray-400">
                      {recruiter.curr_company || "Company not specified"}
                    </p>
                  </div>
                </div>

                <button
                  disabled={addingId === recruiter._id}
                  onClick={() => handleAddRecruiter(recruiter._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {addingId === recruiter._id ? "Sending..." : "Invite"}
                </button>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}

        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecruiterModal;
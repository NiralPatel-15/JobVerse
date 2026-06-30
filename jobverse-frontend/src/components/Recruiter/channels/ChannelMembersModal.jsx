import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {
  getChannelMembers,
  removeChannelMember,
} from "../../../services/channelService";
import AddRecruiterModal from "./AddRecruiterModal";
import channelSocket from "../../../socket/channelSocket";

const ChannelMembersModal = ({ isOpen, onClose, channel }) => {
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showAddRecruiterModal, setShowAddRecruiterModal] = useState(false);

  const fetchMembers = useCallback(async () => {
    if (!channel?._id) return;

    try {
      setLoading(true);

      const res = await getChannelMembers(channel._id);

      setMembers(res.data.members || []);
    } catch (error) {
      console.error("Failed to fetch members:", error);

      toast.error("Failed to load channel members");
    } finally {
      setLoading(false);
    }
  }, [channel]);

  useEffect(() => {
    if (!isOpen || !channel?._id) return;

    fetchMembers();
  }, [isOpen, channel, fetchMembers]);

  const handleRemoveMember = async (memberId) => {
    const result = await Swal.fire({
      title: "Remove Member?",
      text: "This recruiter will be removed from the channel",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Remove",
    });

    if (!result.isConfirmed) return;

    try {
      await removeChannelMember(channel._id, memberId);

      channelSocket.emit("channelMemberRemoved", {
        channelId: channel._id,
      });

      setMembers((prev) => prev.filter((member) => member._id !== memberId));

      toast.success("Member removed successfully");
    } catch (error) {
      console.error("Failed to remove member:", error);

      toast.error("Failed to remove member");
    }
  };

  useEffect(() => {
    const handleMembersUpdated = (updatedMembers) => {
      setMembers(updatedMembers);
    };

    channelSocket.on("channelMembersUpdated", handleMembersUpdated);

    return () => {
      channelSocket.off("channelMembersUpdated", handleMembersUpdated);
    };
  }, []);

  

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl">
          {/* HEADER */}

          <div className="flex justify-between items-center p-5 border-b">
            <div>
              <h2 className="text-xl font-semibold">Channel Members</h2>

              <p className="text-sm text-gray-500">{channel?.name}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddRecruiterModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Add Recruiter
              </button>

              <button
                onClick={onClose}
                className="text-gray-500 hover:text-black text-xl"
              >
                ×
              </button>
            </div>
          </div>

          {/* BODY */}

          <div className="p-5 max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-10">Loading members...</div>
            ) : members.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No members found
              </div>
            ) : (
              members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between border-b py-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.profilePic || "/user.png"}
                      onError={(e) => {
                        e.target.src = "/user.png";
                      }}  
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />

                    <div>
                      <div className="font-medium">
                        {member.f_name || member.name || "Unnamed User"}
                      </div>

                      <div className="text-sm text-gray-500">
                        {member.email}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveMember(member._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {/* FOOTER */}

          <div className="border-t p-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <AddRecruiterModal
        isOpen={showAddRecruiterModal}
        onClose={() => setShowAddRecruiterModal(false)}
        channel={channel}
        onRecruiterAdded={fetchMembers}
      />
    </>
  );
};

export default ChannelMembersModal;

import { useEffect, useState } from "react";

import {
  getPendingInvitations,
  acceptInvitation,
  rejectInvitation,
} from "../../../services/channelInvitationService";

const ChannelInvitationsModal = ({ isOpen, onClose }) => {
  const [invitations, setInvitations] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchInvitations = async () => {
    try {
      setLoading(true);

      const res = await getPendingInvitations();

      setInvitations(res.data.invitations || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchInvitations();
    }
  }, [isOpen]);

  const handleAccept = async (invitationId) => {
    try {
      await acceptInvitation(invitationId);

      setInvitations((prev) => prev.filter((inv) => inv._id !== invitationId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (invitationId) => {
    try {
      await rejectInvitation(invitationId);

      setInvitations((prev) => prev.filter((inv) => inv._id !== invitationId));
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl">
        {/* HEADER */}

        <div className="p-5 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Channel Invitations</h2>

            <p className="text-sm text-gray-500">Pending invitations</p>
          </div>

          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>

        {/* BODY */}

        <div className="max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="py-10 text-center">Loading invitations...</div>
          ) : invitations.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No pending invitations
            </div>
          ) : (
            invitations.map((invitation) => (
              <div key={invitation._id} className="p-5 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">
                      #{invitation.channel?.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Invited by {invitation.invitedBy?.f_name}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(invitation._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleReject(invitation._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
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

export default ChannelInvitationsModal;

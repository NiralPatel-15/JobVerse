import { useState } from "react";

import { Users } from "lucide-react";

import { getPendingInvitations } from "../../../services/channelInvitationService";

import ChannelInvitationsModal from "./ChannelInvitationsModal";

const InvitationBell = () => {
  const [open, setOpen] = useState(false);

  const [count, setCount] = useState(0);

  const handleOpen = async () => {
    try {
      const res = await getPendingInvitations();

      setCount(res.data.invitations?.length || 0);

      setOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = async () => {
    try {
      const res = await getPendingInvitations();

      setCount(res.data.invitations?.length || 0);
    } catch (error) {
      console.error(error);
    }

    setOpen(false);
  };

  return (
    <>
      <button onClick={handleOpen} className="relative">
        <Users size={22} />

        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      <ChannelInvitationsModal isOpen={open} onClose={handleClose} />
    </>
  );
};

export default InvitationBell;

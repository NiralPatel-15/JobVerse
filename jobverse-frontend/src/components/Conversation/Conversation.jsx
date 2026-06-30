import React, { useMemo } from "react";

const Conversation = ({
  item,
  ownData,
  handleSelectedConv,
  activeConvId,
  onlineUsers,
}) => {
  const ownId = ownData?._id;

  // ✅ FIX: Memoize memberData
  const memberData = useMemo(() => {
    return item?.members?.find((it) => it._id !== ownId) || {};
  }, [item, ownId]);

  const handleClickFunc = () => {
    handleSelectedConv(item?._id, item);
  };

  // ✅ Online check
  const isOnline = useMemo(() => {
    return onlineUsers?.some((user) => user.userId === memberData?._id);
  }, [onlineUsers, memberData]);

  return (
    <div
      onClick={handleClickFunc}
      className={`flex items-center w-full cursor-pointer border-b border-gray-300 gap-3 p-4 hover:bg-gray-200 ${
        activeConvId === item?._id ? "bg-gray-200" : ""
      }`}
    >
      <div className="shrink-0">
        <div className="relative">
          <img
            className="w-12 h-12 rounded-full cursor-pointer"
            src={memberData?.profilePic || "/user.png"}
            alt="User"
            onError={(e) => (e.target.src = "/user.png")}
          />

          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          ></span>
        </div>
      </div>

      <div>
        <div className="text-md">{memberData?.f_name || "Unknown User"}</div>
        <div className="text-sm text-gray-500">
          {memberData?.headline || ""}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Conversation);
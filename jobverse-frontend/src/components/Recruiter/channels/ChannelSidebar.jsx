const ChannelSidebar = ({
  channels,
  selectedChannel,
  setSelectedChannel,
  onCreateChannel,
}) => {
  return (
    <div className="w-80 bg-white border-r flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">Channels</h2>

        <button
          onClick={onCreateChannel}
          className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
        >
          +
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {channels.map((channel) => (
          <div
            key={channel._id}
            onClick={() => setSelectedChannel(channel)}
            className={`p-4 cursor-pointer border-b
              ${
                selectedChannel?._id === channel._id
                  ? "bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
          >
            <div className="font-medium"># {channel.name}</div>

            <div className="text-sm text-gray-500">
              {channel.members?.length || 0} members
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelSidebar;

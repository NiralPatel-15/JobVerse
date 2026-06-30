const RecruiterNoteCard = ({ note }) => {
  return (
    <div className="border border-gray-200 rounded-2xl p-4 hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <img
          src={note.recruiter?.profileImage || "/user.png"}
          alt=""
          className="w-10 h-10 rounded-full object-cover"
        />

        <div>
          <h4 className="font-semibold text-gray-800">
            {note.recruiter?.name}
          </h4>

          <p className="text-xs text-gray-500">Internal Recruiter Note</p>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-700 whitespace-pre-wrap">
        {note.content}
      </div>

      <div className="mt-4 text-xs text-gray-400">
        {new Date(note.createdAt).toLocaleString()}
      </div>
    </div>
  );
};

export default RecruiterNoteCard;

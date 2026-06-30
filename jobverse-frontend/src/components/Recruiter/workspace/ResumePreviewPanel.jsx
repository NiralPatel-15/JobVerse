const ResumePreviewPanel = ({ application }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Resume Preview</h2>

        <a
          href={application.resume}
          target="_blank"
          rel="noreferrer"
          className="bg-indigo-600 hover:bg-indigo-700 transition px-5 py-2 rounded-2xl text-sm text-white"
        >
          Open Resume
        </a>
      </div>

      <iframe
        src={application.resume}
        title="resume"
        className="w-full h-[850px] bg-white"
      />
    </div>
  );
};

export default ResumePreviewPanel;
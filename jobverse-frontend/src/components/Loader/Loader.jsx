import React, { memo } from "react";

const Loader = () => {
  return (
    <div
      className="fixed inset-0 bg-white flex flex-col justify-center items-center z-50"
      role="status"
      aria-live="polite"
    >
      {/* LOGO */}
      <div className="text-5xl font-bold text-blue-700 tracking-wide animate-pulse">
        Job<span className="text-gray-800">Verse</span>
      </div>

      {/* LOADING BAR */}
      <div className="w-52 h-1 bg-gray-200 mt-6 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 animate-pulse w-full"></div>
      </div>

      {/* OPTIONAL TEXT */}
      <div className="text-sm text-gray-500 mt-3 animate-pulse">
        Loading your feed...
      </div>
    </div>
  );
};

export default memo(Loader);
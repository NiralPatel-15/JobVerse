import React from "react";

const Card = ({ children, padding = true, className = "", ...rest }) => {
  return (
    <div
      className={`
        w-full
        bg-white
        border border-gray-300
        rounded-md
        overflow-hidden   /* 🔥 IMPORTANT */
        ${className}
      `}
      {...rest}
    >
      <div className={padding ? "p-4 w-full" : "w-full"}>{children}</div>
    </div>
  );
};

export default React.memo(Card);
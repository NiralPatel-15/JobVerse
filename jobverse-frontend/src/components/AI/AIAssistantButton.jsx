import React from "react";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const AIAssistantButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
      fixed
      bottom-6
      right-6
      z-[9999]
      bg-blue-600
      text-white
      p-4
      rounded-full
      shadow-xl
      hover:scale-105
      transition-all
      "
    >
      <SmartToyIcon />
    </button>
  ); 
};

export default AIAssistantButton;

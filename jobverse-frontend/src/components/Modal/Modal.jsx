import React, { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";

const Modal = ({ children, closeModal, title }) => {
  // ✅ Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closeModal && closeModal();
      }
    };

    document.addEventListener("keydown", handleEsc);

    // ✅ Disable background scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [closeModal]);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
      onClick={() => closeModal && closeModal()}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white p-5 rounded-lg w-[90%] max-w-2xl relative shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">{title}</h2>

          {/* ✅ Accessible button */}
          <button
            onClick={() => closeModal && closeModal()}
            className="cursor-pointer p-1 hover:bg-gray-200 rounded"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* CONTENT */}
        <div className="max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default React.memo(Modal);
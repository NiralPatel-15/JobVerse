import axios from "axios";
import React, { useState, useEffect, memo } from "react";
import { toast } from "react-toastify";

const ImageModal = ({
  isCircular,
  image,
  selfData,
  handleEditFunc,
  closeModal,
}) => {
  const [preview, setPreview] = useState(image);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // ✅ TYPE VALIDATION
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    // ✅ SIZE VALIDATION (max 2MB)
    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    // ✅ CLEAN OLD PREVIEW
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // ✅ CLEANUP
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSubmit = async () => {
    if (!file) {
      toast.warning("Please upload an image");
      return;
    }

    if (!selfData) return;

    if (!CLOUDINARY_URL) {
      toast.error("Cloudinary URL not configured");
      console.error("❌ Missing VITE_CLOUDINARY_URL");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "JobVerse");

    try {
      const response = await axios.post(CLOUDINARY_URL, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = response.data.secure_url;

      let updatedData = { ...selfData };

      if (isCircular) {
        updatedData.profilePic = imageUrl;
      } else {
        updatedData.cover_pic = imageUrl;
      }

      await handleEditFunc(updatedData);

      toast.success("Image updated successfully");
      closeModal();
    } catch (err) {
      console.error("Upload Error:", err.response || err);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <img
        src={preview}
        alt="Image preview"
        className={`${
          isCircular
            ? "w-48 h-48 rounded-full object-cover"
            : "w-full max-w-2xl h-64 object-contain bg-gray-100 rounded-lg"
        }`}
      />

      <div className="flex gap-4 mt-5">
        <label
          htmlFor="fileInput"
          className="px-4 py-2 bg-blue-900 text-white rounded-xl cursor-pointer hover:bg-blue-800"
        >
          Upload
        </label>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-green-700 text-white rounded-xl hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Submit"}
        </button>
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="fileInput"
        onChange={handleChange}
      />
    </div>
  );
};

export default memo(ImageModal);
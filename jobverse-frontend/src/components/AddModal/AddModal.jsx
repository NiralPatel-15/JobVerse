import React, { useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import { toast } from "react-toastify";
import API from "../../utils/api";

const AddModal = (props) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handlePost = async () => {
    if (desc.trim().length === 0 && !imageUrl) {
      return toast.error("Please enter any field ❌");
    }

    try {
      setLoading(true);

      await API.post("/post", {
        desc,
        imageLink: imageUrl, // ✅ FIXED
      });

      toast.success("Post added successfully ✅");

      setDesc("");
      setImageUrl(null);

      // Wait for the feed to refresh first
      if (props?.onPostSuccess) {
        await props.onPostSuccess();
      }

      // Close the modal after the feed updates
      props?.closeModal?.();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to post ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed ❌");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB ❌");
      return;
    }

    const data = new FormData();
    data.append("image", file);

    try {
      setUploading(true);

      const response = await API.post("/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImageUrl(response.data.imageUrl);
      toast.success("Image uploaded ✅");
    } catch (err) {
      console.error(err); // optional for debugging
      toast.error(err?.response?.data?.error || "Upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-xl z-10">
          Posting...
        </div>
      )}

      <div className="flex gap-4 items-center mb-4">
        <img
          className="w-12 h-12 rounded-full"
          alt="user"
          src={
            props?.personalData?.profilePic ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
        />
        <div className="text-lg font-semibold">
          {props?.personalData?.f_name}
        </div>
      </div>

      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        rows={6}
        maxLength={500}
        placeholder="What do you want to talk about?"
        className="w-full outline-none text-lg resize-none"
      />

      <p className="text-sm text-gray-400 text-right">{desc.length}/500</p>

      {imageUrl && (
        <div className="mt-4 relative">
          <img
            src={imageUrl}
            alt="preview"
            className="w-full max-h-72 object-cover rounded-xl border"
          />
          <div
            onClick={() => setImageUrl(null)}
            className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded cursor-pointer"
          >
            ✕
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <label className="cursor-pointer">
          <div className="flex items-center gap-2 text-blue-600 font-medium">
            {uploading ? "Uploading..." : <ImageIcon />}
            {!uploading && "Photo"}
          </div>

          <input
            onChange={handleUploadImage}
            type="file"
            accept="image/*"
            className="hidden"
          />
        </label>

        <div
          onClick={!loading && !uploading ? handlePost : null}
          className={`bg-blue-950 text-white py-1 px-4 rounded-2xl transition ${
            loading || uploading
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-blue-800"
          }`}
        >
          {loading ? "Posting..." : "Post"}
        </div>
      </div>
    </div>
  );
};

export default AddModal;
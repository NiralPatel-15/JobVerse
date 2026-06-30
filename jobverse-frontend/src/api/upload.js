import axios from "axios";

const API = import.meta.env.VITE_API_URL || "https://jobverse-api.onrender.com";

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(
      `${API}/api/upload/profile`, // ✅ FIXED ROUTE
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      },
    );

    return res.data.url; // ✅ FIXED KEY
  } catch (error) {
    console.error("Upload Error:", error.response?.data || error.message);
    throw error;
  }
};

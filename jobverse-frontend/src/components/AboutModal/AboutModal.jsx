// import axios from "axios";
import React, { useState } from "react";
// import { toast } from "react-toastify";

const AboutModal = ({ handleEditFunc, selfData, closeModal }) => {
  const [data, setData] = useState({
    about: selfData?.about || "",
    skillInp: selfData?.skills?.join(",") || "",
    resume: selfData?.resume || "",
  });

  // const [loading, setLoading] = useState(false);

  // HANDLE INPUT CHANGE
  const onChangeHandle = (event, key) => {
    setData((prev) => ({
      ...prev,
      [key]: event.target.value,
    }));
  };

  // FILE UPLOAD
  // const handleInput = async (e) => {
  //   const files = e.target.files;

  //   if (!files || !files[0]) return;

  //   // ✅ FIXED FILE VALIDATION
  //   const allowedTypes = [
  //     "application/pdf",
  //     "application/msword",
  //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //   ];

  //   if (!allowedTypes.includes(files[0].type)) {
  //     toast.error("Only PDF or Word files are allowed ❌");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("file", files[0]);
  //   formData.append("upload_preset", "JobVerse");

  //   try {
  //     setLoading(true);

  //     const response = await axios.post(
  //       "https://api.cloudinary.com/v1_1/dllvqskon/auto/upload", // ✅ changed to auto
  //       formData,
  //     );

  //     const fileUrl = response.data.secure_url;

  //     // UPDATE STATE
  //     setData((prev) => ({
  //       ...prev,
  //       resume: fileUrl,
  //     }));

  //     toast.success("Uploaded Successfully ✅");
  //   } catch (err) {
  //     console.log(err);
  //     toast.error("Upload failed ❌");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // SAVE DATA
  const handleOnSave = async () => {
    let arr = data?.skillInp
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    let newData = {
      ...selfData,
      about: data.about,
      skills: arr,
      resume: data.resume,
    };

    await handleEditFunc(newData);

    if (closeModal) {
      closeModal();
    }
  };

  return (
    <div className="my-8">
      {/* ABOUT */}
      <div className="w-full mb-4">
        <label className="font-semibold">About</label>
        <textarea
          value={data.about}
          onChange={(e) => onChangeHandle(e, "about")}
          className="p-2 mt-1 w-full border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        ></textarea>
      </div>

      {/* SKILLS */}
      <div className="w-full mb-4">
        <label className="font-semibold">
          Skills *(Add by separating comma)
        </label>
        <textarea
          className="p-2 mt-1 w-full border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={data.skillInp}
          onChange={(e) => onChangeHandle(e, "skillInp")}
        ></textarea>
      </div>

      {/* RESUME */}
      {/* <div className="w-full mb-4">
        <label
          htmlFor="resumeUpload"
          className="inline-block p-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg cursor-pointer"
        >
          {loading ? "Uploading..." : "Upload Resume"}
        </label>

        <input
          onChange={handleInput}
          type="file"
          className="hidden"
          id="resumeUpload"
        />

        {data.resume && (
          <div className="my-2 text-green-600 text-sm">
            Uploaded Successfully
          </div>
        )}
      </div> */}

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={handleOnSave}
          className="bg-blue-900 hover:bg-blue-950 text-white px-5 py-2 rounded-xl transition duration-200"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AboutModal;

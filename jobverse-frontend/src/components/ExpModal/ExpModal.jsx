import React, { useState } from "react";
import { toastError } from "../../utils/toast";

const ExpModal = ({
  handleEditFunc,
  selfData,
  closeModal,
  updateExp,
  setUpdateExp,
}) => {
  const [data, setData] = useState({
    designation: updateExp?.data?.designation || "",
    company_name: updateExp?.data?.company_name || "",
    duration: updateExp?.data?.duration || "",
    location: updateExp?.data?.location || "",
  });

  const onChangeHandle = (event, key) => {
    const value = event.target.value;
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const isValid = () => {
    return (
      data.designation.trim() && data.duration.trim() && data.location.trim()
    );
  };

  const updateExpSave = async () => {
    if (!selfData || !updateExp?.data?._id) return;

    if (!isValid()) {
      toastError("Please fill all required fields");
      return;
    }

    const updatedExperience = (selfData.experience || []).map((item) =>
      item._id === updateExp.data._id ? { ...item, ...data } : item,
    );

    const newData = {
      ...selfData,
      experience: updatedExperience,
    };

    await handleEditFunc(newData);

    closeModal && closeModal();
    setUpdateExp && setUpdateExp({ clicked: false, data: null });
  };

  const handleOnSave = async () => {
    if (!selfData) return;

    if (updateExp?.clicked) return updateExpSave();

    if (!isValid()) {
      toastError("Please fill all required fields");
      return;
    }

    const expArr = [...(selfData.experience || []), data];

    const newData = {
      ...selfData,
      experience: expArr,
    };

    await handleEditFunc(newData);

    closeModal && closeModal();
  };

  const handleOnDelete = async () => {
    if (!selfData || !updateExp?.data?._id) return;

    const newFilteredData = (selfData.experience || []).filter(
      (item) => item._id !== updateExp.data._id,
    );

    const newData = {
      ...selfData,
      experience: newFilteredData,
    };

    await handleEditFunc(newData);

    closeModal && closeModal();
    setUpdateExp && setUpdateExp({ clicked: false, data: null });
  };

  return (
    <div className="mt-8 w-full h-87.5 overflow-auto">
      <div className="w-full mb-4">
        <label>Role*</label>
        <input
          value={data.designation}
          onChange={(e) => onChangeHandle(e, "designation")}
          type="text"
          className="p-2 mt-1 w-full border rounded-md"
          placeholder="Enter Role"
        />
      </div>

      <div className="w-full mb-4">
        <label>Company</label>
        <input
          value={data.company_name}
          onChange={(e) => onChangeHandle(e, "company_name")}
          type="text"
          className="p-2 mt-1 w-full border rounded-md"
          placeholder="Enter Company Name"
        />
      </div>

      <div className="w-full mb-4">
        <label>Duration*</label>
        <input
          value={data.duration}
          onChange={(e) => onChangeHandle(e, "duration")}
          type="text"
          className="p-2 mt-1 w-full border rounded-md"
          placeholder="Enter Duration"
        />
      </div>

      <div className="w-full mb-4">
        <label>Place*</label>
        <input
          value={data.location}
          onChange={(e) => onChangeHandle(e, "location")}
          type="text"
          className="p-2 mt-1 w-full border rounded-md"
          placeholder="Enter Place"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={handleOnSave}
          className="bg-blue-900 hover:bg-blue-950 text-white px-5 py-2 rounded-xl transition duration-200"
        >
          Save
        </button>

        {updateExp?.clicked && (
          <button
            onClick={handleOnDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl transition duration-200"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ExpModal;

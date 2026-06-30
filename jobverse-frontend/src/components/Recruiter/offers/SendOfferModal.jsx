import { useState } from "react";
import axios from "../../../api/axiosConfig";

const SendOfferModal = ({ application, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    salary: "",
    joiningDate: "",
    message: "",
  });

  const submitOffer = async () => {
    try {
      await axios.post(`/offers/send/${application._id}`, form);

      onSuccess();
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-3xl p-6 w-[600px]">
        <h2 className="text-2xl font-bold mb-6">Send Offer Letter</h2>

        <div className="space-y-4">
          <input
            placeholder="Offer Title"
            className="w-full border p-3 rounded-xl"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
          />

          <input
            placeholder="Salary"
            className="w-full border p-3 rounded-xl"
            value={form.salary}
            onChange={(e) =>
              setForm({
                ...form,
                salary: e.target.value,
              })
            }
          />

          <input
            type="date"
            className="w-full border p-3 rounded-xl"
            value={form.joiningDate}
            onChange={(e) =>
              setForm({
                ...form,
                joiningDate: e.target.value,
              })
            }
          />

          <textarea
            rows={5}
            placeholder="Offer Message"
            className="w-full border p-3 rounded-xl"
            value={form.message}
            onChange={(e) =>
              setForm({
                ...form,
                message: e.target.value,
              })
            }
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-5 py-2 border rounded-xl">
            Cancel
          </button>

          <button
            onClick={submitOffer}
            className="px-5 py-2 bg-green-600 text-white rounded-xl"
          >
            Send Offer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendOfferModal;

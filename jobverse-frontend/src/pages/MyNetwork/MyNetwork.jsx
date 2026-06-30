import React, { useState, useEffect, useCallback } from "react";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import axios from "axios";
import { toast } from "react-toastify";

const MyNetwork = () => {
  const [activeTab, setActiveTab] = useState("friends");

  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);

  const [friendsLoaded, setFriendsLoaded] = useState(false);
  const [pendingLoaded, setPendingLoaded] = useState(false);

  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://localhost:4000";

  // ✅ STABLE FUNCTION (FIXED)
  const fetchFriendList = useCallback(async () => {
    if (friendsLoaded) return;

    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/api/auth/friendList`, {
        withCredentials: true,
      });

      setFriends(res.data.friends || []);
      setFriendsLoaded(true);
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went Wrong");
    } finally {
      setLoading(false);
    }
  }, [friendsLoaded]);

  // ✅ STABLE FUNCTION
  const fetchPendingRequest = useCallback(async () => {
    if (pendingLoaded) return;

    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/api/auth/pendingFriendsList`, {
        withCredentials: true,
      });

      setPending(res.data.pendingFriends || []);
      setPendingLoaded(true);
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went Wrong");
    } finally {
      setLoading(false);
    }
  }, [pendingLoaded]);

  // ✅ NO ESLINT ERROR NOW
  useEffect(() => {
    fetchFriendList();
  }, [fetchFriendList]);

  // ✅ TAB SWITCH
  const handleTabChange = (tab) => {
    setActiveTab(tab);

    if (tab === "friends") {
      fetchFriendList();
    } else {
      fetchPendingRequest();
    }
  };

  // ✅ ACCEPT REQUEST (SAFE)
  const acceptRequest = async (id) => {
    try {
      await axios.post(
        `${BASE_URL}/api/auth/acceptFriendReq`,
        { friendId: id },
        { withCredentials: true },
      );

      toast.success("Friend added 🎉");

      const acceptedUser = pending.find((p) => p._id === id);

      setPending((prev) => prev.filter((item) => item._id !== id));

      if (acceptedUser) {
        setFriends((prev) => [...prev, acceptedUser]);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Error");
    }
  };

  const currentData = activeTab === "friends" ? friends : pending;

  return (
    <div className="mt-20 px-5 xl:px-40 w-full bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="bg-white border border-gray-300 rounded-lg px-6 py-3 flex justify-between items-center my-6">
        <div className="text-lg font-medium text-gray-700">
          {activeTab === "friends"
            ? "Catch up with friends"
            : "Pending request"}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleTabChange("friends")}
            className={`px-3 py-1 text-sm border rounded-md ${
              activeTab === "friends" ? "bg-blue-800 text-white" : ""
            }`}
          >
            Friends
          </button>

          <button
            onClick={() => handleTabChange("pending")}
            className={`px-3 py-1 text-sm border rounded-md ${
              activeTab === "pending" ? "bg-blue-800 text-white" : ""
            }`}
          >
            Pending request
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex min-h-[60vh] w-full gap-7 flex-wrap justify-center">
        {/* LOADING */}
        {loading && <div>Loading...</div>}

        {/* DATA */}
        {!loading &&
          currentData.map((item) => (
            <div key={item._id} className="md:w-[23%] sm:w-full">
              <ProfileCard data={item} />

              {activeTab === "pending" && (
                <div className="mt-2 flex justify-center">
                  <button
                    onClick={() => acceptRequest(item._id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Accept
                  </button>
                </div>
              )}
            </div>
          ))}

        {/* EMPTY STATE */}
        {!loading && currentData.length === 0 && (
          <div>
            {activeTab === "friends" ? "No Friends yet" : "No Pending Requests"}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNetwork;

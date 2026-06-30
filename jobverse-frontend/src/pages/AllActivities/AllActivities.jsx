import React, { useState, useEffect } from "react";
import Advertisment from "../../components/Advertisment/Advertisment";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import Card from "../../components/Card/Card";
import Post from "../../components/Post/Post";
import { useParams } from "react-router-dom";
import axios from "axios";

const AllActivities = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const { id } = useParams();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ NEW
  const [error, setError] = useState(""); // ✅ NEW

  useEffect(() => {
    let isMounted = true; // ✅ prevent memory leak

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/post/getAllPostForUser?userId=${id}`,
        );

        if (isMounted) {
          setPosts(res.data.posts || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.error || "Something went wrong");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) fetchData();
    

    return () => {
      isMounted = false; // ✅ cleanup
    };
  }, [id]);

  return (
    <div className="px-5 xl:px-40 flex gap-5 w-full mt-16 bg-gray-100 min-h-screen">
      {/* LEFT */}
      <div className="w-[22%] hidden md:flex flex-col gap-4 py-5 sticky top-24 h-fit">
        {posts.length > 0 && <ProfileCard data={posts[0].user} />}
      </div>

      {/* CENTER */}
      <div className="flex-1 py-5">
        <Card>
          <div className="text-xl font-semibold mb-4">All activity</div>

          {/* TABS */}
          <div className="flex gap-3 mb-4 flex-wrap">
            {["posts", "comments", "images", "reactions"].map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1 rounded-full cursor-pointer text-sm capitalize border
                  ${
                    activeTab === tab
                      ? "bg-green-700 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {tab}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {/* ✅ LOADING */}
            {loading && (
              <div className="text-center text-gray-500 py-10">Loading...</div>
            )}

            {/* ❌ ERROR */}
            {!loading && error && (
              <div className="text-center text-red-500 py-10">{error}</div>
            )}

            {/* ✅ POSTS */}
            {!loading && !error && activeTab === "posts" && (
              <>
                {posts.length > 0 ? (
                  posts.map((p) => <Post key={p._id} item={p} />)
                ) : (
                  <div className="text-center text-gray-500 py-10">
                    No posts found
                  </div>
                )}
              </>
            )}

            {/* COMMENTS */}
            {!loading && activeTab === "comments" && (
              <div className="text-gray-600 text-center py-10">
                No comments yet
              </div>
            )}

            {/* IMAGES */}
            {!loading && activeTab === "images" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <img src="/banner1.png" alt="activity" className="rounded-lg" />
                <img src="/banner1.png" alt="activity" className="rounded-lg" />
                <img src="/banner1.png" alt="activity" className="rounded-lg" />
              </div>
            )}

            {/* REACTIONS */}
            {!loading && activeTab === "reactions" && (
              <div className="text-gray-600 text-center py-10">
                No reactions yet
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* RIGHT */}
      <div className="my-5 sticky top-20">
        <Advertisment />
      </div>
    </div>
  );
};

export default AllActivities;
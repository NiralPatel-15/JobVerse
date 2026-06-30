import React, { useState, useEffect } from "react";
import Card from "../../components/Card/Card";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import ArticleIcon from "@mui/icons-material/Article";
import Advertisment from "../../components/Advertisment/Advertisment";
import Post from "../../components/Post/Post";
import Modal from "../../components/Modal/Modal";
import AddModal from "../../components/AddModal/AddModal";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Feeds = () => {
  const [personalData, setPersonalData] = useState(null);
  const [post, setPost] = useState([]);
  const [addPostModal, setAddPostModel] = useState(false);
  const isRecruiter =
    personalData?.role === "recruiter" ||
    personalData?.role === "recruiter_manager";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ MOVE THIS OUTSIDE (so it can be reused)
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const [userData, postData] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/auth/self`, {
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/post/getAllPost`, {
          withCredentials: true,
        }),
      ]);

      setPersonalData(userData.data.user);
      setPost(postData.data.posts || []);
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("isLogin");

        window.dispatchEvent(new Event("logout"));
      } else {
        setError(err?.response?.data?.error || "Something went wrong");
        toast.error(err?.response?.data?.error || "Something went wrong");
      }
    } finally {
      setLoading(false); // ✅ THIS WAS MISSING
    }
  }; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchPosts();
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleOpenPostModal = () => {
    setAddPostModel((prev) => !prev);
  };
  
  const handleDeletePost = (postId) => {
    setPost((prev) => prev.filter((p) => p._id !== postId));
  };

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen mt-16">
      <div className="w-full max-w-[1100px] mx-auto flex gap-5 px-4 items-start">
        {/* LEFT */}
        <div className="hidden lg:flex flex-col gap-4 w-[250px] shrink-0 sticky top-24 h-fit py-5">
          <ProfileCard data={personalData} />

          <Card>
            <div className="flex justify-between text-sm py-1">
              <span className="text-gray-600">Profile Viewers</span>
              <span className="text-blue-700 font-semibold">56</span>
            </div>

            <div className="flex justify-between text-sm py-1">
              <span className="text-gray-600">Post Impressions</span>
              <span className="text-blue-700 font-semibold">160</span>
            </div>
          </Card>
        </div>

        {/* CENTER */}
        {/* CENTER */}
        <div className="flex-1 min-w-0 max-w-[600px] py-5 flex flex-col gap-5">
          {/* FEED HEADER */}
          <Card>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                JobVerse Community
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Share projects, achievements, certifications and career updates.
              </p>
            </div>
          </Card>

          {isRecruiter && (
            <Card>
              <div className="text-sm text-gray-600">
                Stay updated with candidate achievements, certifications,
                projects and career milestones.
              </div>
            </Card>
          )}

          {/* CREATE POST - ONLY FOR CANDIDATES */}
          {!isRecruiter && (
            <Card>
              <div className="flex gap-2 items-center">
                <img
                  src={personalData?.profilePic || "/default.png"}
                  className="rounded-full w-12 h-12 border-2 border-white object-cover"
                  alt="user"
                />

                <div
                  onClick={handleOpenPostModal}
                  className="w-full border py-3 px-4 rounded-full cursor-pointer hover:bg-gray-100 transition"
                >
                  Share your project, achievement or career update...
                </div>
              </div>

              <div className="w-full flex mt-3">
                <div
                  onClick={handleOpenPostModal}
                  className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-1/3 hover:bg-gray-100"
                >
                  <VideoCallIcon sx={{ color: "green" }} />
                  Video
                </div>

                <div
                  onClick={handleOpenPostModal}
                  className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-1/3 hover:bg-gray-100"
                >
                  <InsertPhotoIcon sx={{ color: "blue" }} />
                  Photo
                </div>

                <div
                  onClick={handleOpenPostModal}
                  className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-1/3 hover:bg-gray-100"
                >
                  <ArticleIcon sx={{ color: "orange" }} />
                  Article
                </div>
              </div>
            </Card>
          )}

          {/* LOADING */}
          {loading && (
            <Card>
              <div className="text-center py-10 text-gray-500">
                Loading community posts...
              </div>
            </Card>
          )}

          {/* ERROR */}
          {!loading && error && (
            <Card>
              <div className="text-center py-8 text-red-500">{error}</div>
            </Card>
          )}

          {/* POSTS */}
          {!loading && !error && (
            <div className="flex flex-col gap-5">
              {post.length > 0 ? (
                post.map((item) => (
                  <Post
                    item={item}
                    key={item._id}
                    personalData={personalData}
                    onDelete={handleDeletePost}
                  />
                ))
              ) : (
                <Card>
                  <div className="text-center py-10">
                    <div className="text-lg font-semibold text-gray-700">
                      No posts yet
                    </div>

                    <div className="text-sm text-gray-500 mt-2">
                      Be the first to share something with the JobVerse
                      community.
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="hidden lg:block w-[250px] shrink-0 py-5">
          <Card padding={1}>
            <div className="text-xl font-semibold">JobVerse Updates</div>

            <div className="text-gray-600 text-sm mt-2">
              • New jobs posted daily
            </div>

            <div className="text-gray-600 text-sm">
              • Track interviews easily
            </div>

            <div className="text-gray-600 text-sm">
              • Manage offers seamlessly
            </div>

            <div className="text-gray-600 text-sm">• Improve ATS scores</div>
          </Card>

          <div className="my-5 sticky top-20">
            <Advertisment />
          </div>
        </div>
      </div>

      {addPostModal && (
        <Modal closeModal={handleOpenPostModal} title={""}>
          <AddModal
            personalData={personalData}
            closeModal={handleOpenPostModal}
            onPostSuccess={fetchPosts} // ✅ now works
          />
        </Modal>
      )}

      <ToastContainer />
    </div>
  );
};

export default Feeds;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Card from "../../components/Card/Card";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import Advertisment from "../../components/Advertisment/Advertisment";
import Post from "../../components/Post/Post";
import { toast } from "react-toastify";

const PostDetails = () => {
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [personalData, setPersonalData] = useState(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://localhost:4000";

  useEffect(() => {
    if (!postId) return;

    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);

        const [userRes, postRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/auth/self`, {
            withCredentials: true,
            signal: controller.signal,
          }),
          axios.get(`${BASE_URL}/api/post/getPostById/${postId}`, {
            signal: controller.signal,
          }),
        ]);

        setPersonalData(userRes.data?.user || userRes.data?.own || null);
        setPost(postRes.data?.post || null);
      } catch (err) {
        if (err.name !== "CanceledError") {
          toast.error(err.response?.data?.error || "Failed to load post");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // ✅ cleanup (important)
    return () => controller.abort();
  }, [postId]);

  // ✅ LOADING UI
  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  // ✅ POST NOT FOUND
  if (!post) {
    return (
      <div className="p-10 text-center text-gray-500">
        Post not found or deleted
      </div>
    );
  }

  return (
    <div className="px-5 xl:px-40 flex gap-5 w-full mt-16 bg-gray-100 min-h-screen">
      {/* LEFT SIDEBAR */}
      <div className="w-[22%] hidden md:flex flex-col gap-4 py-5 sticky top-24 h-fit">
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
      <div className="w-full sm:w-[50%] py-5 flex flex-col gap-5">
        <Post item={post} personaldata={personalData} />
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-[25%] hidden md:block py-5">
        <Card padding={1}>
          <div className="text-xl">JobVerse News</div>
          <div className="text-gray-600">Top stories</div>

          <div className="my-1">
            <div className="text-md">Buffett to remain Berkshire chair</div>
            <div className="text-xs text-gray-400">2h ago</div>
          </div>

          <div className="my-1">
            <div className="text-md">Foreign investment surge again</div>
            <div className="text-xs text-gray-400">1h ago</div>
          </div>
        </Card>

        <div className="my-5 sticky top-20">
          <Advertisment />
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
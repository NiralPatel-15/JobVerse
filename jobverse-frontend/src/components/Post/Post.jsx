import React, { useState, useRef, useEffect } from "react";
import Card from "../../components/Card/Card";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";


const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

const Post = ({ profile, item, personalData, onDelete }) => {
  const navigate = useNavigate(); // ✅ NEW
  const selfId = personalData?._id;

  const [liked, setLiked] = useState(item?.likes?.includes(selfId) || false);
  const [noOfLike, setNoOfLike] = useState(
    Array.isArray(item?.likes) ? item.likes.length : 0,
  );

  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDesc, setEditDesc] = useState("");
  const [editImage, setEditImage] = useState("");
  const [updating, setUpdating] = useState(false);

  const menuRef = useRef();

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const resp = await axios.get(`${API}/api/comment/${item._id}`);
      setComments(resp.data?.comments || []);
    } catch {
      toast.error("Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCommentBoxOpenClose = async () => {
    if (!item?._id) return;

    if (showComments) {
      setShowComments(false);
      return;
    }

    setShowComments(true);
    await fetchComments();
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const resp = await axios.post(
        `${API}/api/comment`,
        {
          postId: item._id,
          comment: newComment,
        },
        { withCredentials: true },
      );

      const newC = resp.data.comment;

      if (newC && newC.user) {
        setComments((prev) => [newC, ...prev]);
      } else {
        await fetchComments();
      }

      setNewComment("");
    } catch {
      toast.error("Failed to add comment");
    }
  };

  const handleLikeFunc = async () => {
    try {
      const resp = await axios.post(
        `${API}/api/post/likeDislike`,
        { postId: item._id },
        { withCredentials: true },
      );

      const likesData = resp.data.likes;

      if (Array.isArray(likesData)) {
        setNoOfLike(likesData.length);
      } else if (typeof likesData === "number") {
        setNoOfLike(likesData);
      } else {
        setNoOfLike(0);
      }

      setLiked(resp.data.userLiked);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${item._id}`;
    await navigator.clipboard.writeText(postUrl);
    toast.success("Post link copied!");
  };

  const desc = item?.desc || "";
  const commentCount = comments.length || item?.comments?.length || 0;

  const handleUpdatePost = async () => {
    try {
      setUpdating(true);

      let imageUrl = item.imageLink; // default old image

      // ✅ STEP 1: Upload image if selected
      if (editImage && typeof editImage !== "string") {
        const formData = new FormData();
        formData.append("image", editImage);

        const uploadRes = await axios.post(`${API}/api/upload`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadRes.data.imageUrl;
      }

      // ✅ STEP 2: Update post
      await axios.put(
        `${API}/api/post/${item._id}`,
        {
          desc: editDesc,
          imageLink: imageUrl,
        },
        { withCredentials: true },
      );

      toast.success("Post updated successfully");

      // eslint-disable-next-line react-hooks/immutability
      item.desc = editDesc;
      item.imageLink = imageUrl;

      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };
  

  const handleDeletePost = async () => {
    const result = await Swal.fire({
      title: "Delete Post?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API}/api/post/${item._id}`, {
        withCredentials: true,
      });

      Swal.fire("Deleted!", "Your post has been deleted.", "success");

      onDelete?.(item._id);
      setShowMenu(false);
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error!",
        err?.response?.data?.error || "Delete failed",
        "error",
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Card className="relative">
      {item?.user?._id?.toString() === selfId?.toString() && (
        <div ref={menuRef} className="absolute top-3 right-3">
          {/* BUTTON */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            ⋮
          </button>

          {/* MENU */}
          {showMenu && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg border w-44 z-20">
              <button
                onClick={handleShare}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Copy link
              </button>

              <button
                onClick={() => {
                  setEditDesc(item.desc || "");
                  setEditImage(item.imageLink || "");
                  setShowEditModal(true);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Edit post
              </button>

              <button
                onClick={handleDeletePost}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                Delete post
              </button>
            </div>
          )}
        </div>
      )}

      {/* USER INFO */}
      <Link
        to={`/profile/${item?.user?._id}`}
        className="flex gap-3 px-4 pt-4 pb-2"
      >
        <img
          src={
            item?.user?.profilePic && item.user.profilePic.trim() !== ""
              ? item.user.profilePic
              : "/default.png"
          }
          onError={(e) => (e.target.src = "/default.png")}
          className="rounded-full w-12 h-12 object-cover"
          alt="user"
        />

        <div>
          <div className="text-[15px] font-semibold text-gray-800">
            {item?.user?.f_name}
          </div>
          <div className="text-xs text-gray-500">{item?.user?.headline}</div>
        </div>
      </Link>

      {/* DESCRIPTION */}
      <div className="text-sm px-4 pb-3 text-gray-700 whitespace-pre-line">
        {desc}
      </div>

      {/* ✅ FIXED IMAGE (NO LINK INSIDE LINK) */}
      {/* ✅ FIXED IMAGE */}
      {item?.imageLink && (
        <div
          onClick={() => navigate(`/post/${item._id}`)}
          className="w-full mt-2 rounded-lg overflow-hidden cursor-pointer"
        >
          <img
            src={item.imageLink}
            alt="post"
            className="w-full h-auto max-h-[350px] object-cover rounded-lg"
          />
        </div>
      )}

      {/* COUNTS */}
      <div className="mt-2 px-4 flex justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <ThumbUpIcon sx={{ color: "#0a66c2", fontSize: 16 }} />
          {noOfLike}
        </div>
        <div>{commentCount} comments</div>
      </div>

      <div className="border-t border-gray-200 my-2"></div>

      {/* ACTIONS */}
      {!profile && (
        <div className="flex text-gray-600 text-sm">
          <div
            onClick={handleLikeFunc}
            className="w-1/3 flex justify-center gap-2 items-center py-2 cursor-pointer hover:bg-gray-100"
          >
            {liked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
            Like
          </div>

          <div
            onClick={handleCommentBoxOpenClose}
            className="w-1/3 flex justify-center gap-2 items-center py-2 cursor-pointer hover:bg-gray-100"
          >
            <CommentIcon /> Comment
          </div>

          <div
            onClick={handleShare}
            className="w-1/3 flex justify-center gap-2 items-center py-2 cursor-pointer hover:bg-gray-100"
          >
            <SendIcon /> Share
          </div>
        </div>
      )}

      {/* COMMENTS */}
      {showComments && (
        <div className="px-4 pb-3 pt-2 border-t">
          <div className="flex gap-2 mb-3">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border rounded-full px-4 py-2"
              placeholder="Add a comment..."
            />
            <button onClick={handleAddComment}>Post</button>
          </div>

          {loadingComments ? (
            <div className="text-sm text-gray-400">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-sm text-gray-400">Be the first to comment</div>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="py-2 flex gap-2 items-start">
                <img
                  src={c?.user?.profilePic || "/default.png"}
                  className="w-8 h-8 rounded-full object-cover"
                  alt="user"
                />

                <div className="flex flex-col">
                  {/* Name */}
                  <div className="text-sm font-semibold text-gray-800">
                    {c?.user?.f_name}
                  </div>

                  {/* Comment text */}
                  <div className="text-sm text-gray-600">{c?.text}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-5 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Edit Post</h2>

            {/* DESCRIPTION */}
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full border rounded p-2 mb-3"
              rows={4}
              placeholder="Update your post..."
            />

            {/* IMAGE LINK */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditImage(e.target.files[0])}
            />

            {/* BUTTONS */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdatePost}
                disabled={updating}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {updating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default Post;

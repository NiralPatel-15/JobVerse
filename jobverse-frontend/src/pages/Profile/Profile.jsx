import React, { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import Advertisment from "../../components/Advertisment/Advertisment";
import EditIcon from "@mui/icons-material/Edit";
import Post from "../../components/Post/Post";
import AddIcon from "@mui/icons-material/Add";
import Modal from "../../components/Modal/Modal";
import ImageModal from "../../components/ImageModal/ImageModal";
import EditInfoModal from "../../components/EditInfoModal/EditInfoModal";
import AboutMotal from "../../components/AboutModal/AboutModal";
import ExpModal from "../../components/ExpModal/ExpModal";
import MessageModal from "../../components/MessageModal/MessageModal";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Profile = () => {
  const { id } = useParams();

  const [imagesetModal, setImageModal] = useState(false);
  const [circularImage, setCircularImage] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  const [infoModal, setInfoModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);
  const [expModal, setExpModal] = useState(false);
  const [messageModal, setMessageModal] = useState(false);

  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState([]);
  const [_ownData, setOwnData] = useState(null);

  const [openToModal, setOpenToModal] = useState(false);
  const [openToOption, setOpenToOption] = useState("");

  const [loading, setLoading] = useState(true);
  const [recruiterJobs, setRecruiterJobs] = useState([]);

  const [updateExp, setUpdateExp] = useState({
    clicked: false,
    id: "",
    data: null,
  });

  const updateExpEdit = (id, data) => {
    setUpdateExp({
      clicked: true,
      id: id,
      data: data,
    });

    setExpModal(true);
  };

  // ✅ FIX: dependency added
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, postRes, ownRes] = await Promise.all([
          axios.get(`http://localhost:4000/api/auth/user/${id}`),
          axios.get(`http://localhost:4000/api/post/getTop5Post/${id}`),
          axios.get("http://localhost:4000/api/auth/self", {
            withCredentials: true,
          }),
        ]);

        const currentUser = ownRes.data.user || ownRes.data.own;

        setUserData(userRes.data.user);
        setPostData(postRes.data.posts || []);
        setOwnData(currentUser); // ✅ only once

        if (userRes.data.user.role === "recruiter") {
          const jobsRes = await axios.get(
            `http://localhost:4000/api/job/recruiter/${id}`,
          );

          setRecruiterJobs(jobsRes.data.jobs || []);
        }

        localStorage.setItem("userInfo", JSON.stringify(currentUser));
      } catch (err) {
        console.log("PROFILE ERROR:", err);
        console.log("STATUS:", err.response?.status);
        console.log("DATA:", err.response?.data);

        if (err.response?.status === 401) {
          console.log("User not logged in");
        } else {
          toast.error(err.response?.data?.error || "Failed to load profile ❌");
        }
      } finally {
        setLoading(false); // ✅ VERY IMPORTANT
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleMessageModal = () => {
    setMessageModal((prev) => !prev);
  };

  const handleExpModal = () => {
    setExpModal((prev) => !prev);

    if (expModal) {
      setUpdateExp({
        clicked: false,
        id: "",
        data: null,
      });
    }
  };

  const handleAboutModal = () => {
    setAboutModal((prev) => !prev);
  };

  const handleInfoModal = () => {
    setInfoModal((prev) => !prev);
  };

  const handleImageModalOpenClose = () => {
    setImageModal(false);
  };

  const handleOnEditCover = () => {
    setImageModal(true);
    setCircularImage(false);
    setSelectedImage("/banner1.png");
  };

  const handleCircularimageopen = () => {
    setImageModal(true);
    setCircularImage(true);
    setSelectedImage("/user.png");
  };

  const handleEditFunc = async (data) => {
    try {
      const res = await axios.put(
        `http://localhost:4000/api/auth/update`,
        { user: data },
        { withCredentials: true },
      );

      setUserData(res.data.user); // ✅ update without reload
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong ❌");
    }
  };

  // ONLY showing changed parts 👇

  // ✅ FIX 1: Safe optional chaining
  // ✅ check if already friends
  const amIFriend = () => {
    return userData?.friends?.some(
      (id) => id === _ownData?._id || id?._id === _ownData?._id,
    );
  };

  // ✅ request received (he sent you)
  const isInPendingList = () => {
    return userData?.received_requests?.some(
      (id) => id === _ownData?._id || id?._id === _ownData?._id,
    );
  };

  // ✅ request sent (you sent him)
  const isInSelfPendingList = () => {
    return _ownData?.sent_requests?.some(
      (id) => id === userData?._id || id?._id === userData?._id,
    );
  };

  // ✅ button text
  const checkFriendStatus = () => {
    if (amIFriend()) return "Disconnect";
    if (isInPendingList()) return "Request Pending";
    if (isInSelfPendingList()) return "Request Sent";
    return "Connect";
  };

  // ✅ FIX 2: TYPO FIX (VERY IMPORTANT)
  const handleSenderFriendRequest = async () => {
    const status = checkFriendStatus();

    try {
      if (status === "Connect") {
        const res = await axios.post(
          "http://localhost:4000/api/auth/sendFriendReq",
          { receiver: userData?._id },
          { withCredentials: true },
        );

        toast.success(res.data.message);
      } else if (status === "Request Pending") {
        await axios.post(
          "http://localhost:4000/api/auth/acceptFriendReq",
          { friendId: userData?._id },
          { withCredentials: true },
        );
      } else if (status === "Disconnect") {
        await axios.delete(
          `http://localhost:4000/api/auth/removeFromFriendList/${userData?._id}`,
          { withCredentials: true },
        );
      }

      // update UI without reload
      const updatedUser = await axios.get(
        `http://localhost:4000/api/auth/user/${id}`,
      );

      setUserData(updatedUser.data.user);
    } catch (err) {
      console.log(err);

      if (err.response?.status === 404) {
        toast.error("User not found ❌");
      } else if (err.response?.status === 400) {
        toast.error("Invalid user ID ❌");
      } else if (err.response?.status === 401) {
        console.log("User not logged in");
      } else {
        toast.error(err.response?.data?.error || "Something went wrong ❌");
      }
    }
  }; // ✅ VERY IMPORTANT (YOU MISSED THIS)

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!userData) {
    return <div className="text-center mt-10">User not found</div>;
  }

  const isRecruiter = userData?.role === "recruiter";

  // ✅ OPEN TO MODAL
  const handleOpenTo = () => {
    setOpenToModal(true);
  };

  const handleSaveOpenTo = () => {
    if (!openToOption) {
      toast.error("Please select an option");
      return;
    }

    toast.success(`Open to ${openToOption}`);
    setOpenToModal(false);
  };

  // ✅ SHARE PROFILE
  const handleShare = () => {
    const url = window.location.href;

    navigator.clipboard.writeText(url);

    toast.success("Profile link copied!");
  };

  return (
    <div className="px-5 xl:px-40 py-5 mt-5 flex flex-col gap-5 w-full pt-20 bg-gray-100">
      <div className="flex flex-col lg:flex-row gap-5">
        {/* LEFT */}
        <div className="w-full md:w-[70%]">
          {/* PROFILE CARD */}
          <Card padding={0}>
            <div className="w-full">
              {/* BANNER */}
              <div className="relative w-full h-52">
                {userData?._id === _ownData?._id && (
                  <div
                    onClick={handleOnEditCover}
                    className="absolute top-3 right-3 z-20 w-9 h-9 flex justify-center items-center rounded-full bg-white cursor-pointer"
                  >
                    <EditIcon />
                  </div>
                )}

                <img
                  src={userData?.cover_pic || "/banner1.png"}
                  className="w-full h-full object-cover rounded-t-xl"
                />

                <div
                  onClick={handleCircularimageopen}
                  className="absolute top-28 left-6"
                >
                  <img
                    src={userData?.profilePic || "/user.png"}
                    className="w-36
h-36
rounded-full
border-4
border-white
shadow-lg
object-cover
cursor-pointer
"
                  />
                </div>
              </div>

              {/* INFO */}
              <div className="mt-16 px-8 py-6 relative">
                {userData?._id === _ownData?._id && (
                  <div
                    className="absolute top-2 right-2 cursor-pointer"
                    onClick={handleInfoModal}
                  >
                    <EditIcon />
                  </div>
                )}

                <div className="text-3xl font-bold text-gray-900">
                  {userData?.f_name}
                </div>

                <div className="text-gray-700 text-lg mt-1">
                  {userData?.headline}
                </div>

                {/* ✅ ADD COMPANY HERE */}
                <div className="text-sm text-gray-600">
                  {userData?.curr_company}
                </div>

                <div className="text-sm text-gray-500">
                  {userData?.curr_location}
                </div>
                {!isRecruiter && (
                  <div className="text-sm font-medium text-blue-600 mt-1">
                    {userData?.friends?.length || 0} Connections
                  </div>
                )}
                {/* BUTTONS */}
                <div className="flex justify-between mt-4 flex-col md:flex-row">
                  {!isRecruiter && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleOpenTo}
                        className="
bg-gradient-to-r
from-blue-600
to-indigo-600
hover:from-blue-700
hover:to-indigo-700
text-white
px-5
py-2
rounded-xl
font-medium
transition
"
                      >
                        Open to
                      </button>

                      <button
                        onClick={handleShare}
                        className="
bg-gradient-to-r
from-blue-600
to-indigo-600
hover:from-blue-700
hover:to-indigo-700
text-white
px-5
py-2
rounded-xl
font-medium
transition
"
                      >
                        Share
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2 mt-2 md:mt-0">
                    {amIFriend() ? (
                      <button
                        onClick={handleMessageModal}
                        className="
bg-white
border
border-gray-300
hover:bg-gray-100
px-5
py-2
rounded-xl
font-medium
"
                      >
                        Message
                      </button>
                    ) : null}
                    {_ownData?._id &&
                      userData?._id &&
                      userData._id !== _ownData._id && (
                        <button
                          onClick={handleSenderFriendRequest}
                          className="
bg-blue-600
hover:bg-blue-700
text-white
px-5
py-2
rounded-xl
font-medium
shadow-sm
transition
"
                        >
                          {checkFriendStatus()}
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* ABOUT */}
          <div className="mt-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <div className="text-xl font-semibold">About</div>
                {userData?._id === _ownData?._id && (
                  <EditIcon
                    className="cursor-pointer"
                    onClick={handleAboutModal}
                  />
                )}
              </div>

              <div className="mt-2 text-gray-700">{userData?.about}</div>
            </Card>
          </div>

          {/* SKILLS */}
          {!isRecruiter && (
            <div className="mt-5">
              <Card padding={1}>
                <div className="flex justify-between items-center">
                  <div className="text-xl font-semibold">Skills</div>
                </div>

                <div className="flex gap-3 flex-wrap mt-3">
                  {userData?.skills?.map((item, index) => {
                    return (
                      <div
                        key={item._id || index}
                        className="py-2 px-3 cursor-pointer bg-blue-800 text-white rounded-lg"
                      >
                        {item}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          {isRecruiter && (
            <div className="mt-5">
              <Card padding={1}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold">Recruiter Information</h2>

                    {userData?.recruiterStatus === "approved" && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        ✓ Verified Recruiter
                      </span>
                    )}
                  </div>

                  {userData?._id === _ownData?._id && (
                    <button
                      onClick={handleInfoModal}
                      className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                      title="Edit Recruiter Information"
                    >
                      <EditIcon fontSize="small" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs uppercase text-gray-500">Company</p>
                    <p className="font-semibold text-gray-900">
                      {userData?.curr_company || "Not Provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-gray-500">Industry</p>
                    <p className="font-semibold">
                      {userData?.industry || "Not Provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-gray-500">
                      Company Size
                    </p>
                    <p className="font-semibold">
                      {userData?.companySize || "Not Provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-gray-500">Location</p>
                    <p className="font-semibold">
                      {userData?.curr_location || "Not Provided"}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-xs uppercase text-gray-500">Website</p>

                    {userData?.companyWebsite ? (
                      <a
                        href={userData.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {userData.companyWebsite}
                      </a>
                    ) : (
                      <p className="font-semibold">Not Provided</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-xs uppercase text-gray-500">Recruiter</p>

                    <p className="font-semibold">{userData?.f_name}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {isRecruiter && (
            <div className="mt-5">
              <Card padding={1}>
                <div className="text-xl font-semibold mb-4">
                  Active Jobs Posted
                </div>

                {recruiterJobs.length > 0 ? (
                  <div className="space-y-3">
                    {recruiterJobs.map((job) => (
                      <Link
                        key={job._id}
                        to={`/jobs/${job._id}`}
                        className="block border rounded-lg p-3 hover:bg-gray-50"
                      >
                        <div className="font-semibold">{job.title}</div>

                        <div className="text-sm text-gray-500">
                          {job.location}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500">No jobs posted yet</div>
                )}
              </Card>
            </div>
          )}

          {/* 🔥 ACTIVITY (PERFECT LINKEDIN STYLE) */}
          {!isRecruiter && (
            <div className="mt-5">
              <Card
                padding={1}
                className="rounded-lg border border-gray-200 shadow-none"
              >
                {/* HEADER */}
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xl font-semibold">Activity</div>
                    <div className="text-sm text-gray-500">
                      {userData?.friends?.length || 0} followers
                    </div>
                  </div>

                  <button className="border px-4 py-1 rounded-full text-sm hover:bg-gray-100">
                    Create a post
                  </button>
                </div>

                {/* TABS */}
                <div className="flex gap-3 mt-3">
                  <button className="bg-green-700 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Posts
                  </button>
                  <button className="border px-4 py-1 rounded-full text-sm hover:bg-gray-100">
                    Comments
                  </button>
                  <button className="border px-4 py-1 rounded-full text-sm hover:bg-gray-100">
                    Images
                  </button>
                </div>

                {/* POSTS GRID */}
                <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
                  {postData?.map((item) => (
                    <Link
                      key={item._id}
                      to={`/profile/${id}/activities/${item._id}`}
                    >
                      <div className="min-w-[280px] max-w-[300px] bg-white border border-gray-200 rounded-lg hover:shadow-md transition duration-200 overflow-hidden flex flex-col">
                        {item?.imageLink ? (
                          <img
                            src={item.imageLink}
                            className="w-full h-36 object-cover"
                          />
                        ) : (
                          <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                            No Image
                          </div>
                        )}

                        <div className="p-3 flex flex-col justify-between flex-1">
                          <div className="text-sm font-medium text-gray-800 line-clamp-2">
                            {item?.desc || "No description"}
                          </div>

                          <div className="text-xs text-gray-500 mt-2">
                            {item?.likes?.length || 0} likes
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* SHOW ALL */}
                {postData.length === 5 && (
                  <div className="flex justify-center mt-4">
                    <Link
                      to={`/profile/${id}/activities`}
                      className="text-blue-600 hover:underline flex items-center gap-1 text-sm font-medium"
                    >
                      Show all posts →
                    </Link>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* EXPERIENCE */}
          {/* 🔥 EXPERIENCE (FIXED LIKE LINKEDIN) */}
          {!isRecruiter && (
            <div className="mt-5">
              <Card
                padding={1}
                className="rounded-lg border border-gray-200 shadow-none"
              >
                {/* HEADER */}
                <div className="flex justify-between items-center">
                  <div className="text-xl font-semibold">Experience</div>
                  {userData?._id === _ownData?._id && (
                    <AddIcon
                      onClick={handleExpModal}
                      className="cursor-pointer"
                    />
                  )}
                </div>

                {/* LIST */}
                <div className="mt-4 flex flex-col gap-4">
                  {userData?.experience?.length > 0 ? (
                    userData?.experience?.map((item, index) => (
                      <div
                        key={item._id || index}
                        className="flex justify-between items-start border-t pt-3"
                      >
                        {/* LEFT CONTENT */}
                        <div>
                          <div className="font-semibold text-gray-800">
                            {item.designation}
                          </div>

                          <div className="text-sm text-gray-600">
                            {item.company_name}
                          </div>

                          <div className="text-sm text-gray-500">
                            {item.duration}
                          </div>

                          <div className="text-sm text-gray-500">
                            {item.location}
                          </div>
                        </div>

                        {/* RIGHT EDIT ICON */}
                        {userData?._id === _ownData?._id && (
                          <EditIcon
                            onClick={() => {
                              updateExpEdit(item._id, item);
                            }}
                            className="cursor-pointer text-gray-600 hover:text-black"
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm mt-2">
                      No experience added
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="my-5 sticky top-20">
          <Advertisment />
        </div>
      </div>

      {/* MODALS */}
      {imagesetModal && (
        <Modal closeModal={handleImageModalOpenClose} title="View Image">
          <ImageModal
            handleEditFunc={handleEditFunc}
            selfData={_ownData}
            isCircular={circularImage}
            image={selectedImage}
            closeModal={handleImageModalOpenClose}
          />
        </Modal>
      )}

      {infoModal && (
        <Modal title="Edit Info" closeModal={handleInfoModal}>
          <EditInfoModal
            handleEditFunc={handleEditFunc}
            selfData={userData}
            closeModal={handleInfoModal}
          />
        </Modal>
      )}

      {aboutModal && (
        <Modal title="About" closeModal={handleAboutModal}>
          <AboutMotal
            handleEditFunc={handleEditFunc}
            selfData={userData}
            closeModal={handleAboutModal}
          />
        </Modal>
      )}

      {expModal && (
        <Modal title="Experience" closeModal={handleExpModal}>
          <ExpModal
            handleEditFunc={handleEditFunc}
            selfData={userData}
            closeModal={handleExpModal}
            updateExp={updateExp}
            setUpdateExp={setUpdateExp}
          />
        </Modal>
      )}

      {messageModal && (
        <Modal title="Message" closeModal={handleMessageModal}>
          <MessageModal userData={userData} closeModal={handleMessageModal} />
        </Modal>
      )}

      {openToModal && (
        <Modal closeModal={() => setOpenToModal(false)} title="Open To">
          <div className="flex flex-col gap-4">
            <select
              value={openToOption}
              onChange={(e) => setOpenToOption(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select option</option>
              <option value="Hiring">Hiring</option>
              <option value="Work Opportunities">Work Opportunities</option>
              <option value="Freelance">Freelance</option>
            </select>

            <button
              onClick={handleSaveOpenTo}
              className="bg-blue-600 text-white py-2 rounded"
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      <ToastContainer />
    </div>
  );
};

export default Profile;

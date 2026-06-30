import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axiosConfig";

import Navbar2 from "../../components/Navbar2/Navbar2";
import Card from "../../components/Card/Card";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import Advertisment from "../../components/Advertisment/Advertisment";
import socket from "../../socket";

const ApplicationDetails = () => {
  const { id } = useParams();

  const [application, setApplication] = useState(null);

  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await axios.get(`/applications/details/${id}`);

        setApplication(res.data.application);

        setTimeline(res.data.timeline || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();

    socket.emit("joinApplicationRoom", id);

    return () => {
      socket.emit("leaveApplicationRoom", id);
    };
  }, [id]);

  useEffect(() => {
    socket.on("timelineUpdated", (data) => {
      if (data.applicationId === id) {
        setTimeline((prev) => [data.timelineItem, ...prev]);
      }
    });

    return () => {
      socket.off("timelineUpdated");
    };
  }, [id]);

  // =========================
  // STATUS COLORS
  // =========================

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-500";

      case "rejected":
        return "bg-red-500";

      case "shortlisted":
        return "bg-yellow-500";

      case "interview":
        return "bg-blue-500";

      case "applied":
        return "bg-purple-500";

      case "note":
        return "bg-indigo-500";

      case "feedback":
        return "bg-pink-500";

      case "offer_sent":
        return "bg-indigo-500";

      case "offer_accepted":
        return "bg-green-600";

      case "offer_rejected":
        return "bg-red-600";

      case "hired":
        return "bg-emerald-600";

      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <Navbar2 />

      <div
        className="
          px-5
          xl:px-40
          pt-24
          pb-10
          flex
          gap-5
          w-full
          bg-gray-100
          min-h-screen
        "
      >
        {/* LEFT */}
        <div
          className="
            w-[25%]
            hidden
            md:flex
            flex-col
            gap-4
            sticky
            top-24
            h-fit
          "
        >
          <ProfileCard />
        </div>

        {/* CENTER */}
        <div className="w-full md:w-[50%]">
          <Card
            padding={0}
            className="
    rounded-3xl
    border
    border-gray-200
    shadow-sm
    overflow-hidden
    bg-white
  "
          >
            {loading ? (
              <div className="p-6 text-center text-gray-500">
                Loading application...
              </div>
            ) : !application ? (
              <div className="p-6 text-center text-red-500">
                Application not found
              </div>
            ) : (
              <div className="p-6">
                {/* JOB TITLE */}
                {/* HEADER */}
                <div
                  className="
    border-b
    border-gray-100
    pb-6
    flex
    items-start
    justify-between
    gap-4
  "
                >
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                      {application.job?.title}
                    </h1>

                    <p className="text-gray-500 mt-2 text-sm">
                      Real-time Application Tracking System
                    </p>
                  </div>

                  <div
                    className={`
      px-4
      py-2
      rounded-2xl
      text-white
      text-sm
      font-semibold
      capitalize
      shadow-sm
      ${getStatusColor(application.status)}
    `}
                  >
                    {application.status}
                  </div>
                </div>

                {/* STATUS */}
                <div className="mt-6">
                  <p className="text-gray-500 text-sm">Application Status</p>

                  <span
                    className={`
                      inline-block
                      mt-2
                      px-4
                      py-2
                      rounded-full
                      text-white
                      text-sm
                      font-medium
                      capitalize
                      ${getStatusColor(application.status)}
                    `}
                  >
                    {application.status}
                  </span>
                  <div
                    className="
    mt-5
    inline-flex
    items-center
    gap-2
    px-3
    py-2
    rounded-full
    bg-green-50
    border
    border-green-100
  "
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>

                    <span className="text-xs text-green-700 font-semibold tracking-wide">
                      LIVE REALTIME UPDATES ENABLED
                    </span>
                  </div>
                </div>

                {/* APPLICANT */}
                <div
                  className="
    mt-10
    p-5
    rounded-2xl
    border
    border-gray-100
    bg-gray-50
  "
                >
                  <p className="text-gray-500 text-sm">Applicant</p>

                  <div className="flex items-center gap-4 mt-3">
                    <img
                      src={application.user?.profilePic || "/user.png"}
                      alt="user"
                      className="
                        w-16
                        h-16
                        rounded-full
                        object-cover
                      "
                    />

                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {application.user?.f_name}
                      </h2>

                      <p className="text-gray-500">{application.user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* RESUME */}
                <div className="mt-10">
                  <a
                    href={application.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="
  inline-flex
  items-center
  justify-center
  gap-2
  px-6
  py-3
  rounded-2xl
  bg-gradient-to-r
  from-blue-600
  to-indigo-600
  hover:scale-[1.02]
  hover:shadow-lg
  text-white
  font-semibold
  transition-all
  duration-300
"
                  >
                    View Resume
                  </a>
                  {/* TIMELINE */}
                  {/* TIMELINE */}
                  <div className="mt-14">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                          Application Timeline
                        </h2>

                        <p className="text-gray-500 mt-1 text-sm">
                          Live ATS activity and recruiter actions
                        </p>
                      </div>
                    </div>

                    <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                      {timeline.map((item) => (
                        <div key={item._id} className="relative pl-10">
                          {/* TIMELINE DOT */}
                          <div
                            className={`
            absolute
            -left-[11px]
            top-1
            w-5
            h-5
            rounded-full
            border-4
            border-white
            shadow-md
            ${getStatusColor(item.type)}
          `}
                          ></div>

                          {/* CARD */}
                          <div
                            className="
            bg-white
            border
            border-gray-100
            rounded-2xl
            p-5
            shadow-sm
            hover:shadow-md
            transition-all
            duration-300
          "
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-bold text-lg text-gray-900">
                                  {item.title}
                                </h3>

                                <p className="text-gray-600 mt-2 leading-relaxed">
                                  {item.description}
                                </p>
                              </div>

                              <span
                                className={`
                px-3
                py-1
                rounded-full
                text-xs
                font-semibold
                text-white
                capitalize
                whitespace-nowrap
                ${getStatusColor(item.type)}
              `}
                              >
                                {item.type}
                              </span>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <p className="text-xs text-gray-400">
                                {new Date(item.createdAt).toLocaleString()}
                              </p>

                              <div className="text-xs text-gray-500 font-medium">
                                ATS Event
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* RIGHT */}
        <div className="w-[25%] hidden md:block">
          <div className="sticky top-24">
            <Advertisment />
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationDetails;

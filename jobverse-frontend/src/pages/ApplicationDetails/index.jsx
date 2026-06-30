import React, { useEffect, useState, useCallback } from "react";

import { useParams } from "react-router-dom";

import axios from "../../api/axiosConfig";

import ApplicationTimeline from "../../components/ApplicationTimeline";

const Index = () => {
  const { id } = useParams();

  const [application, setApplication] = useState(null);

  const [loading, setLoading] = useState(true);

  // ========================================= 
  // FETCH APPLICATION DETAILS
  // =========================================

  const fetchApplication = useCallback(async () => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("recruiterToken");

      const res = await axios.get(`/applications/details/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplication(res.data.application);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [fetchApplication, id]);



  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading application...</p>
      </div>
    );
  }

  // =========================================
  // NO DATA
  // =========================================

  if (!application) {
    return (
      <div className="p-6">
        <p>Application not found</p>
      </div>
    );
  }

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <div className="p-6 space-y-6">
      {/* APPLICATION DETAILS CARD */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-4">{application.job?.title}</h1>

        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">Applicant:</span>{" "}
            {application.user?.f_name}
          </p>

          <p>
            <span className="font-semibold">Status:</span> {application.status}
          </p>

          <p>
            <span className="font-semibold">Applied At:</span>{" "}
            {new Date(application.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* TIMELINE */}

      <ApplicationTimeline applicationId={application._id} />
    </div>
  );
};

export default Index;

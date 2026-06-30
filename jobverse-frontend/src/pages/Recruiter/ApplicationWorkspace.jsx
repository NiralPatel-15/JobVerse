import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axiosConfig";
import WorkspaceHeader from "../../components/Recruiter/workspace/WorkspaceHeader";
import CandidateProfileCard from "../../components/Recruiter/workspace/CandidateProfileCard";
import ResumePreviewPanel from "../../components/Recruiter/workspace/ResumePreviewPanel";
import TimelinePanel from "../../components/Recruiter/workspace/TimelinePanel";
import RecruiterActions from "../../components/Recruiter/workspace/RecruiterActions";
import ActivityFeed from "../../components/Recruiter/workspace/ActivityFeed";
import InterviewFeedbackModal from "../../components/Recruiter/interviews/InterviewFeedbackModal";
import InterviewSchedulePanel from "../../components/Recruiter/workspace/InterviewSchedulePanel";
import SendOfferModal from "../../components/Recruiter/offers/SendOfferModal";

const ApplicationWorkspace = () => {
  const { id } = useParams();

  const [application, setApplication] = useState(null);

  const [loading, setLoading] = useState(true);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const [showOfferModal, setShowOfferModal] = useState(false);

  // =========================================
  // FETCH APPLICATION
  // =========================================

  const fetchApplication = useCallback(async () => {
    try {
      const res = await axios.get(`/applications/details/${id}`);

      setApplication(res.data.application);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchApplication();
  }, [fetchApplication]);

  useEffect(() => {
    const handler = () => {
      setShowOfferModal(true);
    };

    window.addEventListener("open-offer-modal", handler);

    return () => {
      window.removeEventListener("open-offer-modal", handler);
    };
  }, []);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center">
        <div className="bg-white px-8 py-5 rounded-3xl shadow-sm border border-gray-200">
          <p className="text-gray-700 font-medium">Loading ATS Workspace...</p>
        </div>
      </div>
    );
  }

  // =========================================
  // NOT FOUND
  // =========================================

  if (!application) {
    return (
      <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center">
        <div className="bg-white px-8 py-5 rounded-3xl shadow-sm border border-gray-200">
          <p className="text-red-500 font-medium">Application not found</p>
        </div>
      </div>
    );
  }

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <div className="min-h-screen bg-[#f4f6f8] pt-24 pb-10">
      <div className="max-w-[1600px] mx-auto px-6">
        {/* HEADER */}

        <WorkspaceHeader application={application} />

        {/* MAIN GRID */}

        <div className="grid grid-cols-12 gap-6 mt-6">
          {/* ========================================= */}
          {/* LEFT SIDEBAR */}
          {/* ========================================= */}

          <div className="col-span-12 lg:col-span-3">
            <div className="sticky top-28 space-y-6">
              <CandidateProfileCard application={application} />

              <RecruiterActions
                application={application}
                refreshApplication={fetchApplication}
              />

              <button
                onClick={() => setShowFeedbackModal(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-2xl font-medium shadow-sm transition"
              >
                Add Interview Feedback
              </button>
{/* 
              <CollaborationSidebar applicationId={id} /> */}
            </div>
          </div>

          {/* ========================================= */}
          {/* CENTER CONTENT */}
          {/* ========================================= */}

          <div className="col-span-12 lg:col-span-6 space-y-6">
            <ResumePreviewPanel application={application} />

            <TimelinePanel applicationId={id} />
            <InterviewSchedulePanel applicationId={id} />
{/* 
            <RecruiterNotesPanel applicationId={id} /> */}
{/* 
            <ApplicationDiscussionPanel applicationId={id} /> */}
          </div>

          {/* ========================================= */}
          {/* RIGHT SIDEBAR */}
          {/* ========================================= */}

          <div className="col-span-12 lg:col-span-3">
            <div className="sticky top-28">
              <ActivityFeed applicationId={id} />
            </div>
          </div>
        </div>

        {/* INTERVIEW FEEDBACK MODAL */}

        {showFeedbackModal && (
          <InterviewFeedbackModal
            applicationId={id}
            onClose={() => setShowFeedbackModal(false)}
          />
        )}

        {showOfferModal && (
          <SendOfferModal
            application={application}
            onClose={() => setShowOfferModal(false)}
            onSuccess={fetchApplication}
          />
        )}
      </div>
    </div>
  );
};

export default ApplicationWorkspace;

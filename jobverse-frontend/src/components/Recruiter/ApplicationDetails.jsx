import { useEffect, useState, useCallback } from "react";

import { useParams } from "react-router-dom";

import axios from "../../api/axiosConfig";

import AICandidateInsightsCard from "../../components/Recruiter/workspace/AICandidateInsightsCard";

import RankedCandidatesTable from "../../components/Recruiter/workspace/RankedCandidatesTable";

import RecruiterCopilotPanel from "../../components/Recruiter/copilot/RecruiterCopilotPanel";

import InterviewQuestionsPanel from "../../components/Recruiter/interview/InterviewQuestionsPanel";

import PipelineAutomationCard from "../../components/Recruiter/workspace/PipelineAutomationCard";

import AIShortlistDashboard from "../../components/Recruiter/workspace/AIShortlistDashboard";

import RecruiterPriorityQueue from "../../components/Recruiter/workspace/RecruiterPriorityQueue";

import TalentMatchDashboard from "../../components/Recruiter/workspace/TalentMatchDashboard";

import EnterpriseChatPanel from "../communication/EnterpriseChatPanel"; 

const ApplicationDetails = () => {
  const { id: applicationId } = useParams();

  const [application, setApplication] = useState(null);

  const [scoreData, setScoreData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState(null);

  const [conversationId, setConversationId] = useState(null);

  // =====================================
  // FETCH CURRENT USER
  // =====================================

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await axios.get("/auth/me");

      setCurrentUser(res.data.user);
    } catch (err) {
      console.error("Failed to fetch current user", err);
    }
  }, []);

  // =====================================
  // FETCH APPLICATION
  // =====================================

  const fetchApplication = useCallback(async () => {
    try {
      const res = await axios.get(`/applications/${applicationId}`);

      setApplication(res.data);
    } catch (err) {
      console.error("Failed to fetch application", err);
    }
  }, [applicationId]);

  // =====================================
  // FETCH AI SCORE
  // =====================================

  const fetchCandidateScore = useCallback(async () => {
    try {
      const res = await axios.get(`/candidate-score/${applicationId}`);

      setScoreData(res.data.candidateScore);
    } catch (err) {
      console.error("Failed to fetch AI score", err);
    }
  }, [applicationId]);

  // =====================================
  // LOAD MAIN DATA
  // =====================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        await Promise.all([
          fetchApplication(),
          fetchCandidateScore(),
          fetchCurrentUser(),
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchApplication, fetchCandidateScore, fetchCurrentUser]);

  // =====================================
  // INITIALIZE CONVERSATION
  // =====================================

  useEffect(() => {
    let cancelled = false;

    const initConversation = async () => {
      if (!application || !currentUser || cancelled) return;

      try {
        const res = await axios.post(
          "/communication/conversation/get-or-create",
          {
            applicationId,
            participants: [currentUser._id, application.user?._id],
          },
        );

        if (!cancelled) {
          setConversationId(res.data._id);
        }
      } catch (error) {
        console.error("Conversation init failed", error);
      }
    };

    initConversation();

    return () => {
      cancelled = true;
    };
  }, [application, currentUser, applicationId]);

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return <div className="p-10 text-center">Loading application...</div>;
  }

  // =====================================
  // APPLICATION NOT FOUND
  // =====================================

  if (!application) {
    return (
      <div className="p-10 text-center text-red-500">Application not found</div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}

      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h1 className="text-3xl font-bold">
          {application.user?.f_name || "Candidate"}
        </h1>

        <p className="text-gray-500 mt-2">{application.job?.title}</p>

        <div className="mt-4 flex gap-3 flex-wrap">
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
            Status: {application.status}
          </span>

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            AI Powered ATS
          </span>
        </div>
      </div>

      {/* ENTERPRISE MODULES */}

      <div className="space-y-6">
        <AICandidateInsightsCard scoreData={scoreData} />

        <PipelineAutomationCard applicationId={applicationId} />

        <AIShortlistDashboard jobId={application.job?._id} />

        <RankedCandidatesTable jobId={application.job?._id} />

        <RecruiterCopilotPanel applicationId={applicationId} />

        <InterviewQuestionsPanel applicationId={applicationId} />

        <RecruiterPriorityQueue jobId={application.job?._id} />

        <TalentMatchDashboard jobId={application.job?._id} />

        {/* ENTERPRISE CHAT */}

        {currentUser && conversationId && (
          <EnterpriseChatPanel
            conversationId={conversationId}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
};

export default ApplicationDetails;
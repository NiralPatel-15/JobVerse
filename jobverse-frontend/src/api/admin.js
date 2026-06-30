import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// =======================
// ADMIN LOGIN
// =======================
export const adminLoginAPI = async (data) => {
  return API.post("/api/admin/login", data);
};

// ======================================
// GET DASHBOARD STATS
// ======================================
export const getDashboardStatsAPI = async () => {

  const token = localStorage.getItem("adminToken");

  return API.get("/api/admin/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ======================================
// GET ALL USERS
// ======================================
export const getAllUsersAPI = async (
  page = 1,
  search = ""
) => {

  const token =
    localStorage.getItem("adminToken");

  return API.get(
    `/api/admin/users?page=${page}&search=${search}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


// ======================================
// BLOCK / UNBLOCK USER
// ======================================
export const toggleUserStatusAPI = async (
  id
) => {

  const token =
    localStorage.getItem("adminToken");

  return API.put(
    `/api/admin/users/${id}/status`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


// ======================================
// DELETE USER
// ======================================
export const deleteUserAPI = async (id) => {

  const token =
    localStorage.getItem("adminToken");

  return API.delete(
    `/api/admin/users/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// ======================================
// GET ALL RECRUITERS
// ======================================
export const getAllRecruitersAPI =
  async () => {

    const token =
      localStorage.getItem("adminToken");

    return API.get(
      "/api/admin/recruiters",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };


// ======================================
// UPDATE RECRUITER STATUS
// ======================================
export const updateRecruiterStatusAPI =
  async (id, recruiterStatus) => {

    const token =
      localStorage.getItem("adminToken");

    return API.put(
      `/api/admin/recruiters/${id}/status`,
      { recruiterStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  // ======================================
// GET ALL JOBS
// ======================================
export const getAllJobsAdminAPI = async (
  page = 1,
  search = "",
  status = "all",
  classification = "all",
) => {
  const token = localStorage.getItem("adminToken");

  return API.get(
    `/api/admin/jobs?page=${page}&search=${search}&status=${status}&classification=${classification}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const getJobModerationStatsAPI = async () => {
  const token = localStorage.getItem("adminToken");

  return API.get("/api/admin/jobs/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// ======================================
// DELETE JOB
// ======================================
export const deleteJobAdminAPI =
  async (id) => {

    const token =
      localStorage.getItem("adminToken");

    return API.delete(
      `/api/admin/jobs/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  // ======================================
// UPDATE JOB STATUS
// ======================================
export const updateJobStatusAdminAPI =
  async (id, status) => {

    const token =
      localStorage.getItem("adminToken");

    return API.put(
      `/api/admin/jobs/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  // ======================================
// GET REPORTS
// ======================================
export const getAllReportsAPI =
  async () => {

    const token =
      localStorage.getItem(
        "adminToken"
      );

    return API.get(
      "/api/admin/reports",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };


// ======================================
// UPDATE REPORT STATUS
// ======================================
export const updateReportStatusAPI =
  async (id, status) => {

    const token =
      localStorage.getItem(
        "adminToken"
      );

    return API.put(
      `/api/admin/reports/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  // ======================================
// ADMIN LOGOUT
// ======================================
export const adminLogoutAPI = async () => {
  const token = localStorage.getItem("adminToken");

  return API.post(
    "/api/admin/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// ======================================
// CHANGE ADMIN PASSWORD
// ======================================
export const changeAdminPasswordAPI = async (data) => {
  const token = localStorage.getItem("adminToken");

  return API.put(
    "/api/admin/change-password",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
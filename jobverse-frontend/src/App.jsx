import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MyNetwork from "./pages/MyNetwork/MyNetwork";
import Navbar1 from "./components/Navbar1/Navbar1";
import Landingpage from "./pages/LandingPage/LandingPage";
import Footer from "./components/Footer/Footer";
import SignUp from "./pages/SignUP/SignUp";
import Login from "./pages/Login/Login";
import Navbar2 from "./components/Navbar2/Navbar2";
import Feeds from "./pages/Feeds/Feeds";
import Resume from "./pages/Resume/Resume";
import Messages from "./pages/Messages/Messages";
import Notification from "./pages/Notification/Notification";
import Profile from "./pages/Profile/Profile";
import AllActivities from "./pages/AllActivities/AllActivities";
import PostDetails from "./pages/PostDetails/PostDetails";
import Loader from "./components/Loader/Loader";
import Search from "./pages/Search/Search";
import { ToastContainer } from "react-toastify";
import axios from "./api/axiosConfig";
import "react-toastify/dist/ReactToastify.css";
import Jobs from "./pages/Jobs/Jobs";
import JobDetails from "./pages/Jobs/JobDetails";
import PostJob from "./pages/Jobs/PostJob";
import Applicants from "./pages/Jobs/Applicants";
import ApplyJob from "./pages/Jobs/ApplyJob";
import RecruiterDashboard from "./pages/Recruiter/RecruiterDashboard";
import AdminLogin from "./pages/Admin/AdminLogin";
import ChangePassword from "./pages/Admin/ChangePassword";
import Dashboard from "./admin/pages/Dashboard";
import Users from "./admin/pages/Users";
import Recruiters from "./admin/pages/Recruiters";
import AdminJobs from "./admin/pages/Jobs";
// import Analytics from "./admin/pages/Analytics";
import Reports from "./admin/pages/Reports";
import AdminProtectedRoute from "./admin/routes/AdminProtectedRoute";
import AdminAnalytics from "./admin/pages/AdminAnalytics";
import SocketListener from "./components/SocketListener";
import ApplicationDetails from "./pages/Applications/ApplicationDetails";
import ApplicationWorkspace from "./pages/Recruiter/ApplicationWorkspace";
import AnalyticsDashboard from "./pages/Recruiter/AnalyticsDashboard";
import CommunicationWorkspace from "./pages/Recruiter/CommunicationWorkspace";
import MyOffers from "./pages/Offers/MyOffers";
import MyInterviews from "./pages/Interviews/MyInterviews";
import AIAssistantButton from "./components/AI/AIAssistantButton";
import AIAssistantModal from "./components/AI/AIAssistantModal";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [showAI, setShowAI] = useState(false);

  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  const storedUser = localStorage.getItem("userInfo");
  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const publicRoutes = ["/", "/login", "/signUp"];

  const isPublicRoute = publicRoutes.includes(location.pathname);

  const isCandidate = user?.role === "user";

  const shouldShowAI =
    isLogin && isCandidate && !isAdminRoute && !isPublicRoute;

  const changeLoginValue = (val) => {
    setIsLogin(val);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/auth/self");

        const user = response.data?.user;

        if (user) {
          setIsLogin(true);
          localStorage.setItem("userInfo", JSON.stringify(user));
          localStorage.setItem("isLogin", "true");
        } else {
          setIsLogin(false);
          localStorage.removeItem("userInfo");
          localStorage.removeItem("isLogin");
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          setIsLogin(false);
          setShowAI(false);

          localStorage.removeItem("userInfo");
          localStorage.removeItem("isLogin");

          return;
        }

        console.error(err);
      } finally {
        setShowLoader(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!shouldShowAI) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowAI(false);
    }
  }, [shouldShowAI]);

  // ✅ loader while checking auth
  if (showLoader) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col">
      <SocketListener />
      <div className="grow">
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route
            path="/"
            element={
              isLogin ? (
                <Navigate to="/feeds" />
              ) : (
                <>
                  <Navbar1 />
                  <Landingpage changeLoginValue={changeLoginValue} />
                </>
              )
            }
          />
          <Route
            path="/login"
            element={
              isLogin ? (
                <Navigate to="/feeds" />
              ) : (
                <>
                  <Navbar1 />
                  <Login changeLoginValue={changeLoginValue} />
                </>
              )
            }
          />
          <Route
            path="/signUp"
            element={
              isLogin ? (
                <Navigate to="/feeds" />
              ) : (
                <>
                  <Navbar1 />
                  <SignUp changeLoginValue={changeLoginValue} />
                </>
              )
            }
          />
          {/* ================= PROTECTED ROUTES ================= */}
          <Route
            path="/feeds"
            element={
              isLogin ? (
                <>
                  <Navbar2 />
                  <Feeds />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/myNetwork"
            element={
              isLogin ? (
                <>
                  <Navbar2 />
                  <MyNetwork />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/resume"
            element={
              isLogin ? (
                <>
                  <Navbar2 />
                  <Resume />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/messages"
            element={
              isLogin ? (
                <>
                  <Navbar2 />
                  <Messages />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/notification"
            element={
              isLogin ? (
                <>
                  <Navbar2 />
                  <Notification />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/profile/:id"
            element={
              isLogin ? (
                <>
                  <Navbar2 />
                  <Profile />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/profile/:id/activities"
            element={
              isLogin ? (
                <>
                  <Navbar2 />
                  <AllActivities />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/post/:postId"
            element={
              isLogin ? (
                <>
                  <Navbar2 />
                  <PostDetails />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/profile/:id/activities/:postId"
            element={
              isLogin ? (
                <>
                  <Navbar2 />
                  <PostDetails />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/search"
            element={
              isLogin ? (
                <>
                  <Navbar2 />
                  <Search />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/jobs"
            element={
              isLogin ? (
                <>
                  <Navbar2 />
                  <Jobs />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/job/:id"
            element={
              isLogin ? (
                <>
                  <Navbar2 />
                  <JobDetails />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/jobs/post"
            element={
              isLogin ? (
                <>
                  <Navbar2 />
                  <PostJob />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/recruiter/job/:id/applicants"
            element={
              isLogin ? (
                <>
                  <Navbar2 />
                  <Applicants />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/apply/:id"
            element={
              isLogin ? (
                <>
                  <Navbar2 />
                  <ApplyJob />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/recruiter/dashboard"
            element={
              isLogin ? (
                <>
                  <Navbar2 />
                  <RecruiterDashboard />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/change-password"
            element={
              <AdminProtectedRoute>
                <ChangePassword />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <Dashboard />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <Users />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/recruiters"
            element={
              <AdminProtectedRoute>
                <Recruiters />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/jobs"
            element={
              <AdminProtectedRoute>
                <AdminJobs />
              </AdminProtectedRoute>
            }
          />

          {/* <Route
            path="/admin/analytics"
            element={
              <AdminProtectedRoute>
                <Analytics />
              </AdminProtectedRoute>
            }
          /> */}
          <Route
            path="/admin/recruiters"
            element={
              <AdminProtectedRoute>
                <Recruiters />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <AdminProtectedRoute>
                <Reports />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <AdminProtectedRoute>
                <AdminAnalytics />
              </AdminProtectedRoute>
            }
          />

          <Route path="/applications/:id" element={<ApplicationDetails />} />

          <Route
            path="/recruiter/applications/:id/workspace"
            element={
              isLogin ? (
                <>
                  <Navbar2 />
                  <ApplicationWorkspace />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* <Route path="/recruiter/analytics" element={<AnalyticsDashboard />} /> */}

          <Route
            path="/recruiter/analytics"
            element={
              isLogin ? (
                <>
                  <Navbar2 />
                  <AnalyticsDashboard />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/recruiter/communication"
            element={
              isLogin ? (
                <>
                  <Navbar2 />
                  <CommunicationWorkspace />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* </Routes> */}
          {/* <Route
          path="/recruiter/communication"
          element={<CommunicationWorkspace />}
        /> */}

          <Route
            path="/offers"
            element={
              isLogin ? (
                <>
                  <Navbar2 />
                  <MyOffers />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/interviews"
            element={
              isLogin ? (
                <>
                  <Navbar2 />
                  <MyInterviews />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          
        {/* ✅ 404 ROUTE */}
        <Route path="*" element={<Navigate to="/" />} />
        </Routes>

      </div>

      {shouldShowAI && (
        <>
          <AIAssistantButton onClick={() => setShowAI(true)} />

          {showAI && <AIAssistantModal onClose={() => setShowAI(false)} />}
        </>
      )}

      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;

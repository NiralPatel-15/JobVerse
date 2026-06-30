import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import DescriptionIcon from "@mui/icons-material/Description";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { toast } from "react-toastify";
import NotificationDropdown from "../Notifications/NotificationDropdown";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

// import useNotifications from "../../hooks/useNotifications";

const Navbar2 = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);

  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null); // ✅ FIX

  const [searchTerm, setSearchTerm] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);

  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ NEW

  const isRecruiter =
    userData?.role === "recruiter" || userData?.role === "recruiter_manager";
  const [offerCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // const offerCount = 3;

  // ✅ ENTER SEARCH
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (!searchTerm.trim()) return;
      navigate(`/search?q=${searchTerm}`);
      setShowDropdown(false);
    }
  };

  // ✅ LIVE SEARCH (FIXED + SAFE)
  useEffect(() => {
    let isMounted = true;

    const delay = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "https://jobverse-api.onrender.com"}/api/user/search?q=${searchTerm}`,
        );
        const data = await res.json();

        if (isMounted) {
          setResults(data || []);
          setShowDropdown(true);
        }
      } catch (err) {
        console.log(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(delay);
    };
  }, [searchTerm]);

  // ✅ NOTIFICATION COUNT
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/notification/activeNotification`,
          {
            credentials: "include",
          },
        );

        const data = await res.json();
        setNotificationCount(data.count || 0);
      } catch (err) {
        console.log("NOTIFICATION COUNT ERROR:", err);
      }
    };

    fetchNotificationCount();
    const interval = setInterval(fetchNotificationCount, 10000);

    return () => clearInterval(interval);
  }, []);

  // ✅ LOAD USER
  useEffect(() => {
    const loadUser = () => {
      try {
        const data = localStorage.getItem("userInfo");

        if (!data || data === "undefined") {
          setUserData(null);
          return;
        }

        const parsed = JSON.parse(data);

        if (!parsed || !parsed._id) {
          setUserData(null);
          return;
        }

        setUserData(parsed);
      } catch {
        setUserData(null);
      }
    };

    loadUser();
    window.addEventListener("storage", loadUser);

    return () => window.removeEventListener("storage", loadUser);
  }, []);

  // ✅ OUTSIDE CLICK FIX
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpenDropdown(false);
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const navItemStyle = (path) =>
    `flex flex-col items-center justify-center
   cursor-pointer
   px-3 py-1
   transition-all
   ${
     location.pathname === path
       ? "text-blue-600 font-semibold"
       : "text-gray-500 hover:text-blue-600"
   }`;

  const iconColor = (path) =>
    location.pathname === path ? "#2563eb" : "#6b7280";

  const handleProfileClick = () => {
    setOpenDropdown((prev) => !prev);
  };

  const goToProfile = () => {
    try {
      if (userData?._id) {
        navigate(`/profile/${userData._id}`);
        setOpenDropdown(false);
      } else {
        toast.error("User not logged in");
      }
    } catch (err) {
      console.log(err);
      toast.error("Invalid user data");
    }
  };

  // ✅ LOGOUT
  const handleLogout = async () => {
    try {
      // ✅ call backend logout first
      await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/user/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      // ✅ clear frontend storage
      localStorage.removeItem("userInfo");
      localStorage.removeItem("isLogin");
      sessionStorage.clear();

      // ✅ FULL RESET (important)
      window.location.href = "/login";
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ REALTIME NOTIFICATION UPDATE
  useEffect(() => {
    if (!localStorage.getItem("isLogin")) return; // ✅ STOP after logout

    const fetchNotificationCount = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/notification/activeNotification`,
          {
            credentials: "include",
          },
        );

        const data = await res.json();
        setNotificationCount(data.count || 0);
      } catch (err) {
        console.log("NOTIFICATION COUNT ERROR:", err);
      }
    };

    fetchNotificationCount();

    const interval = setInterval(fetchNotificationCount, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white fixed top-0 w-full z-50 shadow-sm">
      <div className="flex justify-between items-center px-4 sm:px-6 py-2 max-w-[1400px] mx-auto">
        {/* LEFT */}
        <div className="flex items-center gap-3 relative z-50">
          <div className="flex md:hidden items-center justify-between w-full">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-100"
            >
              <MenuIcon />
            </button>

            <h1 className="text-xl font-bold text-slate-900">JobVerse</h1>

            {/* <div className="w-10"></div> */}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <img src="/logo.jpeg" alt="logo" className="w-9 h-9 rounded-lg" />
          </div>

          <div className="relative hidden md:block w-[280px] lg:w-[320px]">
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              fontSize="small"
            />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              className="
w-full
pl-10
pr-4
py-2.5
bg-slate-50
border
border-slate-200
rounded-xl
text-sm
outline-none
focus:ring-2
focus:ring-blue-500
focus:border-blue-500
transition-all
"
            />

            {showDropdown && (
              <div
                className="
  absolute
  top-full
  left-0
  mt-2
  w-full
  bg-white
  rounded-2xl
  border
  border-slate-200
  shadow-2xl
  overflow-hidden
  z-[999]
  "
              >
                {loading ? (
                  <div className="p-3 text-gray-500">Searching...</div>
                ) : results.length === 0 ? (
                  <div className="p-3 text-gray-500">No users found</div>
                ) : (
                  results.map((user) => (
                    <div
                      key={user._id}
                      className="
flex
items-center
gap-3
p-3
hover:bg-blue-50
cursor-pointer
transition
"
                      onClick={() => {
                        navigate(`/profile/${user._id}`);

                        setSearchTerm("");
                        setResults([]);
                        setShowDropdown(false);
                      }}
                    >
                      <img
                        src={user.profilePic || "/user.png"}
                        alt="user"
                        onError={(e) => (e.target.src = "/user.png")}
                        className="w-11 h-11 rounded-full"
                      />
                      <div>
                        <div className="font-semibold">{user.f_name}</div>
                        <div className="text-sm text-gray-500">
                          {user.headline}
                        </div>
                      </div>
                    </div>
                  ))
                )}

                <div
                  className="text-center text-blue-600 p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    navigate(`/search?q=${searchTerm}`);
                    setShowDropdown(false);
                  }}
                >
                  See all results
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex gap-4 lg:gap-6 xl:gap-8 items-center">
          {!isRecruiter && (
            <>
              <Link to="/feeds" className={navItemStyle("/feeds")}>
                <HomeIcon sx={{ color: iconColor("/feeds") }} />
                <span className="hidden xl:block text-sm">Home</span>
              </Link>

              <Link to="/myNetwork" className={navItemStyle("/myNetwork")}>
                <PeopleIcon sx={{ color: iconColor("/myNetwork") }} />
                <span className="hidden xl:block text-sm">Network</span>
              </Link>

              <Link to="/resume" className={navItemStyle("/resume")}>
                <DescriptionIcon sx={{ color: iconColor("/resume") }} />
                <span className="hidden xl:block text-sm">Resume</span>
              </Link>

              <Link to="/jobs" className={navItemStyle("/jobs")}>
                <WorkIcon sx={{ color: iconColor("/jobs") }} />
                <span className="hidden xl:block text-sm">Jobs</span>
              </Link>
            </>
          )}

          {isRecruiter && (
            <>
              <Link to="/feeds" className={navItemStyle("/feeds")}>
                <PeopleIcon sx={{ color: iconColor("/feeds") }} />
                <span className="hidden xl:block text-sm">Community</span>
              </Link>
              
              <Link
                to="/recruiter/dashboard"
                className={navItemStyle("/recruiter/dashboard")}
              >
                <HomeIcon sx={{ color: iconColor("/recruiter/dashboard") }} />
                <span className="hidden xl:block text-sm">Dashboard</span>
              </Link>

              <Link to="/jobs" className={navItemStyle("/jobs")}>
                <WorkIcon sx={{ color: iconColor("/jobs") }} />
                <span className="hidden xl:block text-sm">Jobs</span>
              </Link>

              <Link
                to="/recruiter/analytics"
                className={navItemStyle("/recruiter/analytics")}
              >
                <DescriptionIcon
                  sx={{ color: iconColor("/recruiter/analytics") }}
                />
                <span className="hidden xl:block text-sm">Analytics</span>
              </Link>
            </>
          )}
          <Link to="/messages" className={navItemStyle("/messages")}>
            <MessageIcon
              sx={{
                color: iconColor("/messages"),
                fontSize: 26,
              }}
            />
            <span className="hidden xl:block text-sm">Messages</span>
          </Link>

          {/* NOTIFICATIONS */}
          <Link to="/notification" className={navItemStyle("/notification")}>
            <div className="relative">
              <NotificationsIcon
                sx={{
                  color: iconColor("/notification"),
                  fontSize: 26,
                }}
              />

              {notificationCount > 0 && (
                <span
                  className="
          absolute
          -top-2
          -right-2
          min-w-[18px]
          h-[18px]
          flex
          items-center
          justify-center
          rounded-full
          bg-red-500
          text-white
          text-[10px]
          font-bold
        "
                >
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </div>

            <span className="hidden xl:block text-sm">Notifications</span>
          </Link>

          {/* OFFERS */}
          {!isRecruiter && (
          <Link to="/offers" className={navItemStyle("/offers")}>
            <div className="relative">
              <LocalOfferIcon
                sx={{
                  color: iconColor("/offers"),
                  fontSize: 26,
                }}
              />

              {offerCount > 0 && (
                <span
                  className="
          absolute
          -top-2
          -right-2
          min-w-[18px]
          h-[18px]
          flex
          items-center
          justify-center
          rounded-full
          bg-emerald-500
          text-white
          text-[10px]
          font-bold
        "
                >
                  {offerCount > 99 ? "99+" : offerCount}
                </span>
              )}
            </div>

            <span className="hidden xl:block text-sm">Offers</span>
          </Link>
          )}

          {/* <InvitationBell /> */}

          {/* PROFILE */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={handleProfileClick}
              className="
    flex
    items-center
    gap-2
    cursor-pointer
    px-2
    py-1
    rounded-xl
    hover:bg-slate-100
    transition-all
  "
            >
              <img
                src={userData?.profilePic || "/user.png"}
                alt="profile"
                onError={(e) => (e.target.src = "/user.png")}
                className="w-10 h-10 rounded-full border-2 border-slate-200"
              />
              <div className="hidden xl:block">
                <p className="text-sm font-medium text-gray-800">
                  {userData?.f_name || "User"}
                </p>

                <p className="text-xs text-gray-500">
                  {userData?.role || "Member"}
                </p>
              </div>
            </div>

            {openDropdown && (
              <div
                className="
absolute
right-0
mt-3
w-80
bg-white
border
border-slate-200
rounded-2xl
shadow-[0_10px_40px_rgba(0,0,0,0.12)]
overflow-hidden
z-50
"
              >
                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <div className="flex gap-3 items-center">
                    <img
                      src={userData?.profilePic || "/user.png"}
                      alt="profile"
                      onError={(e) => (e.target.src = "/user.png")}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="font-semibold">
                        {userData?.f_name || "User"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {userData?.headline || "Headline"}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={goToProfile}
                    className="
mt-4
w-full
bg-blue-600
text-white
rounded-xl
py-2
font-medium
hover:bg-blue-700
transition
"
                  >
                    View Profile
                  </button>
                </div>

                <div className="p-2 text-sm">
                  <div
                    className="
px-4
py-3
hover:bg-slate-50
cursor-pointer
transition
"
                  >
                    Account Settings
                  </div>
                  <div
                    className="
px-4
py-3
hover:bg-slate-50
cursor-pointer
transition
"
                  >
                    Help
                  </div>
                  <div
                    className="
px-4
py-3
hover:bg-slate-50
cursor-pointer
transition
"
                  >
                    Language
                  </div>
                </div>

                <div className="border-t p-2">
                  <div
                    onClick={handleLogout}
                    className="
px-4
py-3
text-red-600
hover:bg-red-50
cursor-pointer
font-medium
transition
"
                  >
                    Logout
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div
            className="
      fixed
      top-0
      left-0
      h-full
      w-72
      bg-white
      z-50
      shadow-2xl
      md:hidden
      "
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-bold text-lg">JobVerse</h2>

              <button onClick={() => setMobileMenuOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            <div className="flex flex-col p-3">
              {!isRecruiter ? (
                <>
                  <Link to="/feeds" className="mobileNav">
                    Home
                  </Link>

                  <Link to="/myNetwork" className="mobileNav">
                    Network
                  </Link>

                  <Link to="/resume" className="mobileNav">
                    Resume
                  </Link>

                  <Link to="/jobs" className="mobileNav">
                    Jobs
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/recruiter/dashboard" className="mobileNav">
                    Dashboard
                  </Link>

                  <Link to="/feeds" className="mobileNav">
                    Community
                  </Link>

                  <Link to="/jobs" className="mobileNav">
                    Jobs
                  </Link>

                  <Link to="/recruiter/analytics" className="mobileNav">
                    Analytics
                  </Link>
                </>
              )}

              <Link to="/messages" className="mobileNav">
                Messages
              </Link>

              <Link to="/notification" className="mobileNav">
                Notifications
              </Link>

              <Link to="/offers" className="mobileNav">
                Offers
              </Link>

              <button
                onClick={handleLogout}
                className="mobileNav text-red-600 text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(Navbar2);

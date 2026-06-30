import React from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar1 = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.jpeg"
            alt="JobVerse"
            className="w-10 h-10 rounded-xl object-cover shadow-sm"
          />

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
              JobVerse
            </h1>

            <p className="text-xs text-gray-500 -mt-1">
              Career & Hiring Platform
            </p>
          </div>
        </Link>

        {/* RIGHT NAV */}
        <div className="flex items-center gap-2 sm:gap-3">
          <NavLink
            to="/signUp"
            className={({ isActive }) =>
              `px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Join Now
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              `px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-700 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`
            }
          >
            Sign In
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default React.memo(Navbar1);

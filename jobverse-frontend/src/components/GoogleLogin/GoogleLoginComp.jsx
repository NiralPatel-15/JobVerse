import React, { useState, memo } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const GoogleLoginComp = ({ changeLoginValue }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    flow: "auth-code",

    onSuccess: async (tokenResponse) => {
      setLoading(true);

      try {
        const token = tokenResponse?.code;

        if (!token) {
          toast.error("Google authentication failed");
          return;
        }

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/google`,
          { token },
          {
            withCredentials: true,
          }
        );

        if (!res?.data?.user) {
          toast.error("User data not found");
          return;
        }

        const user = res.data.user;

        localStorage.setItem("isLogin", "true");
        localStorage.setItem(
          "userInfo",
          JSON.stringify(user)
        );

        if (res.data.token) {
          localStorage.setItem(
            "token",
            res.data.token
          );
        }

        changeLoginValue(true);

        toast.success("Login successful");

        if (user?.role === "recruiter") {
          navigate("/jobs");
        } else {
          navigate("/feeds");
        }
      } catch (err) {
        console.log(
          err?.response?.data || err.message
        );

        toast.error(
          err?.response?.data?.message ||
            "Google login failed"
        );
      } finally {
        setLoading(false);
      }
    },

    onError: () => {
      toast.error("Google Login Failed");
    },
  });

  return (
    <button
      type="button"
      onClick={() => !loading && login()}
      disabled={loading}
      className="
        w-full
        h-12
        flex
        items-center
        justify-center
        gap-3
        bg-white
        border
        border-gray-300
        rounded-xl
        font-medium
        text-gray-700
        transition-all
        hover:border-gray-400
        hover:shadow-md
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        loading="lazy"
        className="w-5 h-5 object-contain"
      />

      {loading
        ? "Signing in..."
        : "Continue with Google"}
    </button>
  );
};

export default memo(GoogleLoginComp);


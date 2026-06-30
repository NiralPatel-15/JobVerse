import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import GoogleLoginComp from "../../components/GoogleLogin/GoogleLoginComp";
import { ToastContainer, toast } from "react-toastify";
import axios from "../../api/axiosConfig";

const Login = ({ changeLoginValue }) => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loginField, setLoginField] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const onChangeInput = (event, key) => {
    setLoginField({
      ...loginField,
      [key]: event.target.value,
    });
  };

  const handleLogin = async () => {
    if (loading) return;

    if (
      loginField.email.trim() === "" ||
      loginField.password.trim() === ""
    ) {
      return toast.error("Please fill all credentials");
    }

    if (!loginField.email.includes("@")) {
      return toast.error("Enter valid email");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "/auth/login",
        loginField,
        {
          withCredentials: true,
        }
      );

      const user = res?.data?.user;
      const token = res?.data?.token;

      if (!token) {
        return toast.error("Token not received from server");
      }

      changeLoginValue(true);

      localStorage.setItem("isLogin", "true");
      localStorage.setItem("userInfo", JSON.stringify(user));
      localStorage.setItem("token", token);

      toast.success("Login successful");

      if (user?.role === "recruiter") {
        navigate("/jobs");
      } else {
        navigate("/feeds");
      }
    } catch (err) {
      console.log(err);

      toast.error(
        err?.response?.data?.error || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 rounded-3xl shadow-lg p-8">
            <div className="flex flex-col items-center mb-8">
              <img
                src="/logo.jpeg"
                alt="JobVerse"
                className="w-16 h-16 rounded-2xl object-cover shadow-sm"
              />

              <h1 className="text-3xl font-bold mt-4 text-gray-900">
                Welcome Back
              </h1>

              <p className="text-gray-500 text-center mt-2">
                Sign in to access your JobVerse account
              </p>
            </div>

            <div className="mb-6">
              <GoogleLoginComp changeLoginValue={changeLoginValue} />
            </div>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 border-t border-gray-200"></div>

              <span className="text-sm text-gray-500">Continue with email</span>

              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={loginField.email}
                  onChange={(e) => onChangeInput(e, "email")}
                  onKeyDown={handleKeyDown}
                  className="w-full h-12 px-4 border border-gray-300 rounded-xl outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginField.password}
                    onChange={(e) => onChangeInput(e, "password")}
                    onKeyDown={handleKeyDown}
                    className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-xl outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className={`w-full h-12 rounded-xl font-semibold text-white transition-all ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg"
                }`}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>

            <div className="text-center mt-6 text-gray-600">
              New to JobVerse?
              <Link
                to="/signUp"
                className="ml-2 font-semibold text-blue-600 hover:text-blue-700"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default Login;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import GoogleLoginComp from "../../components/GoogleLogin/GoogleLoginComp";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const SignUp = ({ changeLoginValue }) => {
  const navigate = useNavigate();
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);


  const [registerField, setRegisterField] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    f_name: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);

  const handleInputField = (event, key) => {
    setRegisterField({
      ...registerField,
      [key]: event.target.value,
    });
  };

  const handleRegister = async () => {
    const email = registerField.email.trim();
    const password = registerField.password.trim();
    const confirmPassword = registerField.confirmPassword.trim();
    const f_name = registerField.f_name.trim();

    if (!email || !password || !f_name) {
      return toast.error("Please provide complete information");
    }

    if (password.length < 6) {
      return toast.error(
        "Password must be at least 6 characters"
      );
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (!acceptedTerms) {
      return toast.error("Please accept Terms & Conditions");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://jobverse-api.onrender.com"/api/auth/register",
        {
          email,
          password,
          f_name,
          role: registerField.role,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(
        res.data?.message ||
          "You have registered successfully"
      );

      setRegisterField({
        email: "",
        password: "",
        confirmPassword: "",
        f_name: "",
        role: "user",
      });

      navigate("/login");
    } catch (err) {
      console.log(err.response?.data || err.message);

      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return "";

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length >= 8 && hasUpper && hasLower && hasNumber) {
      return " Strong";
    }

    if (password.length >= 6) {
      return " Medium";
    }

    return " Weak";
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="bg-white border border-gray-200 rounded-3xl shadow-lg p-8">
            <div className="flex flex-col items-center mb-8">
              <img
                src="/logo.jpeg"
                alt="JobVerse"
                className="w-16 h-16 rounded-2xl object-cover shadow-sm"
              />

              <h1 className="text-3xl font-bold mt-4 text-gray-900">
                Create Account
              </h1>

              <p className="text-gray-500 text-center mt-2">
                Join JobVerse and start your career journey
              </p>

              <div className="w-full mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <div>✅ Apply for Jobs</div>
                  <div>✅ Track Applications</div>
                  <div>✅ Attend Interviews</div>
                  <div>✅ Receive Offers</div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={registerField.f_name}
                  onChange={(e) => handleInputField(e, "f_name")}
                  className="w-full h-12 px-4 border border-gray-300 rounded-xl outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={registerField.email}
                  onChange={(e) => handleInputField(e, "email")}
                  className="w-full h-12 px-4 border border-gray-300 rounded-xl outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    value={registerField.password}
                    onChange={(e) => handleInputField(e, "password")}
                    className="w-full h-14 px-4 pr-14 border border-gray-300 rounded-xl outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={registerField.confirmPassword}
                    onChange={(e) => handleInputField(e, "confirmPassword")}
                    className="w-full h-14 px-4 pr-14 border border-gray-300 rounded-xl outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      registerField.password.length >= 8
                        ? "w-full bg-green-500"
                        : registerField.password.length >= 6
                          ? "w-2/3 bg-yellow-500"
                          : registerField.password.length > 0
                            ? "w-1/3 bg-red-500"
                            : "w-0"
                    }`}
                  />
                </div>

                <p className="text-sm mt-2 font-medium">
                  {getPasswordStrength(registerField.password)}
                </p>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Password should contain at least 8 characters, one uppercase
                letter and one number.
              </p>

              {/* Account Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Account Type
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setRegisterField({
                        ...registerField,
                        role: "user",
                      })
                    }
                    className={`p-4 rounded-xl border transition-all ${
                      registerField.role === "user"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">&#128188;</div>
                    <div className="font-semibold">Job Seeker</div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setRegisterField({
                        ...registerField,
                        role: "recruiter",
                      })
                    }
                    className={`p-4 rounded-xl border transition-all ${
                      registerField.role === "recruiter"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">
                      &#128104;&#8205;&#128188;
                    </div>
                    <div className="font-semibold">Recruiter</div>
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4"
                />

                <label className="text-sm text-gray-600">
                  I agree to the Terms & Conditions
                </label>
              </div>

              <button
                onClick={handleRegister}
                disabled={loading}
                className={`w-full h-12 rounded-xl font-semibold text-white transition-all ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg"
                }`}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 border-t border-gray-200"></div>

              <span className="text-sm text-gray-500">
                Or continue with Google
              </span>

              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <GoogleLoginComp changeLoginValue={changeLoginValue} />
          </div>

          <div className="text-center mt-6 text-gray-600">
            Already have an account?
            <Link
              to="/login"
              className="ml-2 font-semibold text-blue-600 hover:text-blue-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default SignUp;


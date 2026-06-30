import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GoogleLoginComp from "../../components/GoogleLogin/GoogleLoginComp";

// ✅ moved outside
const images = ["/logo1.png", "/slide2.png", "/slide3.png"];

const Landingpage = ({ changeLoginValue }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length === 0) return; // ✅ safety

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000); // ✅ improved timing

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center">
      {/* LEFT */}
      <div className="md:w-[45%]">
        <div className="text-4xl text-gray-600 mb-6">
          Welcome To Your Professional Community
        </div>

        <div className="mb-4 w-[80%]">
          <GoogleLoginComp changeLoginValue={changeLoginValue} />
        </div>

        <Link
          to="/login"
          className="block w-[80%] text-center py-3 border border-gray-300 rounded-full bg-white hover:bg-gray-100 mb-4"
        >
          Sign in with email
        </Link>

        <div className="text-sm w-[80%] mb-6">
          By clicking Continue to join or sign in, you agree to
          <span className="text-blue-800 hover:underline cursor-pointer">
            {" "}
            JobVerse's User Agreement
          </span>
          , Privacy Policy and Cookie Policy.
        </div>

        <Link to="/signUp" className="text-lg">
          New to JobVerse?
          <span className="text-blue-800 hover:underline ml-1">Join now</span>
        </Link>
      </div>

      {/* RIGHT */}
      <div className="md:w-[45%] mt-10 md:mt-0 relative">
        <img
          key={current} // ✅ forces animation refresh
          src={images[current]}
          alt={`slide-${current}`} // ✅ better alt
          className="w-full h-[450px] object-cover rounded-xl transition-opacity duration-700 opacity-100"
        />
      </div>
    </div>
  );
};

export default Landingpage;
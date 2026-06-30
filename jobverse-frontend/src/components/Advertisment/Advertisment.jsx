import React, { useMemo } from "react";
import Card from "../../components/Card/Card";

const Advertisment = () => {
  const userData = useMemo(() => {
    try {
      const data = localStorage.getItem("userInfo");

      if (data && data !== "undefined") {
        return JSON.parse(data);
      }
    } catch (err) {
      console.log("Invalid JSON:", err);
    }

    return null;
  }, []);

  return (
    <div className="sticky top-20">
      <Card>
        <div className="relative">
          <div className="h-24 w-full overflow-hidden rounded-t-md">
            <img
              src="/banner1.png"
              className="w-full h-full object-cover"
              alt="banner"
              onError={(e) => (e.target.src = "/banner1.png")}
            />
          </div>

          <img
            src={userData?.profilePic || "/user.png"}
            className="absolute left-1/2 -translate-x-1/2 -bottom-7 h-14 w-14 rounded-full border-4 border-white"
            alt="user"
            onError={(e) => (e.target.src = "/user.png")}
          />
        </div>

        <div className="px-5 pt-10 pb-5 text-center">
          <div className="text-sm font-semibold">
            {userData?.f_name || "Guest"}
          </div>

          <div className="text-sm my-3">
            Get the latest jobs and industry news
          </div>

          <div className="text-sm p-2 rounded-2xl font-bold border border-blue-900 text-white bg-blue-800 cursor-pointer">
            Explore
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Advertisment;
import React from "react";
import Card from "../../components/Card/Card";
import { Link } from "react-router-dom";

const ProfileCard = (props) => {
  const data = props?.data;

  if (!data) return null;

  return (
    <Card padding={false}>
      <Link to={`/profile/${data._id}`} className="block">
        
        {/* COVER IMAGE */}
        <div className="w-full aspect-[3/1] rounded-t-md bg-gray-100 overflow-hidden flex items-center justify-center">
          <img
            src={data.cover_pic || "/default-cover.jpg"}
            alt="cover"
            onError={(e) => (e.target.src = "/default-cover.jpg")}
            className="w-full h-full object-contain"
          />
        </div>

        {/* PROFILE IMAGE */}
        <div className="relative">
          <img
            src={data.profilePic || "/user.png"}
            alt="profile"
            onError={(e) => (e.target.src = "/user.png")}
            className="absolute left-5 -top-8 h-16 w-16 rounded-full border-4 border-white object-cover"
          />
        </div>

        {/* USER INFO */}
        <div className="p-5 pt-10">
          <div className="text-lg font-semibold truncate">
            {data.f_name || "User"}
          </div>

          <div className="text-sm my-1 text-gray-600 truncate">
            {data.headline || "No headline"}
          </div>

          <div className="text-sm text-gray-500 truncate">
            {data.curr_location || "Location"}
          </div>

          <div className="text-sm text-gray-500 truncate">
            {data.curr_company || "Company"}
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default React.memo(ProfileCard);
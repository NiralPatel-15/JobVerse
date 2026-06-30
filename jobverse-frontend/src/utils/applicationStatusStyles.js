export const getStatusStyles = (status) => {
  switch (status) {
    case "shortlisted":
      return "bg-yellow-100 text-yellow-700";

    case "rejected":
      return "bg-red-100 text-red-700";

    case "interview":
      return "bg-blue-100 text-blue-700";

    case "accepted":
      return "bg-green-100 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

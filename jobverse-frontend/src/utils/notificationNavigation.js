export const handleNotificationNavigation = (notification, navigate) => {
  console.log("TYPE:", notification.type);
  console.log("NOTIFICATION:", notification);

  switch (notification?.type) {
    // INTERVIEWS
    case "interviewScheduled":
    case "interviewRescheduled":
    case "interviewCompleted":
    case "interviewCancelled":
      navigate("/interviews");
      return;

    // OFFERS
    case "offerSent":
    case "offerAccepted":
    case "offerRejected":
      navigate("/my-offers");
      return;

    // APPLICATIONS
    case "applicationStatus":
      if (notification?.applicationId) {
        navigate(`/applications/${notification.applicationId}`);
      } else {
        navigate("/my-applications");
      }
      return;

    default:
      if (
        notification?.redirectUrl &&
        notification.redirectUrl !== "undefined"
      ) {
        navigate(notification.redirectUrl);
      } else {
        navigate("/notification");
      }
  }
};

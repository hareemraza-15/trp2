// CustomRoute.js
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CustomRoute = ({ element, allowedRoles }) => {
  // Replace this with your actual user role retrieval logic

  // const user = useSelector((state) => state.auth);

  const user = {
    isLogin: true,
    currentUser: {
      userName: "Rohan",
      role: ["admin"],
    },
  };

  if (!user.isLogin) {
    // Redirect to the login page if user is not authenticated
    return <Navigate to="/login" />;
  }

  // Check if the user's role is allowed to access the route
  if (allowedRoles.some((role) => user.currentUser?.role.includes(role))) {
    // if (allowedRoles.includes(user.role)) {
    return element;
  } else {
    // Redirect to a forbidden page or display an error message
    return <Navigate to="/forbidden" />;
  }
};

export default CustomRoute;

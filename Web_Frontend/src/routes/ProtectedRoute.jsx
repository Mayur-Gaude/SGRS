import { Navigate, useLocation }
from "react-router-dom";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
}) => {

  const location = useLocation();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // ❌ not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  // 🚨 banned user
  if (
    user.account_status === "BANNED"
  ) {

    // only allow appeal page
    console.log(user);
    if (
      location.pathname !==
      "/user/appeals"
    ) {

      return (
        <Navigate to="/user/appeals" />
      );
    }
  }

  // ❌ wrong role
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {

    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ element }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? <Navigate to="/" replace /> : element;
};

export default PublicRoute;

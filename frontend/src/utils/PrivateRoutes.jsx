import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function PrivateRoutes({ children, ...rest }) {
  const { user } = useContext(AuthContext);

  return !user ? <Navigate to="/register" /> : children;
}

export default PrivateRoutes;
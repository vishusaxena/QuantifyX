import React from "react";
import { usedata } from "../context/dataContext";
import { Navigate, useLocation } from "react-router-dom";

const PublicRoutes = ({ children }) => {
  const { currentUser } = usedata();
  const location = useLocation();

  if (
    currentUser &&
    location.pathname !== "/login" &&
    location.pathname !== "/register"
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoutes;

import React from "react";
import { usedata } from "../context/dataContext";
import { Navigate } from "react-router-dom";

const PublicRoutes = ({ children }) => {
  const { currentUser } = usedata();

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoutes;
